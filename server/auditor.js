const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');

async function runAudit(url) {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: 'new',

      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH,

      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-sync',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-first-run',
        '--safebrowsing-disable-auto-update'
      ]
    });

    const page = await browser.newPage();

    // Block heavy resources
    await page.setRequestInterception(true);

    page.on('request', (req) => {
      const blockedResources = [
        'image',
        'font',
        'media'
      ];

      if (
        blockedResources.includes(
          req.resourceType()
        )
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    // Remove timeout limits
    page.setDefaultNavigationTimeout(0);
    page.setDefaultTimeout(0);

    // Open website
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 0
    });

    // Run Lighthouse audit
    const result = await lighthouse(
      url,
      {
        port: new URL(
          browser.wsEndpoint()
        ).port,

        output: 'json',

        logLevel: 'error',

        onlyCategories: [
          'accessibility'
        ],

        maxWaitForLoad: 0,

        disableStorageReset: true,

        throttlingMethod: 'provided',

        screenEmulation: {
          mobile: false,
          width: 1280,
          height: 720,
          deviceScaleFactor: 1,
          disabled: false
        }
      }
    );

    await browser.close();

    return result.lhr;

  } catch (err) {

    console.error(err);

    if (browser) {
      await browser.close();
    }

    throw new Error(
      err.message || 'Audit failed'
    );
  }
}

module.exports = runAudit;