// index.js
// where your node app starts
import mongoose from "mongoose";
import URL from "./models/urlModels.js";
import dotenv from "dotenv";
import express from "express";
import cors from "cors"
import bodyParser from 'body-parser';
import dns from "dns"
import { URL as URL1} from 'node:url';
import multer from "multer"

dotenv.config();
// init project
var app = express();
/* app.use(express.json({limit:"30mb", extended: true}));
app.use(express.urlencoded({limit:"30mb", extended: true})); */
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT || 5000;
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
/* var cors = require('cors'); */
app.use(cors( {
  optionsSuccessStatus: 200
} )); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
/* app.use(express.static('public')); */
/* app.set('trust proxy', true); */
// http://expressjs.com/en/starter/basic-routing.html
/* app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
}); */
app.use('/public', express.static(`${process.cwd()}/public`));
 
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});



// your first API endpoint... 

async function  randomFive(){
  let i=0
  let id=0
  while (i<1){
   
    const valueId= await URL.findOne({id })
    if (!Boolean(valueId)){
      id=Math.floor(Math.random() * 10)*10000 +Math.floor(Math.random() * 10)*1000+Math.floor(Math.random() * 10)*100+Math.floor(Math.random() * 10)*10+Math.floor(Math.random() * 10)
      i=2
    }
  }
  return id
}

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
app.get('/api/whoami', function (req, res) {
  const index=req.rawHeaders.indexOf("Accept-Language");
 const index2=req.rawHeaders.indexOf('User-Agent');
 const language=req.rawHeaders[index+1]
 const software=req.rawHeaders[index2+1]
 console.log(req.ip) 
   res.json({ipaddress:req.ip, language, software}); 
 });
 app.get("/api", function (req, res){
  console.log("bla")
  const result=handler(Date.now())
  res.json(result);
}) 


const upload = multer({ dest: './public/data/uploads/' })
app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
   // req.file is the name of your file in the form above, here 'uploaded_file'
   // req.body will hold the text fields, if there were any 
   console.log(req.file, req.body)
   res.json({
    name:req.file.originalname,
    type:req.file.mimetype,
    size:req.file.size
  })
});


/* app.get("/api/:date", function (req, res) {
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
  } */
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
/* }); */

//part of project 2 
// {... previous code}
// Middleware to validate url
const validateURL = async (req, res, next) => {
  const { url } = req.body;
  const myURL = new URL1(url);
  const host=myURL.host
 /*   const isExist = await urlExist(url);
  if (!isExist) {
    return res.json({ error: "Invalid URL"});
  }  */
   console.log(myURL)
  dns.lookup( host, (error, address, family) => {
  
    // if an error occurs, eg. the hostname is incorrect!
    if (error) {
      return res.json({ error: "Invalid URL"});
    } else {
      // if no error exists
      console.log(
        `The ip address is ${address} and the ip version is ${family}`
      );
      next();
    }
  }); 

 

  
};
//......................


//......................


app.post("/api/shorturl", validateURL,async (req, res) => {
  const  url1 = req.body.url
  const myURL = new URL1(url1);
  const url=myURL.pathname==="/"&& myURL.search===""?myURL.origin:myURL.href
  // Generate a unique id to identify the URL
  console.log(url)
 const valueUrl= await URL.findOne({url})
 if (valueUrl){
  console.log("tonton")
   res.json({ original_url:valueUrl.url, short_url: valueUrl.id });
 }

 else {

   /* let id = nanoid(5); */
   try {
      let id = await randomFive(); 
      let newURL = new URL({url, id });
    await  newURL.save();
     res.json({ original_url:newURL.url, short_url: newURL.id });
    } catch (err) {
      res.send("An error was encountered! Please try again.");
    }
    // The shortened link: our server address with the unique id
 }
});

//redirection the user
app.get("/api/shorturl/:id", async (req, res) => {
  let id =Number (req.params.id);
try {
  const originalLink = await URL.findOne({id });
console.log(originalLink.url)
  if (originalLink) {
      await URL.updateOne(
        {
          id: id,
        },
        { $inc: { clicks: 1 } }
      );
      
  res.redirect(originalLink.url);
      } else res.status(404).json('Not found');
}catch(err){
  console.log(err);
  res.status(500).json('Server Error');
}
 
});


 //connection to mongoose
 mongoose
 .connect(process.env.MONGO_DB_URI)
 .then(()=>{
     app.listen(port, ()=>{
         console.log(`server running on port ${port}`);
     })
 })
 .catch((err)=>console.log(`${err}did not connect`));

/* mongoose.connection.on('open', () => {
	// Wait for mongodb connection before server starts
	var listener = app.listen(port, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });
}) */

// listen for requests :)
