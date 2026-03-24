import { db } from "./index.js";
import { 
    TBL_ROLE_MASTER, 
    TBL_CURRENCY_MASTER, 
    TBL_COMPANY_MASTER, 
    TBL_LOCATION_MASTER, 
    TBL_STORE_MASTER, 
    TBL_PRODUCT_MAIN_CATEGORY_MASTER, 
    TBL_PRODUCT_SUB_CATEGORY_MASTER, 
    TBL_PRODUCT_UOM_MASTER, 
    TBL_PRODUCT_MASTER,
    TBL_USER_INFO_HDR
} from "./schema/index.js";
import bcrypt from "bcryptjs";

async function seed() {
    console.log("🌱 Seeding database...");

    try {
        // 1. Roles
        console.log(" - Seeding Roles...");
        const roles = await db.insert(TBL_ROLE_MASTER).values([
            { ROLE_NAME: "Admin", ROLE_DESCRIPTION: "Full System Access", STATUS_MASTER: "Active" },
            { ROLE_NAME: "Manager", ROLE_DESCRIPTION: "Operational Access", STATUS_MASTER: "Active" },
            { ROLE_NAME: "User", ROLE_DESCRIPTION: "Standard User Access", STATUS_MASTER: "Active" }
        ]).onConflictDoNothing().returning();

        // 2. Currencies
        console.log(" - Seeding Currencies...");
        const currencies = await db.insert(TBL_CURRENCY_MASTER).values([
            { CURRENCY_NAME: "TZS", Exchange_Rate: "1.00000", STATUS_MASTER: "Active" },
            { CURRENCY_NAME: "USD", Exchange_Rate: "2500.00000", STATUS_MASTER: "Active" },
            { CURRENCY_NAME: "KES", Exchange_Rate: "18.50000", STATUS_MASTER: "Active" }
        ]).onConflictDoNothing().returning();
        const tzsId = currencies.find(c => c.CURRENCY_NAME === "TZS")?.CURRENCY_ID || 1;

        // 3. Companies
        console.log(" - Seeding Companies...");
        const companies = await db.insert(TBL_COMPANY_MASTER).values([
            { Company_Name: "AgroTanzania Ltd", TIN_Number: "123-456-789", Currency_ID: tzsId, Status_Master: "Active" }
        ]).onConflictDoNothing().returning();
        const companyId = companies[0]?.Company_Id || 1;

        // 4. Locations & Stores
        console.log(" - Seeding Locations & Stores...");
        const locations = await db.insert(TBL_LOCATION_MASTER).values([
            { Location_Name: "Dar es Salaam", Status_Master: "Active" }
        ]).onConflictDoNothing().returning();
        const locId = locations[0]?.Location_Id || 1;

        await db.insert(TBL_STORE_MASTER).values([
            { Store_Name: "Main Warehouse", Location_Id: locId, Status_Master: "Active" }
        ]).onConflictDoNothing();

        // 5. Product Categories
        console.log(" - Seeding Categories...");
        const categories = await db.insert(TBL_PRODUCT_MAIN_CATEGORY_MASTER).values([
            { MAIN_CATEGORY_NAME: "Grains", STATUS_MASTER: "Active" },
            { MAIN_CATEGORY_NAME: "Pulses", STATUS_MASTER: "Active" },
            { MAIN_CATEGORY_NAME: "Fertilizers", STATUS_MASTER: "Active" },
            { MAIN_CATEGORY_NAME: "Spices", STATUS_MASTER: "Active" }
        ]).onConflictDoNothing().returning();

        const grainsId = categories.find(c => c.MAIN_CATEGORY_NAME === "Grains")?.MAIN_CATEGORY_ID || 1;
        const pulsesId = categories.find(c => c.MAIN_CATEGORY_NAME === "Pulses")?.MAIN_CATEGORY_ID || 2;
        const fertId = categories.find(c => c.MAIN_CATEGORY_NAME === "Fertilizers")?.MAIN_CATEGORY_ID || 3;
        const spicesId = categories.find(c => c.MAIN_CATEGORY_NAME === "Spices")?.MAIN_CATEGORY_ID || 4;

        // 6. Sub Categories
        console.log(" - Seeding Sub-categories...");
        const subCats = await db.insert(TBL_PRODUCT_SUB_CATEGORY_MASTER).values([
            { SUB_CATEGORY_NAME: "Maize", MAIN_CATEGORY_ID: grainsId, STATUS_MASTER: "Active" },
            { SUB_CATEGORY_NAME: "Rice", MAIN_CATEGORY_ID: grainsId, STATUS_MASTER: "Active" },
            { SUB_CATEGORY_NAME: "Wheat", MAIN_CATEGORY_ID: grainsId, STATUS_MASTER: "Active" },
            { SUB_CATEGORY_NAME: "Beans", MAIN_CATEGORY_ID: pulsesId, STATUS_MASTER: "Active" },
            { SUB_CATEGORY_NAME: "NPK Fertilizer", MAIN_CATEGORY_ID: fertId, STATUS_MASTER: "Active" },
            { SUB_CATEGORY_NAME: "Karafu", MAIN_CATEGORY_ID: spicesId, STATUS_MASTER: "Active" }
        ]).onConflictDoNothing().returning();

        const maizeId = subCats.find(s => s.SUB_CATEGORY_NAME === "Maize")?.SUB_CATEGORY_ID || 1;
        const wheatId = subCats.find(s => s.SUB_CATEGORY_NAME === "Wheat")?.SUB_CATEGORY_ID || 3;
        const riceId = subCats.find(s => s.SUB_CATEGORY_NAME === "Rice")?.SUB_CATEGORY_ID || 2;
        const beansId = subCats.find(s => s.SUB_CATEGORY_NAME === "Beans")?.SUB_CATEGORY_ID || 4;
        const npkId = subCats.find(s => s.SUB_CATEGORY_NAME === "NPK Fertilizer")?.SUB_CATEGORY_ID || 5;
        const karafuId = subCats.find(s => s.SUB_CATEGORY_NAME === "Karafu")?.SUB_CATEGORY_ID || 6;

        // 7. UOMs
        console.log(" - Seeding UOMs...");
        await db.insert(TBL_PRODUCT_UOM_MASTER).values([
            { UOM_NAME: "KG", UOM_SHORT_CODE: "KG", STATUS_MASTER: "Active" },
            { UOM_NAME: "BAG", UOM_SHORT_CODE: "BAG", STATUS_MASTER: "Active" },
            { UOM_NAME: "MT", UOM_SHORT_CODE: "MT", STATUS_MASTER: "Active" }
        ]).onConflictDoNothing();

        // 8. Products
        console.log(" - Seeding Products...");
        await db.insert(TBL_PRODUCT_MASTER).values([
            { PRODUCT_NAME: "White Maize – Grade A", MAIN_CATEGORY_ID: grainsId, SUB_CATEGORY_ID: maizeId, UOM: "KG", QTY_PER_PACKING: "50", ALTERNATE_UOM: "BAG", STATUS_MASTER: "Active" },
            { PRODUCT_NAME: "Yellow Maize – Standard", MAIN_CATEGORY_ID: grainsId, SUB_CATEGORY_ID: maizeId, UOM: "KG", QTY_PER_PACKING: "50", ALTERNATE_UOM: "BAG", STATUS_MASTER: "Active" },
            { PRODUCT_NAME: "Hard Wheat", MAIN_CATEGORY_ID: grainsId, SUB_CATEGORY_ID: wheatId, UOM: "KG", QTY_PER_PACKING: "50", ALTERNATE_UOM: "BAG", STATUS_MASTER: "Active" },
            { PRODUCT_NAME: "IR64 Rice", MAIN_CATEGORY_ID: grainsId, SUB_CATEGORY_ID: riceId, UOM: "KG", QTY_PER_PACKING: "25", ALTERNATE_UOM: "BAG", STATUS_MASTER: "Active" },
            { PRODUCT_NAME: "Red Kidney Beans", MAIN_CATEGORY_ID: pulsesId, SUB_CATEGORY_ID: beansId, UOM: "KG", QTY_PER_PACKING: "50", ALTERNATE_UOM: "BAG", STATUS_MASTER: "Active" },
            { PRODUCT_NAME: "NPK 17:17:17", MAIN_CATEGORY_ID: fertId, SUB_CATEGORY_ID: npkId, UOM: "KG", QTY_PER_PACKING: "50", ALTERNATE_UOM: "BAG", STATUS_MASTER: "Active" },
            { PRODUCT_NAME: "Karafu", MAIN_CATEGORY_ID: spicesId, SUB_CATEGORY_ID: karafuId, UOM: "KG", QTY_PER_PACKING: "25", ALTERNATE_UOM: "BAG", STATUS_MASTER: "Active" }
        ]).onConflictDoNothing();

        // 9. Users
        console.log(" - Seeding Users...");
        const adminPass = await bcrypt.hash("ana", 10);
        const managerPass = await bcrypt.hash("manager123", 10);

        await db.insert(TBL_USER_INFO_HDR).values([
            { LOGIN_NAME: "Sri", PASSWORD_USER_HDR: adminPass, ROLE_USER_HDR: "Admin", MAIL_ID_USER_HDR: "sri@visioninfotech.co.tz", STATUS_USER_HDR: "Active" },
            { LOGIN_NAME: "Manager", PASSWORD_USER_HDR: managerPass, ROLE_USER_HDR: "Manager", MAIL_ID_USER_HDR: "manager@visioninfotech.co.tz", STATUS_USER_HDR: "Active" }
        ]).onConflictDoNothing();

        console.log("✅ Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seed();
