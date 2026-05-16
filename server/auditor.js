const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

async function runAudit(url) {
  const executablePath = await chromium.executablePath();

  const browser = await puppeteer.launch({
    args: [
      ...chromium.args,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--single-process",
    ],
    executablePath: executablePath || undefined,
    headless: chromium.headless || "new",
  });

  const page = await browser.newPage();

  // 🔥 IMPORTANT: prevent infinite hanging
  page.setDefaultNavigationTimeout(60000);
  page.setDefaultTimeout(60000);

  // 🔥 helps avoid bot-block / slow loads
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  let title = "No title";

  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    title = await page.title();
  } catch (err) {
    console.error("Navigation error:", err.message);
  }

  await browser.close();

  return {
    title,
  };
}

module.exports = { runAudit };