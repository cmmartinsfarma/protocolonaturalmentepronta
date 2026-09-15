const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const fileUrl = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const viewports = [
    { name: 'desktop.png', width: 1280, height: 800, isMobile: false },
    { name: 'mobile.png', width: 375, height: 667, isMobile: true },
    { name: 'mobile-small.png', width: 360, height: 640, isMobile: true }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      isMobile: vp.isMobile
    });

    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    
    // Make sure all reveal elements are visible for full-page screenshot
    await page.evaluate(() => {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      // disable animations/transitions during screenshot
      const style = document.createElement('style');
      style.textContent = '* { transition: none !important; animation: none !important; }';
      document.head.appendChild(style);
    });

    await new Promise(r => setTimeout(r, 500));

    // Check for horizontal overflow
    const overflowInfo = await page.evaluate(() => {
      const docWidth = document.documentElement.offsetWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      const bodyScrollWidth = document.body.scrollWidth;
      const elements = Array.from(document.querySelectorAll('*'));
      const overflowing = [];
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth + 1) {
          overflowing.push({
            tag: el.tagName,
            id: el.id,
            className: el.className,
            right: rect.right,
            width: rect.width
          });
        }
      }
      return {
        innerWidth: window.innerWidth,
        docWidth,
        scrollWidth,
        bodyScrollWidth,
        overflowing: overflowing.slice(0, 10)
      };
    });

    console.log(`=== Viewport: ${vp.name} (${vp.width}px) ===`);
    console.log('Overflow diagnosis:', JSON.stringify(overflowInfo, null, 2));

    await page.screenshot({
      path: path.join(__dirname, vp.name),
      fullPage: true
    });
    console.log(`Saved ${vp.name}`);
    await page.close();
  }

  await browser.close();
  console.log('All screenshots captured!');
}

capture().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
