const puppeteer = require('puppeteer');
const { source: axeSource } = require('axe-core');

async function runAudit(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  const page = await browser.newPage();

  try {
    // Increase timeout
    page.setDefaultNavigationTimeout(60000);

    await page.goto(url, {
      waitUntil: 'domcontentloaded', // faster + more reliable
      timeout: 60000,
    });

    // wait a little for JS rendering
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await page.evaluate(axeSource);

    const results = await page.evaluate(async () => {
      return await axe.run();
    });

    return {
      url,
      violations: results.violations,
      passes: results.passes.length,
      incomplete: results.incomplete.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      url,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  } finally {
    await browser.close();
  }
}

module.exports = { runAudit };