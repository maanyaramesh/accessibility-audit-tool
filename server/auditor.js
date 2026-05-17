const puppeteer = require('puppeteer');
const { source: axeSource } = require('axe-core');

async function runAudit(url) {
  try {
    // Add https if missing
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }

    console.log('Starting audit for:', url);

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
        '--no-zygote',
      ],
    });

    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({
      width: 1280,
      height: 720,
    });

    // Block heavy resources for faster loading
    await page.setRequestInterception(true);

    page.on('request', (req) => {
      const resourceType = req.resourceType();

      if (['image', 'font', 'media'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log('Opening page...');

    // Faster + more reliable than networkidle2
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });

    console.log('Page loaded');

    // Wait for body
    await page.waitForSelector('body', {
      timeout: 10000,
    });

    console.log('Injecting axe...');

    // Inject axe-core
    await page.evaluate(axeSource);

    console.log('Running accessibility audit...');

    // Run axe only on body for better performance
    const results = await page.evaluate(async () => {
      return await axe.run(document.body);
    });

    console.log('Audit complete');

    await browser.close();

    return {
      success: true,
      url,
      violations: results.violations,
      passes: results.passes.length,
      incomplete: results.incomplete.length,
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('AUDIT ERROR:', error);

    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = { runAudit };