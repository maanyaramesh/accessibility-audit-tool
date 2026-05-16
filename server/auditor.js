const puppeteer = require('puppeteer');
const { source: axeSource } = require('axe-core');
const path = require('path');

async function runAudit(url) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: path.join(__dirname, '.cache', 'puppeteer', 'chrome', 'linux-127.0.6533.88', 'chrome-linux64', 'chrome'),
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.evaluate(axeSource);
    const results = await page.evaluate(async () => await axe.run());
    return {
      url,
      violations: results.violations,
      passes: results.passes.length,
      incomplete: results.incomplete.length,
      timestamp: new Date().toISOString(),
    };
  } finally {
    await browser.close();
  }
}

module.exports = { runAudit };