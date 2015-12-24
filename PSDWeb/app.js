/**
 * New node file
 */
var express=require('express')
//	,routes=require('routes')
	,morgan=require('morgan')
	,fs=require('fs')
	,ejs=require('ejs')
	,path=require('path');
var app=express();
app.use(express.static('./public'));
app.use(morgan('dev'));

//app.use(app.router);
app.use(express.static('./'));
app.engine('.html',ejs.__express);
app.set('view engine','html');
app.set('views', __dirname+ '/views');
app.disable('etage');

app.get('/', function(req,res){
	res.sendfile('index.html');
	
});

app.get('/test', function(req,res){
	//res.sendfile('./downloadpage.html');
	res.setHeader('Last-Modified', (new Date()).toUTCString());
	res.send('hello world');
});

app.get('/filelist', function(req,res){
	res.render('filelist.html',{title: 'it is a test title'});
});

app.get('/downloadpage',function(req,res){
	// Disable caching for content files
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);

	var root_path="public";
	var resp = [];
	var files = fs.readdirSync(root_path);
	files.forEach(function(file){
	  var pathname = root_path+'/'+file;
	  var stat = fs.lstatSync(pathname);
	  if (!stat.isDirectory()){
		  resp.push(pathname.replace(root_path,'.'));
	  }
	  console.log(file.toString());
	});
	//res.write(resp.pop());
	//res.end();
	
	res.render('downloadpage',{filelist: resp});
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