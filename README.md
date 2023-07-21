# Certify-toptrove
## Official certificate generator tool of peershala

### Features
- Send a post request to the server, with the details of the certicate's holder, like(name,job title,score,date).
- This info would be used to compile the ejs template, which consists of the certificate design.
- Once compiled, this would be converted into pdf format using the puppeteer library.
- This certificate is stored in the MYSQL database for further access.
