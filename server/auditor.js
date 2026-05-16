const puppeteer = require("puppeteer-core");
const chromium = require("chrome-aws-lambda");

async function runAudit(url) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // your axe-core logic here...

  const results = await page.evaluate(() => {
    return document.title;
  });

  await browser.close();
  return results;
}

module.exports = { runAudit };