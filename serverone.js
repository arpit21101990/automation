var http = require('http');
var formidable = require('formidable');
var fsone = require('fs');
const puppeteer = require('puppeteer')
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
//const data = require('./database.json')
const asyncone = require('async')
const XLSX = require('xlsx');
var qs = require('querystring');


http.createServer(function (req, res) {
    if (req.url == '/fileupload') {
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
              var oldpath = files.filetoupload.path;
              var newpath = './' + files.filetoupload.name;
              fsone.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.write('File uploaded and moved!');
                console.log("File Path----- "+newpath);
                createPdf( newpath, function (response) {
                    console.log(response);
                })
                res.end();
              });
         });
    } else if(req.url == '/login'){
        console.log("Login Page");
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<form action="loginrequest" method="post">');
        res.write('<input type="text" name="email"><br>');
        res.write('<input type="text" name="password"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    } else if(req.url == '/loginrequest'){
        var post = qs.parse(req);
        console.log("Login request"+post.email);
       

    }
    else 
    {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
            res.write('<input type="file" name="filetoupload"><br>');
            res.write('<input type="submit">');
            res.write('</form>');
            return res.end();
    }
}).listen(8080);




 /**save bling */
 function createPdf(newPath, callback) {
     console.log("call create pdf method");

    const compile = async function(templateName, data){
        const filepath = path.join(process.cwd(), 'template', `${templateName}.html`);
        const html = await fs.readFile(filepath, 'utf-8');
        return hbs.compile(html)(data);
    
    };
    const wb = XLSX.readFile(newPath);
    const ws = wb.SheetNames;
    const datavalue = XLSX.utils.sheet_to_json(wb.Sheets[ws[0]]);
    
         (async function(){
            for(var i=0;i<datavalue.length;i++){
                const browser = await puppeteer.launch();

    
                const productName = datavalue[i]['__EMPTY_2'];
                const list = {
                    name: datavalue[i]['__EMPTY_3'],
                    location: datavalue[i]['__EMPTY_4'],
                    ordernumber: datavalue[i]['__EMPTY_1'],
                    typeofscalp: datavalue[i]['__EMPTY_7'],
                    hairgoals: datavalue[i]['__EMPTY_12']+datavalue[i]['__EMPTY_13']+datavalue[i]['__EMPTY_14'],
                    perfume: datavalue[i]['__EMPTY_11'],
                    color: datavalue[i]['__EMPTY_9'],
                    notes: datavalue[i]['__EMPTY_6'],
                    volume: datavalue[i]['__EMPTY_8']
    
                }
                const res = productName.split('+');
                for(var j=0;j<res.length;j++){
                    
            
                    //console.log("Featch data"+res[i]);
                    if(res[j].match("Shampoo")){
                        //console.log("First string"+res[i]);
                        try{
                            const page = await browser.newPage();
                           
                            const content = await compile('shampooinvoce',list)
                    
                            await page.setContent(content);
                            await page.emulateMedia('screen');
                            await page.pdf({
                                path: 'ordershampoodata/'+i+'shampoo.pdf',
                                format: 'A4',
                                printBackground: true,
                                headless: false
                            
    
                                
                            });
                            console.log('done');
                           // await browser.close();
                            process.setMaxListeners(5000);
                        }catch(e){
                            console.log('our error', e);
                    
                        }
                    }else if(res[j].match("Conditioner")){
                       // console.log("Second string : ",res[1]);
                        try{
        
                            const page = await browser.newPage();
                    
                            const content = await compile('invoce',list)
                    
                            await page.setContent(content);
                            await page.emulateMedia('screen');
                            await page.pdf({
                                path: 'orderconditioner/'+i+'conditiner.pdf',
                                format: 'A4',
                                printBackground: true,
                                headless: false
                                
                            });
                            
                            console.log('done');
                           // await browser.close();
                            process.setMaxListeners(5000);
                        }catch(e){
                            console.log('our error', e);
                    
                        }
                   }
                  
                }  
                await browser.close();
        }
    })();
    
    return callback("Done");
}