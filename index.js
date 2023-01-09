const puppeteer = require('puppeteer');
const fs = require('fs');
const express = require('express');
const app=express();
const ejs= require('ejs');
const mysql=require("mysql");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));

const db = mysql.createConnection({
  host:"",
  user:"",
  password:"",
  database:""
})//fill it up

db.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
  console.log('Connected to the MySQL server.');
})

app.get("/fileget", (req, res) => {
  const  file_name =req.body.file_name;
  console.log(file_name);

  const query = "Select file_data From certificate Where file_name = ?";
  db.query(query, [file_name], (err, result) => {
    if (err) {
      console.log(err);
    }
    // console.log(Buffer.from(result[0].file_data).toString())
    fs.writeFileSync(`${file_name}.pdf`, Buffer.from(result[0].file_data))
    // res.send(pdf);
    res.send('ok');
  })
});

app.post('/filestore',async (req,res)=>{
  const{cname,ctitle,cscore,cdate}=req.body;//name of candidate,job title,score of candidate and date of issue of certificate is taken from request body.
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  try {
    var compiled = ejs.compile(fs.readFileSync(__dirname + '/views/cert1.ejs', 'utf8'));
    var html = compiled({ name: cname, title:ctitle , score:cscore,date:cdate});//DYNAMIC VALUES
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

  } catch (error) {
    console.log(new Error(`${error}`));
    await browser.close();
    res.send(error);
    return;
  }

  await page.emulateMediaType('screen');

  const pdf = await page.pdf({
    // path: `${cname}.pdf`,
    margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
    printBackground: true,
    format: 'letter',
  });
  //once the pdf is created it is not stored in any path, instead its stored in database in next step.
  await browser.close();

  const values=[cname,pdf]
  const query= "INSERT INTO certificate(`file_name`,`file_data`) values (?,?)";

  db.query(query,values,(err,result)=>{
    if(err)
    {
      console.log(err);
      res.send(err)
      return;
    }
    console.log(result);
  });

  res.send('ok')

});


app.listen(8080,()=>{
  console.log('server running on port number 8080');
})






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