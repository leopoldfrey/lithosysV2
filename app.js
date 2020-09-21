var express     = require("express");
var http        = require("http");
var serveIndex  = require("serve-index");
var multer      = require("multer");
var fs          = require("fs");
var path        = require("path");
var WebSocket   = require("ws");
var WebSocketServer   = WebSocket.Server;
var bodyParser  = require("body-parser");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var request 	= require('request');
var app         = express();
var server 		= http.createServer(app);
var randomColor = require('randomcolor');

/* PARAMETERS */

// use alternate localhost and the port Heroku assigns to $PORT
const port = process.env.PORT || 3000;
//var webServerPort = 8080; // Web server (http) listens on this port

app.get('/',function(req,res){
      res.sendFile(__dirname + "/public/index.html");
});

app.get('/index.html',function(req,res){
      res.sendFile(__dirname + "/public/index.html");
});

app.get('/id_animal.html',function(req,res){
      res.sendFile(__dirname + "/public/id_animal.html");
});

app.get('/id_vegetal.html',function(req,res){
      res.sendFile(__dirname + "/public/id_vegetal.html");
});

app.get('/id_mineral.html',function(req,res){
      res.sendFile(__dirname + "/public/id_mineral.html");
});

app.get('/id_human.html',function(req,res){
      res.sendFile(__dirname + "/public/id_human.html");
});

app.get('/id_machine.html',function(req,res){
      res.sendFile(__dirname + "/public/id_machine.html");
});

app.get('/chatroom.html',function(req,res){
      res.sendFile(__dirname + "/public/chatroom.html");
});

app.get('/chat.json',function(req,res){
      res.sendFile(__dirname + "/public/chat.json");
});

app.get('/rocio.html',function(req,res){
      res.sendFile(__dirname + "/public/rocio.html");
});

/*----------- Static Files -----------*/
app.use('/vendor', express.static('public/vendor'));
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use('/img', express.static('public/img'));
app.use('/data', express.static('public/data'));

app.use('/uploads', express.static('uploads'));
app.use('/uploads', serveIndex(__dirname + '/uploads'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*----------- Download/Upload votes -----------*/

var localDataFolder = path.dirname(fs.realpathSync(__filename))+'/public/data';
console.log('local data folder \"', localDataFolder, "\"");
    
/*----------- parameters -----------*/

var fileName = 'public/data/chat.json';
var chat = [];
var colors = randomColor({luminosity: 'dark', count: 512});
var count = 0;

function downloadChat()
{	
	var xmlReq = new XMLHttpRequest();
			filename = "https://www.grabugemusic.fr/g5/public/data/chat.json";
			xmlReq.open('GET', filename);
			xmlReq.setRequestHeader('Cache-Control', 'no-cache');
    		xmlReq.onloadend = function() {
				console.log("\""+filename+"\" loaded.");
				chat = JSON.parse(xmlReq.responseText);
				jsonString = JSON.stringify(chat, null, 2);
  				fs.writeFileSync(fileName, jsonString, err => {
					if (err) {
						console.log('Error writing file', err);
					} else {
						console.log('Successfully wrote file');
					}
				});
			}
			xmlReq.send();
}

function uploadChat()
{	
	request.post({
    	url: 'https://www.grabugemusic.fr/g5/public/data/backupChat.php',
    	json: true,
    	body: chat
	}, function(error, response, body){
    	if (!error && response.statusCode == 200) {
			if(body.success)
				console.log("(Done uploading chat ! " +body.message+")");
			else
				console.log("Error uploading chat ! " +body.message);
		}
	});
}

/*----------- Launch server -----------*/

server.listen(port,function() {
    console.log("| Web Server listening port " + port);
	downloadChat();
});

/*----------- Tools -----------*/

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

/*----------- Img receive -----------*/

var upload = multer({ dest: '/tmp' })

app.post('/image', upload.single("image"), function (req, res) {
   console.log('| Server received /image');
   var date = new Date();

   //var timeToAppend = date.getHours() + "h" + date.getMinutes() + "m" +  date.getSeconds() + "s" + date.getMilliseconds();

   var type = req.file.mimetype.split("/")[1];
   var name = req.body.name.replaceAll(" ", "_");
   var file = __dirname + "/uploads/" + name + /*"_" + timeToAppend +*/ "." + type;
   file = file.replaceAll(" ", "_");
   fs.readFile( req.file.path, function (err, data) {
        fs.writeFile(file, data, function (err) {
         if( err ){
              console.error( err );
              response = {
                   message: 'Sorry, file could not be uploaded.',
                   filename: req.file.originalname
              };
         }else{
               console.log("- Image saved");
               response = {
                   message: 'File uploaded successfully',
                   filename: req.file.originalname
              };
          }
          res.end( JSON.stringify( response ) );
       });
   });
});

/*----------- WS Server -----------*/

const wss = new WebSocketServer({
    server: server,
    autoAcceptConnections: true
});

wss.closeTimeout = 180 * 1000;

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    var msg = JSON.parse(message);
    
    switch(msg.command) {
    	case "keepAlive":
    		console.log("* I am alive !");
    		break;
    	case "newusername":
    		console.log('* newusername '+msg.name);
  			ws.send(JSON.stringify(
				{
					charset : 'utf8mb4', 
					command: "welcome",
					name: msg.name,
					color: colors[count]
				}));
			count++;
			break;
		case "newmess":
			console.log('* newmess u:'+msg.name+" d:"+msg.date+" msg:"+msg.content+" c:"+msg.color);
			obj = {
				name: msg.name,
				date: msg.date,
				content: msg.content,
				color: msg.color
			};
			chat.push(obj);
			uploadChat();
			wss.clients.forEach(function each(client) {
      			client.send(JSON.stringify(
					{
						charset : 'utf8mb4', 
						command: "newmess",
						name: msg.name,
						date: msg.date,
						content: msg.content,
						color: msg.color
					}));
    		});
			break;
  		case "getChat":
			//console.log('* getChat u:'+msg.name);
			ws.send(JSON.stringify(
				{
					charset : 'utf8mb4', 
					command: "getChat",
					name: msg.name,
					content: chat
				}));
			break;
  		default:
  			console.log('| WebSocket received : %s (ignored)', message);
  			break;
    }
  });
});
