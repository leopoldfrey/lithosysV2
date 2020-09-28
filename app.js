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

app.get('/chatbank.html',function(req,res){
      res.sendFile(__dirname + "/public/chatbank.html");
});

app.get('/info.html',function(req,res){
      res.sendFile(__dirname + "/public/info.html");
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

app.use('/android-icon-36x36.png', express.static('public/android-icon-36x36.png'));
app.use('/android-icon-48x48.png', express.static('public/android-icon-48x48.png'));
app.use('/android-icon-72x72.png', express.static('public/android-icon-72x72.png'));
app.use('/android-icon-96x96.png', express.static('public/android-icon-96x96.png'));
app.use('/android-icon-144x144.png', express.static('public/android-icon-144x144.png'));
app.use('/android-icon-192x192.png', express.static('public/android-icon-192x192.png'));
app.use('/apple-icon-57x57.png', express.static('public/apple-icon-57x57.png'));
app.use('/apple-icon-60x60.png', express.static('public/apple-icon-60x60.png'));
app.use('/apple-icon-72x72.png', express.static('public/apple-icon-72x72.png'));
app.use('/apple-icon-76x76.png', express.static('public/apple-icon-76x76.png'));
app.use('/apple-icon-114x114.png', express.static('public/apple-icon-114x114.png'));
app.use('/apple-icon-120x120.png', express.static('public/apple-icon-120x120.png'));
app.use('/apple-icon-144x144.png', express.static('public/apple-icon-144x144.png'));
app.use('/apple-icon-152x152.png', express.static('public/apple-icon-152x152.png'));
app.use('/apple-icon-180x180.png', express.static('public/apple-icon-180x180.png'));
app.use('/apple-icon-precomposed.png', express.static('public/apple-icon-precomposed.png'));
app.use('/apple-icon.png', express.static('public/apple-icon.png'));
app.use('/browserconfig.xml', express.static('public/browserconfig.xml'));
app.use('/favicon-16x16.png', express.static('public/favicon-16x16.png'));
app.use('/favicon-32x32.png', express.static('public/favicon-32x32.png'));
app.use('/favicon-96x96.png', express.static('public/favicon-96x96.png'));
app.use('/favicon.ico', express.static('public/favicon.ico'));
app.use('/manifest.json', express.static('public/manifest.json'));
app.use('/ms-icon-70x70.png', express.static('public/ms-icon-70x70.png'));
app.use('/ms-icon-144x144.png', express.static('public/ms-icon-144x144.png'));
app.use('/ms-icon-150x150.png', express.static('public/ms-icon-150x150.png'));
app.use('/ms-icon-310x310.png', express.static('public/ms-icon-310x310.png'));

app.use('/strings-fr.json', express.static('public/strings-fr.json'));
app.use('/strings-fr-FR.json', express.static('public/strings-fr.json'));
app.use('/strings-en.json', express.static('public/strings-en.json'));
app.use('/strings-en-US.json', express.static('public/strings-en.json'));


/*----------- Download/Upload votes -----------*/

var localDataFolder = path.dirname(fs.realpathSync(__filename))+'/public/data';
console.log('local data folder \"', localDataFolder, "\"");
    
/*----------- parameters -----------*/

var fileName = 'public/data/chat.json';
var fileNameBank = 'public/data/chatBank.json';
var chat = [];
var chatBank = [];
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
				downloadChatBank();
			}
			xmlReq.send();
}

