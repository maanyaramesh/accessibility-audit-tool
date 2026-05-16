const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');
const { source: axeSource } = require('axe-core');

async function runAudit(url) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
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