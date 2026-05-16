const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

async function runAudit(url) {
  const executablePath = await chromium.executablePath();

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const title = await page.title();

  await browser.close();

  return { title };
}

module.exports = { runAudit };