function downloadChatBank()
{	
	var xmlReq = new XMLHttpRequest();
			filename = "https://www.grabugemusic.fr/g5/public/data/chatBank.json";
			xmlReq.open('GET', filename);
			xmlReq.setRequestHeader('Cache-Control', 'no-cache');
    		xmlReq.onloadend = function() {
				console.log("\""+filename+"\" loaded.");
				chatBank = JSON.parse(xmlReq.responseText);
				jsonString = JSON.stringify(chatBank, null, 2);
  				fs.writeFileSync(fileNameBank, jsonString, err => {
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

function uploadChatBank()
{	
	request.post({
    	url: 'https://www.grabugemusic.fr/g5/public/data/backupChatBank.php',
    	json: true,
    	body: chatBank
	}, function(error, response, body){
    	if (!error && response.statusCode == 200) {
			if(body.success)
				console.log("(Done uploading chatBank ! " +body.message+")");
			else
				console.log("Error uploading chatBank ! " +body.message);
		}
	});
}

function randomPick() {
	i = getRandomInt(chatBank.length);
	obj = {
		name: chatBank[i].name,
		type: chatBank[i].type,
		date: Date.now(),
		content: chatBank[i].content,
		color: chatBank[i].color
	};
	chat.push(obj);
	uploadChat();
	console.log("Random Pick "+obj.name+" "+obj.type+" "+obj.content);
	wss.clients.forEach(
		function each(client) {
      		client.send(JSON.stringify(
				{
					charset : 'utf8mb4', 
					command: "newmess",
					name: obj.name,
					type: obj.type,
					date: obj.date,
					content: obj.content,
					color: obj.color
				}));
    	}
    );
	
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
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
    		console.log('* newusername '+msg.name+' t:'+msg.type);
  			ws.send(JSON.stringify(
				{
					charset : 'utf8mb4', 
					command: "welcome",
					name: msg.name,
					type: msg.type,
					color: colors[count]
				}));
			count++;
			setTimeout(randomPick, 5000);
			break;
		case "newmess":
			console.log('* newmess u:'+msg.name+" t:"+msg.type+" d:"+msg.date+" msg:"+msg.content+" c:"+msg.color);
			obj = {
				name: msg.name,
				type: msg.type,
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
						type: msg.type,
						date: msg.date,
						content: msg.content,
						color: msg.color
					}));
    		});
			break;
		case "delmess":
			console.log('* delmess d:'+msg.date);
			chat = chat.filter(function(jsonObject) {
    			return jsonObject.date != msg.date;
			});
			uploadChat();
			
			wss.clients.forEach(function each(client) {
      			client.send(JSON.stringify(
					{
						charset : 'utf8mb4', 
						command: "refresh",
						content: chat
					}));
    		});
			break;
		case "newmessBank":
			console.log('* newmessBank u:'+msg.name+" t:"+msg.type+" d:"+msg.date+" msg:"+msg.content+" c:"+msg.color);
			obj = {
				name: msg.name,
				type: msg.type,
				date: msg.date,
				content: msg.content,
				color: msg.color
			};
			chatBank.push(obj);
			uploadChatBank();
			wss.clients.forEach(function each(client) {
      			client.send(JSON.stringify(
					{
						charset : 'utf8mb4', 
						command: "getChatBank",
						content: chatBank
					}));
    		});
			break;
		case "editmessBank":
			console.log('* editmessBank u:'+msg.name+" t:"+msg.type+" d:"+msg.date+" msg:"+msg.content+" c:"+msg.color);
			
			obj = chatBank.filter(function(jsonObject) {
    			return jsonObject.date == msg.date;
			});
			obj[0].name = msg.name;
			obj[0].type = msg.type;
			obj[0].content = msg.content;
			obj[0].color = msg.color;
			
			//chatBank.push(obj);
			uploadChatBank();
			wss.clients.forEach(function each(client) {
      			client.send(JSON.stringify(
					{
						charset : 'utf8mb4', 
						command: "getChatBank",
						content: chatBank
					}));
    		});
			break;
		case "delmessBank":
			console.log('* delmessBank d:'+msg.date);
			
			chatBank = chatBank.filter(function(jsonObject) {
    			return jsonObject.date != msg.date;
			});
			uploadChatBank();
			
			wss.clients.forEach(function each(client) {
      			client.send(JSON.stringify(
					{
						charset : 'utf8mb4', 
						command: "getChatBank",
						content: chatBank
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
  		case "getChatBank":
			console.log('* getChatBank');
			ws.send(JSON.stringify(
				{
					charset : 'utf8mb4', 
					command: "getChatBank",
					content: chatBank
				}));
			break;
  		default:
  			console.log('| WebSocket received : %s (ignored)', message);
  			break;
    }
  });
});
