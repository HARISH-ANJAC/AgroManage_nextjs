import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
const AUTH_URL = `${BASE_URL}/auth/login`;

async function runTests() {
    console.log('🧪 Starting Master API Automation Tests...');

    try {
        // 1. Authentication
        console.log('🔐 Authenticating as Admin...');
        let token;
        try {
            const authResponse = await axios.post(AUTH_URL, {
                LOGIN_NAME: 'Admin',
                PASSWORD_USER_HDR: 'superadmin@123'
            });
            token = authResponse.data.accessToken;
            console.log('✅ Auth Successful. Token obtained.\n');
        } catch (e: any) {
             console.error('❌ Authentication ERROR Detail:');
            if (e.response) {
                console.error(`Status: ${e.response.status}`);
                console.error(`Body: ${JSON.stringify(e.response.data)}`);
            } else {
                console.error(`Error: ${e.message}`);
            }
            throw e;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Helper to fetch first ID of a domain
        const getFirstId = async (domain: string) => {
            const res = await axios.get(`${BASE_URL}/${domain}`, { headers });
            return res.data[0]?.id || res.data[0]?.ID || res.data[0]?.SNO || 1;
        };

        // Fetch parent IDs for relational stability
        console.log('🔍 Fetching parent IDs for dependencies...');
        const countryId = await getFirstId('countries');
        const regionId = await getFirstId('regions');
        const districtId = await getFirstId('districts');
        const currencyId = await getFirstId('currencies');
        const locationId = await getFirstId('locations');
        const mainCatId = await getFirstId('categories');
        const subCatId = await getFirstId('sub-categories');
        console.log(`✅ IDs: TZ=${countryId}, AR=${regionId}, DSM=${districtId}, TZS=${currencyId}, HQ=${locationId}, FERT=${mainCatId}, NPK=${subCatId}\n`);

        const testDomains: any[] = [
            { 
                domain: 'countries', 
                data: { countryName: 'Test Country', shortCode: 'TC', statusMaster: 'Active' },
                update: { countryName: 'Test Country Updated' }
            },
            { 
                domain: 'regions', 
                data: { regionName: 'Test Region', countryId: countryId, statusMaster: 'Active' },
                update: { regionName: 'Test Region Updated' }
            },
            { 
                domain: 'districts', 
                data: { districtName: 'Test District', regionId: regionId, countryId: countryId, statusMaster: 'Active' },
                update: { districtName: 'Test District Updated' }
            },
            { 
                domain: 'currencies', 
                data: { currencyName: 'Test Currency', address: 'TEST', exchangeRate: 1.0, statusMaster: 'Active' },
                update: { exchangeRate: 1.5 }
            },
            { 
                domain: 'companies', 
                data: { companyName: 'Test Company', tinNumber: 'TEST-TIN', currencyId: currencyId, statusMaster: 'Active' },
                update: { companyName: 'Test Company Updated' }
            },
            { 
                domain: 'locations', 
                data: { locationName: 'Test Location', shortCode: 'TL', statusMaster: 'Active' },
                update: { locationName: 'Test Location Updated' }
            },
            { 
                domain: 'stores', 
                data: { storeName: 'Test Store', locationId: locationId, statusMaster: 'Active' },
                update: { storeName: 'Test Store Updated' }
            },
            { 
                domain: 'categories', 
                data: { mainCategoryName: 'Test Category', statusMaster: 'Active' },
                update: { mainCategoryName: 'Test Category Updated' }
            },
            { 
                domain: 'sub-categories', 
                data: { subCategoryName: 'Test Sub-Category', mainCategoryId: mainCatId, statusMaster: 'Active' },
                update: { subCategoryName: 'Test Sub-Category Updated' }
            },
            { 
                domain: 'products', 
                data: { productName: 'Test Product', mainCategoryId: mainCatId, subCategoryId: subCatId, uom: 'PCS', statusMaster: 'Active' },
                update: { productName: 'Test Product Updated' }
            },
            { 
                domain: 'suppliers', 
                data: { supplierName: 'Test Supplier', countryId: countryId, regionId: regionId, statusMaster: 'Active' },
                update: { supplierName: 'Test Supplier Updated' }
            },
            { 
                domain: 'customers', 
                data: { customerName: 'Test Customer', countryId: countryId, regionId: regionId, districtId: districtId, statusMaster: 'Active' },
                update: { customerName: 'Test Customer Updated' }
            },
            { 
                domain: 'billing-locations', 
                data: { billingLocationName: 'Test Billing Loc', statusMaster: 'Active' },
                update: { billingLocationName: 'Test Billing Loc Updated' }
            },
            { 
                domain: 'additional-cost-types', 
                data: { additionalCostTypeName: 'Test Cost Type', statusMaster: 'Active' },
                update: { additionalCostTypeName: 'Test Cost Type Updated' }
            },
            { 
                domain: 'payment-terms', 
                data: { paymentTermName: 'Test Payment Term', statusEntry: 'Active' },
                update: { paymentTermName: 'Test Payment Term Updated' }
            }
        ];

        for (const test of testDomains) {
            console.log(`--- Testing Domain: [${test.domain.toUpperCase()}] ---`);
            
            const suffix = Math.floor(Math.random() * 100000);
            const entryData = { ...test.data };
            Object.keys(entryData).forEach(k => { 
                if (typeof entryData[k] === 'string' && (entryData[k].toLowerCase().includes('test') || entryData[k].toLowerCase().includes('tin'))) {
                    entryData[k] = entryData[k] + ' ' + suffix; 
                }
            });

            // A. POST (Create)
            console.log(`[CREATE] Creating test record...`);
            const postRes = await axios.post(`${BASE_URL}/${test.domain}`, entryData, { headers });
            const created = postRes.data;
            const newId = created.id;
            console.log(`✅ Success. Created ID: ${newId}`);

            // B. GET ALL
            console.log(`[GET ALL] Fetching all records...`);
            const getAllRes = await axios.get(`${BASE_URL}/${test.domain}`, { headers });
            console.log(`✅ Success. Total records: ${getAllRes.data.length}`);

            // C. PUT (Update)
            console.log(`[UPDATE] Updating record ${newId}...`);
            const updateData = { ...test.update };
            Object.keys(updateData).forEach(k => { if (typeof updateData[k] === 'string' && updateData[k].includes('Test')) updateData[k] = updateData[k] + ' ' + suffix; });
            await axios.put(`${BASE_URL}/${test.domain}/${newId}`, updateData, { headers });
            console.log(`✅ Success.`);

            // D. DELETE (Single)
            console.log(`[DELETE] Deleting record ${newId}...`);
            await axios.delete(`${BASE_URL}/${test.domain}/${newId}`, { headers });
            console.log(`✅ Success.`);

            // E. BULK DELETE (Batch)
            console.log(`[BULK DELETE] Creating two records for bulk delete...`);
            const b1Data = { ...entryData };
            const b2Data = { ...entryData };
            Object.keys(b1Data).forEach(k => { if (typeof b1Data[k] === 'string' && (b1Data[k].toLowerCase().includes('test') || b1Data[k].toLowerCase().includes('tin'))) b1Data[k] = b1Data[k] + ' B1'; });
            Object.keys(b2Data).forEach(k => { if (typeof b2Data[k] === 'string' && (b2Data[k].toLowerCase().includes('test') || b2Data[k].toLowerCase().includes('tin'))) b2Data[k] = b2Data[k] + ' B2'; });

            const b1 = (await axios.post(`${BASE_URL}/${test.domain}`, b1Data, { headers })).data;
            const b2 = (await axios.post(`${BASE_URL}/${test.domain}`, b2Data, { headers })).data;
            
            const ids = [b1.id, b2.id];
            console.log(`[BULK DELETE] Deleting IDs: [${ids.join(', ')}]...`);
            await axios.post(`${BASE_URL}/${test.domain}/bulk-delete`, { ids }, { headers });
            console.log(`✅ Success.`);

            console.log(`🎉 [${test.domain.toUpperCase()}] PASSED.\n`);
        }

        console.log('🚀 ALL MASTER API TESTS COMPLETED SUCCESSFULLY! 🚀');

    } catch (error: any) {
        console.error('❌ TEST FAILED!');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

runTests();
