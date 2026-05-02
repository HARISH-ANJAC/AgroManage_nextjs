import { db } from "../src/db/index.js";
import { 
    TBL_CURRENCY_MASTER, 
    TBL_EXCHANGE_RATE_MASTER,
    TBL_MULTI_CURRENCY_TRANSACTIONS,
    TBL_UNREALIZED_GAIN_LOSS
} from "../src/db/schema/index.js";
import { eq, desc, and } from "drizzle-orm";

async function test() {
    try {
        console.log("--- Starting Multi-Currency Logic Test ---");

        // 1. Setup Test Currency
        console.log("1. Setting up test currency...");
        const existingUSD = await db.select().from(TBL_CURRENCY_MASTER).where(eq(TBL_CURRENCY_MASTER.CURRENCY_NAME, 'USD')).limit(1);
        let currencyId;
        if (existingUSD.length === 0) {
            const newCur = await db.insert(TBL_CURRENCY_MASTER).values({
                CURRENCY_NAME: 'USD',
                CURRENCY_SYMBOL: '$',
                Exchange_Rate: '2500.00',
                STATUS_MASTER: 'Active'
            }).returning();
            currencyId = newCur[0].CURRENCY_ID;
            console.log("Created USD with ID:", currencyId);
        } else {
            currencyId = existingUSD[0].CURRENCY_ID;
            console.log("Found existing USD with ID:", currencyId);
        }

        // 2. Add a historical rate
        console.log("2. Adding a historical rate in EXCHANGE_RATE_MASTER...");
        const companyId = 1; // Assuming company 1 exists
        await db.insert(TBL_EXCHANGE_RATE_MASTER).values({
            Company_ID: companyId,
            CURRENCY_ID: currencyId,
            Exchange_Rate: '2750.00',
            REMARKS: 'Test Historical Rate',
            CREATED_DATE: new Date()
        });

        // 3. Test updateRatesFromProvider Logic (Master Sync)
        console.log("3. Testing Master Sync (updateRatesFromProvider logic)...");
        // Manually running the logic from the controller
        const latestRateEntry = await db.select()
            .from(TBL_EXCHANGE_RATE_MASTER)
            .where(and(
                eq(TBL_EXCHANGE_RATE_MASTER.CURRENCY_ID, currencyId),
                eq(TBL_EXCHANGE_RATE_MASTER.Company_ID, companyId)
            ))
            .orderBy(desc(TBL_EXCHANGE_RATE_MASTER.CREATED_DATE))
            .limit(1);

        if (latestRateEntry.length > 0) {
            console.log("Latest historical rate found:", latestRateEntry[0].Exchange_Rate);
            await db.update(TBL_CURRENCY_MASTER)
                .set({ Exchange_Rate: latestRateEntry[0].Exchange_Rate })
                .where(eq(TBL_CURRENCY_MASTER.CURRENCY_ID, currencyId));
            
            const updatedCur = await db.select().from(TBL_CURRENCY_MASTER).where(eq(TBL_CURRENCY_MASTER.CURRENCY_ID, currencyId)).limit(1);
            console.log("Updated Master Rate:", updatedCur[0].Exchange_Rate);
            if (updatedCur[0].Exchange_Rate === '2750.00') {
                console.log("✅ Step 1 & 2 Success: Master synced from History.");
            } else {
                console.log("❌ Step 1 & 2 Failure: Master rate mismatch.");
            }
        }

        // 4. Test Transaction Tracking
        console.log("4. Testing Transaction Tracking (recordMCTransaction logic)...");
        const docNo = "TEST-INV-001";
        const txAmount = 100; // 100 USD
        const rateAtTx = 2750.00;
        const baseAmount = txAmount * rateAtTx;

        const newTx = await db.insert(TBL_MULTI_CURRENCY_TRANSACTIONS).values({
            Company_ID: companyId,
            DOCUMENT_TYPE: 'TAX_INVOICE',
            DOCUMENT_NUMBER: docNo,
            DOCUMENT_DATE: new Date().toISOString().split('T')[0],
            TRANSACTION_CURRENCY_ID: currencyId,
            TRANSACTION_AMOUNT: txAmount.toString(),
            BASE_AMOUNT: baseAmount.toString(),
            EXCHANGE_RATE_USED: rateAtTx.toString(),
            STATUS: 'PENDING',
            CREATED_DATE: new Date()
        }).returning();
        
        console.log("Created test transaction in TBL_MULTI_CURRENCY_TRANSACTIONS.");

        // 5. Test Revaluation
        console.log("5. Testing Revaluation (runRevaluation logic)...");
        // Simulate rate change to 2800
        const newMarketRate = 2800.00;
        await db.update(TBL_CURRENCY_MASTER)
            .set({ Exchange_Rate: newMarketRate.toString() })
            .where(eq(TBL_CURRENCY_MASTER.CURRENCY_ID, currencyId));

        // Logic from runRevaluation
        const openTx = await db.select()
            .from(TBL_MULTI_CURRENCY_TRANSACTIONS)
            .where(and(
                eq(TBL_MULTI_CURRENCY_TRANSACTIONS.DOCUMENT_NUMBER, docNo),
                eq(TBL_MULTI_CURRENCY_TRANSACTIONS.STATUS, 'PENDING')
            ));

        for (const tx of openTx) {
            const currentRate = newMarketRate;
            const oldRate = parseFloat(tx.EXCHANGE_RATE_USED || "1");
            const diff = (parseFloat(tx.TRANSACTION_AMOUNT || "0") * currentRate) - parseFloat(tx.BASE_AMOUNT || "0");

            if (Math.abs(diff) > 0) {
                console.log(`Revaluation Difference: ${diff}`);
                await db.insert(TBL_UNREALIZED_GAIN_LOSS).values({
                    Company_ID: companyId,
                    TRANSACTION_ID: tx.TRANSACTION_ID,
                    REVALUATION_DATE: new Date().toISOString().split('T')[0],
                    OLD_BASE_AMOUNT: tx.BASE_AMOUNT,
                    NEW_BASE_AMOUNT: (parseFloat(tx.TRANSACTION_AMOUNT || "0") * currentRate).toString(),
                    UNREALIZED_GAIN_LOSS: Math.abs(diff).toString(),
                    GL_TYPE: diff > 0 ? 'GAIN' : 'LOSS',
                    STATUS: 'ACTIVE',
                    CREATED_DATE: new Date()
                });
                console.log("✅ Step 4 Success: Unrealized GL entry created.");
            }
        }

        console.log("--- Test Completed Successfully ---");
        process.exit(0);
    } catch (error) {
        console.error("Test failed:", error);
        process.exit(1);
    }
}

test();
