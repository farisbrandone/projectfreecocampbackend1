// index.js
// where your node app starts
require('dotenv').config();
// init project
var express = require('express');
var app = express();
const port = process.env.PORT || 5000;
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({
  optionsSuccessStatus: 200
})); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.set('trust proxy', true);
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 

const handler = (params) => {
  let result = new Date(params)
  let result2 = result.toUTCString()
  let result3 = result.valueOf()
  return {
    unix: result3,
    utc: result2
  }
} 

app.get("/api/hello", function (req, res) {
  res.json({
    greeting: 'hello API'
  });
});
 app.get("/api", function (req, res){
  console.log("bla")
  const result=handler(Date.now())
  res.json(result);
}) 

app.get("/api/:date", function (req, res) {
  const params = req.params.date
  const tab=params.indexOf(".")
  console.log(tab);
  const dateObject=new Date(params)
  console.log(dateObject)
  if (Number(params)&& tab===-1) {
    const result = handler(Number(params))
    res.json(result);
  } 
  
  else if (dateObject.toString()==="Invalid Date"){
    res.json({
      error:dateObject.toString()
    })
  }
  else {
    let result2 = dateObject.toUTCString()
    let result3 = dateObject.valueOf()
    res.json({
      unix: result3,
      utc: result2
    }) 
  }
 /*  if (Number(params)&& tab===-1) {
    const result = handler(Number(params))
    res.json(result);
  } else if (/^(\d\d*)([-/.])((0?[1-9])|(1[012]))?([-/.])?((0?[1-9])|([12][0-9])|(3[01]))?$/.test(params)) {
    const result = handler(params)
    console.log("nana")
    res.json(result);
  } else if (/^(\d\d*)([-/.])((0?[1-9])|(1[012]))([-/.])((0?[1-9])|([12][0-9])|(3[01]))T((0[0-9])|([12][13])):((0[0-9])|([1-5][0-9])):((0[0-9])|([1-5][0-9]))$/.test(params)) {
    const result = handler(params)
    console.log("dada")
    res.json(result);
  }
  else if (/^(\d{0,5})((Jan\w*)|(Feb\w*)|(Mar\w*)|(Apr\w*)|(May)|(June)|(July)|(Aug\w*)|(Sept\w*)|(Oct\w*)|(Nov\w*)|(Dec\w*))\s((0?[0-9])|([12][0-9])|(3[01]))(,)?(\s)?(\d\d*)?(\s)?(((0?[0-9])|([12][13]))?(:)?((0?[0-9])|([1-5][0-9]))?(:)?((0?[0-9])|([1-5][0-9]))?)$/i.test(params)) {
    const result = handler(params)
    console.log(result,"and", params)
    res.json(result);
  }
   else {
    res.json({
      error: "Invalid Date"
    })
  } */
});

app.get('/api/whoami', function (req, res) {
  const index=req.rawHeaders.indexOf("Accept-Language");
 const index2=req.rawHeaders.indexOf('User-Agent');
 const language=req.rawHeaders[index+1]
 const software=req.rawHeaders[index2+1]
 console.log(req.ip) 
   res.json({ipaddress:req.ip, language, software}); 
 });


// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});