// Test navigation to grupos-avanzados
// Run this with: node test-grups-navigation.js

const puppeteer = require('puppeteer');

(async () => {
  let browser;
  try {
    console.log('🚀 Starting navigation test...');
    
    browser = await puppeteer.launch({ 
      headless: false, // Show browser for debugging
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Enable console logs
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    console.log('📱 Navigating to localhost:3002...');
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle0' });
    
    console.log('🔍 Looking for GRUPS menu item...');
    
    // Wait for the page to load and try to find the Grups button
    await page.waitForTimeout(2000);
    
    // Try to find the desktop Grups button first
    let grupsButton = await page.$('button:has-text("Grups")');
    
    if (!grupsButton) {
      // Try alternative selectors
      grupsButton = await page.$('[data-testid="grups-button"]') ||
                     await page.$('button[aria-label*="Grups"]') ||
                     await page.$('button:contains("Grups")') ||
                     await page.$('*[onclick*="grupos-avanzados"]');
    }
    
    if (!grupsButton) {
      console.log('❓ Button not found with simple selectors, trying broader search...');
      
      // Get all buttons and check their text content
      const allButtons = await page.$$('button');
      console.log(`Found ${allButtons.length} buttons total`);
      
      for (let i = 0; i < allButtons.length; i++) {
        const button = allButtons[i];
        const textContent = await page.evaluate(el => el.textContent?.trim(), button);
        console.log(`Button ${i}: "${textContent}"`);
        
        if (textContent && textContent.includes('Grups')) {
          grupsButton = button;
          console.log(`✅ Found GRUPS button at index ${i}!`);
          break;
        }
      }
    }
    
    if (grupsButton) {
      console.log('👆 Clicking GRUPS button...');
      await grupsButton.click();
      
      // Wait for navigation
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      console.log('🌐 Current URL after click:', currentUrl);
      
      if (currentUrl.includes('grupos-avanzados')) {
        console.log('✅ SUCCESS: Navigation to grupos-avanzados worked!');
      } else {
        console.log('❌ FAILED: Did not navigate to grupos-avanzados');
        console.log('Expected URL to contain: grupos-avanzados');
        console.log('Actual URL:', currentUrl);
      }
    } else {
      console.log('❌ FAILED: Could not find GRUPS button on the page');
      
      // Debug: take screenshot
      await page.screenshot({ path: 'debug-screenshot.png' });
      console.log('📸 Screenshot saved as debug-screenshot.png');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    if (browser) {
      console.log('🔚 Closing browser...');
      await browser.close();
    }
  }
})();