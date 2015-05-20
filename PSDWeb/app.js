/**
 * New node file
 */
var express=require('express')
	,morgan=require('morgan')
	,fs=require('fs')
	,path=require('path');
var app=express();
app.use(express.static('./public'));
app.use(morgan('dev'));

app.use(express.static('./'));

app.get('/', function(req,res){
	res.sendfile('./index.html');
});

var multipart = require('connect-multiparty');

app.post('/upload', multipart(), function(req, res){
  //get filenames
  var filename = req.files.files.originalFilename || path.basename(req.files.files.ws.path);
  
  //copy file to a public directory
  var targetPath = path.dirname(__filename) + '/public/' + filename;
  //copy file
  fs.createReadStream(req.files.files.ws.path).pipe(fs.createWriteStream(targetPath));
  //return file url
  res.json({code: 200, msg: {url: 'http://' + req.headers.host + '/' + filename}});
});

app.listen(3000);
console.log('Data Lake Portal Site running at: http://0.0.0.0:3000');