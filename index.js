const puppeteer = require('puppeteer');
const fs = require('fs');
const app = require('express');
const http = require('http');
const ejs= require('ejs');
const path=require('path');


(async () => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    try {
      var compiled = ejs.compile(fs.readFileSync(__dirname + '/views/cert1.ejs', 'utf8'));
      var cname='VINAY';
      var html = compiled({ name: cname, title:'Node Developer' , score:'A+',date:'29 december,2022'});//DYNAMIC VALUES

      await page.setContent(html, { waitUntil: 'domcontentloaded' });
    } catch (error) {
      console.log(new Error(`${error}`));
      await browser.close();
      return;
    }

    await page.emulateMediaType('screen');

    const pdf = await page.pdf({
      path: `${cname}.pdf`,
      margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
      printBackground: true,
      format: 'letter',
    });
    await browser.close();
    
})();



// var type = process.argv.slice(2)[0] || 'url';


// if (type === 'url') {

//   const website_url = 'https://vcint.github.io/nodeapi/';

//   await page.goto(website_url, { waitUntil: 'networkidle0' });

// } else if (type === 'file') {


// } else {

//   console.log(new Error(`HTML source "${type}" is unkown.`));
//   await browser.close();
//   return;
// }