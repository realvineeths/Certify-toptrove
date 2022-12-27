
const puppeteer = require('puppeteer');
const fs = require('fs');
const app = require('express');
const http = require('http')


  (async () => {

    var type = process.argv.slice(2)[0] || 'url';

    const browser = await puppeteer.launch();

    const page = await browser.newPage();


    if (type === 'url') {

      const website_url = 'https://vcint.github.io/nodeapi/';

      await page.goto(website_url, { waitUntil: 'networkidle0' });

    } else if (type === 'file') {

      const html = fs.readFileSync('sample.html', 'utf-8');
      await page.setContent(html, { waitUntil: 'domcontentloaded' });

    } else {

      console.log(new Error(`HTML source "${type}" is unkown.`));
      await browser.close();
      return;
    }
    await page.emulateMediaType('screen');

    const pdf = await page.pdf({
      path: `result_${type}.pdf`,
      margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
      printBackground: true,
      format: 'A4',
    });

    await browser.close();
    res.send(pdf);
  })();