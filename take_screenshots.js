const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: "new",
            executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        console.log("Navigating to dashboard using Edge...");
        await page.setViewport({ width: 1920, height: 1080 });
        
        await page.goto('http://localhost:3000/categories', { waitUntil: 'domcontentloaded', timeout: 60000 });
        
        const url = page.url();
        if (url.includes('/login') || url === 'http://localhost:3000/') {
            console.log("Login required. Attempting to bypass or log in...");
            await page.evaluate(() => {
                localStorage.setItem('user', JSON.stringify({
                    id: 1,
                    loginName: 'Admin',
                    mailId: 'admin@admin.com',
                    role: 'Super Admin',
                    outsideAccessYn: 'Y'
                }));
            });
            await page.goto('http://localhost:3000/categories', { waitUntil: 'domcontentloaded', timeout: 60000 });
        }

        console.log("Waiting 10 seconds for data to load...");
        await new Promise(r => setTimeout(r, 10000));
        
        // 1. Desktop View - Sidebar Expanded
        console.log("Taking desktop view screenshot...");
        await page.screenshot({ path: 'UI/UX/desktop_view.png', fullPage: true });

        // 2. Desktop View - Sidebar Collapsed
        console.log("Taking collapsed sidebar screenshot...");
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('header button'));
            if (buttons.length > 0) {
                buttons[0].click();
            }
        });
        await new Promise(r => setTimeout(r, 1500));
        await page.screenshot({ path: 'UI/UX/desktop_sidebar_collapsed.png', fullPage: true });

        // Click again to expand for the modal
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('header button'));
            if (buttons.length > 0) {
                buttons[0].click();
            }
        });
        await new Promise(r => setTimeout(r, 1500));

        // 3. Add Modal on the Main Category Pages
        console.log("Taking add modal screenshot...");
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const addBtn = buttons.find(b => b.textContent && b.textContent.includes('Add Main Category'));
            if (addBtn) addBtn.click();
        });
        await new Promise(r => setTimeout(r, 1500));
        await page.screenshot({ path: 'UI/UX/add_modal.png', fullPage: true });

        // Close the modal by pressing escape
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 1500));

        // 4. Mobile View
        console.log("Taking mobile view screenshot...");
        await page.setViewport({ width: 375, height: 812, isMobile: true });
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: 'UI/UX/mobile_view.png', fullPage: true });
        
        console.log("Screenshots saved successfully.");
        await browser.close();
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
})();
