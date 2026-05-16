const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

async function runAudit(url) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // keep your existing axe-core logic here
  const title = await page.title();

  await browser.close();

  return { title };
}

module.exports = { runAudit };