var mysql = require("mysql");
var express = require("express");
var multiparty = require('multiparty');
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
var jwt = require("./jwt.js");
var cors = require("cors");
var multer = require('multer');
var fs = require('fs');
var puppeteer = require("puppeteer");
var eventEmitter = require('events');
var fs = require("fs");
// var newEventEmitterNachrichtDrucken = require("newEventEmitterNachrichtDrucken");
// import PdfVonNachricht, { newEventEmitterNachrichtDrucken } from './PdfVonNachricht';
// var CREDS = require('./creds');
// var kontaktHighscore = require("./eigenesProjektKontakt.js");

var connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "messenger",
    charset: "UTF8MB4_BIN",
});

var eventEmitter = new eventEmitter();

var app = express();

app.use(cors());

app.use(express.static(path.join(__dirname)));

app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/login.html"))

app.get("/", function (request, response) {
    response.sendFile(path.join(__dirname + "/login.html"));
});
connection.connect(function (err) {
    if (err) {
        // response.send("ne man kacke");
        throw err;
    }
});

const storage = multer.diskStorage({
    destination: path.join(__dirname, "./public/uploads/"),
    filename: function (req, file, cb) {
        cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
}).single("myImage");

// Das Bild uploaden und den Namen vom file an
// den client zurücksenden 

app.post("/showImage", function (req, res) {
    console.log("test");
    upload(req, res, function (err) {
        if (err) {
            console.log(JSON.stringify(err));
            res.status(400).send('fail saving image');
        } else {
            console.log('The filename is ' + res.req.file.filename);
            res.send(res.req.file.filename);
        }
    });
});



// Das Bild in einen neuen ordner laden mit dem username als dateiname

app.post("/uploadMitName", function (req, res) {
    var token = req.body.token;
    var alteDatei = req.body.alteDatei;
    var fileAktuell = req.body.fileAktuell;

    var username;
    if (token != "") {
        tokenVerify = jwt.getTokenLegit(token);
        username = tokenVerify.user.username;
    }
    const usernameJpg = username + ".jpg";
    const getAlteDatei = path.join(__dirname, "./public/uploads/") + alteDatei;
    console.log("getAlteDatei: !!!!!!!!!!!!!!!" + getAlteDatei);
    fs.copyFile(getAlteDatei, path.join(__dirname, "./offizielesProfilbild/", usernameJpg), (err) => {
        if (err) throw err;
    });
    console.log("getAlteDatei: !!!!!!!!!!!!!!!" + getAlteDatei);
    res.send(fileAktuell);
});

app.get("/logoutUsername", function (req, res) {
    var token = req.query.token;
    console.log(token);
    var username;
    if (token == "" || token == null) {
        console.log("TOKEN IST LEER!!");
    }else{
        tokenVerify = jwt.getTokenLegit(token);
        username = tokenVerify.user.username;
    }
    res.send(username);
});

app.get("/seiteDruckenPDF",  async (req, res) => {
    try {
        var location = req.query.location;
        var token = req.query.token;
        var username;
        var password;
    
        if (token != "") {
            console.log("Token ist nicht leer")
            tokenVerify = jwt.getTokenLegit(token);
            username = tokenVerify.user.username;
            connection.query("SELECT * FROM accounts WHERE username = ?", [username], async  (error, results, fields) => {
                if (results.length > 0) {
                    console.log(results[0].password);
                    password = results[0].password;
                    console.log(password);
                }
                if (location != "") {
                    console.log(password + " bei unten");
                    // const browser = await puppeteer.launch({headless: false, args:['--no-sandbox', '--disable-setuid-sandbox']});
                    const browser = await puppeteer.launch({headless: true});
                    const page = await browser.newPage();
                    await page.setViewport({width: 1200, height: 720})
                    await page.goto("http://172.20.20.75:3000/#/", { waitUntil: 'networkidle2' });
                    console.log("Bei Schritt 1");
            
                    // Login
                    await page.type('#usernameInput', username);
                    await page.type('#passwordInput', password);
                    console.log("Bei Schritt 2");
            
                    // click and wait for navigation
                    await page.evaluate(()=>document.querySelector('#loginSubmit').click());
                    // await page.click('#loginSubmit');
                    await page.waitFor(5000);
                    console.log("Bei Schritt 3");
                    await page.evaluate(()=>document.querySelector('#iconButton').click());
                    // await page.click('#iconButton');
                    await page.waitFor(1000);
    
                    if(location == "http://localhost:3000/#/NachrichtSendenn"  || location == "http://172.20.20.75:3000/#/NachrichtSenden"){
                        await page.click('#idSenden');
                    }else if(location == "http://localhost:3000/#/NachrichtSenden"  || location == "http://172.20.20.75:3000/#/NachrichtSenden"){
                        await page.click('#idSenden');
                    }else if(location == "http://localhost:3000/#/GesendeteNachrichten"  || location == "http://172.20.20.75:3000/#/GesendeteNachrichten"){
                        await page.click('#idGesendeteNachrichten');
                    }else if(location == "http://localhost:3000/#/EmpfangeneNachrichten" || location == "http://172.20.20.75:3000/#/EmpfangeneNachrichten"){
                        await page.click('#idEmpfangeneNachrichten');
                    }else if(location == "http://localhost:3000/#/Einstellungen"  || location == "http://172.20.20.75:3000/#/Einstellungen"){
                        await page.click('#idEinstellungen');
                    }else{
                        console.log(location);
                    }
    
                    await page.waitFor(4000);
                    
                    var pdfPathName = __dirname + '/pdfOfPage/' + username + '.pdf';
    
                    var pdfPathNameRedirect =  "http://172.20.20.75:5000/pdfOfPage/" + username + '.pdf'; 
    
                    await page.pdf({path: pdfPathName, format: 'A4'});
                    await browser.close();
                    var file = fs.createReadStream(pdfPathName);
    
                    // var tempFile="D:/workspace/Messenger/hnnn.pdf";
                    // fs.readFile(tempFile, function (err,data){
                    //     response.contentType("application/pdf");
                    //     response.send(data);
                    //  });
                    file.pipe(res);
                    // res.send(pdfPathName);
                }else{
                res.send(400);
                } 
            });
        }
    } catch (oErr) {
        console.log(oErr);
    }
});

app.get("/getMessageValues", function (req, res) {
    var token = req.query.token;
    var id = req.query.id;
    if (id != "" || id != null) {
        console.log("id: " + id);
        connection.query("SELECT * FROM chatverlauf WHERE messageID = ?", [id], function (error, results, fields) {
            if (results.length > 0) {
                var messageIDDB = results[0].messageID;
                var subject = results[0].subject;
                var senderDB = results[0].senderID;
                var uhrzeit = results[0].date;
                var messageDB = results[0].message;
                var message = messageDB.toString();
                var messageID = messageIDDB.toString();
                var sender = senderDB.toString();
                dateObj = new Date(uhrzeit);

                var options = {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                };
                gesendetUm = dateObj.toLocaleString('de-DE', options);

                var empfangenVon = gesendetUm + "   " + "Von " + sender + ": " + subject;
                var btnUndMessage = {
                    von: empfangenVon,
                    message: message,
                    messageID: messageID,
                };
                console.log(results);
                console.log(btnUndMessage);
                res.send(btnUndMessage);
            } else {
                console.log(results);
                res.send(400);
            }
        });
    } else {
        console.log("id: " + id);
        res.send(400);
    }
});

app.get("/emitterNachrichtDrucken",  async (req, res) => {
    try {
        var token = req.query.token;
        var id = req.query.id;
        // var nachrichtObject = req.query.nachrichtObject;
        if (token != "") {
            console.log("Token ist nicht leer")
            tokenVerify = jwt.getTokenLegit(token);
            username = tokenVerify.user.username;
            connection.query("SELECT * FROM accounts WHERE username = ?", [username], async  (error, results, fields) => {
                if (results.length > 0) {
                    console.log(results[0].password);
                    password = results[0].password;
                    console.log(password);
                }
                if (token != "") {
                    console.log(password + " bei unten");
                    // const browser = await puppeteer.launch({headless: false, args:['--no-sandbox', '--disable-setuid-sandbox']});
                    const browser = await puppeteer.launch({headless: true});
                    const page = await browser.newPage();
                    await page.setViewport({width: 1200, height: 720})
                    await page.goto("http://172.20.20.75:3000/#/", { waitUntil: 'networkidle2' });
                    console.log("Bei Schritt 1");
            
                    // Login
                    await page.type('#usernameInput', username);
                    await page.type('#passwordInput', password);
                    console.log("Bei Schritt 2");
            
                    // click und auf navigation warten
                    await page.evaluate(()=>document.querySelector('#loginSubmit').click());
                    await page.waitFor(5000);
                    console.log("Bei Schritt 3");
                    // zur Seite mit dem Template gehen und mit evaluate die Messageinhalte schicken, da das mit goto nicht möglich ist
                    await page.goto("http://localhost:3000/#/PdfVonNachricht/" + id, { waitUntil: 'networkidle2' });
                    await page.waitFor(5000);
                    await page.evaluate(() => document.querySelector('#idOnClickPanelZumDrucken').click());
                    await page.waitFor(500);
                    
                    // pdfPathName ist der Name, unter dem die Pdf dann gespeichert wird 
                    var pdfPathName = __dirname + '/pdfOfMessage/' + username + '.pdf';
    
                    var pdfPathNameRedirect =  "http://172.20.20.75:5000/pdfOfMessage/" + username + '.pdf'; 
    
                    await page.pdf({path: pdfPathName, format: 'A4'});
                    await browser.close();
                    var file = fs.createReadStream(pdfPathName);
                    file.pipe(res);
                }else{
                res.send(400);
                } 
            });
        }
    } catch (oErr) {
        console.log(oErr);
    }
});

app.get("/zeigeAktuellesProfilbild", function (req, res) {
    var token = req.query.token;

    var username;
    if (token != "") {
        tokenVerify = jwt.getTokenLegit(token);
        username = tokenVerify.user.username;
    }
    const usernameJpg = username + ".jpg";

    res.send(usernameJpg);
});

app.post("/onClickAnmelden", function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        console.log("username: " + username);
        console.log("password: " + password);
        connection.query("SELECT * FROM accounts WHERE username = ? AND password = ?", [username, password], function (error, results, fields) {
            console.log("username: " + username);
            console.log("password: " + password);
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                var sTokenResponse = jwt.getToken(results[0]);
                response.status(200);
                response.send(sTokenResponse);
                console.log(sTokenResponse);
            } else {
                response.status(400);
                response.send("Incorrect Username and/or Password!");
            }
        });
    } else {
        response.status(400);
        response.send("Please enter Username and Password!");
    }
});

app.post("/onClickRegestrieren", function (request, response) {
    var usernameReg = request.body.usernameReg;
    var passwordReg = request.body.passwordReg;
    connection.query("SELECT * FROM accounts WHERE username = ?", [usernameReg], function (error, results, fields) {
        if (results.length > 0) {
            console.log("Username bereits vergeben!");
            response.redirect("/Regestrieren");
        } else {
            if (usernameReg.length > 0) {
                if (passwordReg.length > 5) {
                    if (passwordReg.match(/[a-z]/)) {
                        if (passwordReg.match(/[A-Z]/)) {
                            if (passwordReg.match(/\d/)) {
                                if (passwordReg.match(/\W/)) {
                                    console.log("Connected!");
                                    var sql = "INSERT INTO accounts (username, password) VALUES (" + connection.escape(usernameReg) + "," + connection.escape(passwordReg) + ")";
                                    connection.query(sql, function (err, result) {
                                        if (err) {
                                            response.send("ne man kacke behindert");
                                            throw err;
                                        }
                                        console.log("1 record inserted");
                                        response.send("Gut");
                                    });
                                } else {
                                    response.send("- Passwort braucht min. 1 Sonderzeichen -");
                                }
                            } else {
                                response.send("- Passwort braucht min 1 Zahl -");
                            }
                        } else {
                            response.send("- Passwort braucht min. 1 Großbuchstaben -");
                        }
                    } else {
                        response.send("- Passwort brauch min. 1 Kleinbuchstaben -");
                    }
                } else {
                    response.send("- Passwort zu kurz -");
                }
            } else {
                response.send("- Benutzername zu kurz -");
            }
        }
    });
});

app.get("/getSelectedUser", function (request, response) {
    var messageArray = [];
    connection.query("SELECT * FROM accounts", function (error, results, fields) {
        if (results.length > 0) {
            for (i = 0; i < results.length; i++) {
                messageArray.push({
                    value: results[i].id,
                    label: results[i].username
                });
            }
            response.send(messageArray);
        }
    });
});

app.post("/saveMassage", function (request, response) {

    var uhrzeit = Date.now();
    console.log("Uhrzeit: " + uhrzeit);
    var receiver = request.body.receiver;
    var subject = request.body.subject;
    var message = request.body.message;
    var token = request.body.token;
    var zugriffReceiver = 1;
    var zugriffSender = 1;
    var gelesenUm = 0;
    if (token != "") {
        tokenVerify = jwt.getTokenLegit(token);
        sender = tokenVerify.user.username;
        console.log(sender);
    }

    console.log("receiver" + receiver);
    connection.query("SELECT * FROM accounts WHERE id = ?", [receiver], function (error, results, fields) {
        if (results.length > 0) {
            receiver = results[0].username;
            console.log(receiver);
            console.log(sender);

            if (receiver && subject && message) {
                var sql = "INSERT INTO chatverlauf (receiverID, senderID, date, subject, message, gelesenUm, zugriffReceiver, zugriffSender) VALUES (" + connection.escape(receiver) + "," + connection.escape(sender) + ", " + connection.escape(uhrzeit) + ", " + connection.escape(subject) + ", " + connection.escape(message) + ", " + connection.escape(gelesenUm) + ", " + connection.escape(zugriffReceiver) + ", " + connection.escape(zugriffSender) + ")";
                connection.query(sql, function (err, result) {
                    if (err) {
                        response.send("ne man kacke behindert");
                        throw err;
                    }
                    console.log("1 record inserted");
                    response.send("Wurde zum chatverlauf hinzugefügt");
                });
            } else {
                response.status(400);
                response.send("Please enter receiver and message!");
            }
        }else{
            response.status(400);
            response.send("Empfänger existiert nicht mehr");
        }
    });
});


app.get("/zeigeGesendeteAnzahl", function (request, response) {
    var token = request.query.token;
    if (token != "") {
        verifyToken = jwt.getTokenLegit(token);
        username = verifyToken.user.username;
        zugriff = 1;
        connection.query("SELECT * FROM chatverlauf WHERE zugriffSender = ? && senderID = ?", [zugriff, username], function (error, results, fields) {
            console.log(results.length);
            var gesendeteNachrichtenAnzahl = results.length;
            response.status(200);
            response.json(gesendeteNachrichtenAnzahl);
        });
    }
});



app.get("/zeigeGesendet", function (request, response) {
    var token = request.query.token;
    var sOffset = request.query.offset;
    var offset = parseInt(sOffset);
    var messageArray = [];
    if (token != "") {
        verifyToken = jwt.getTokenLegit(token);
        username = verifyToken.user.username;
        zugriff = 1;
        connection.query("SELECT * FROM chatverlauf WHERE zugriffSender = ? && senderID = ? ORDER BY date DESC LIMIT 10 OFFSET ?", [zugriff, username, offset ], function (error, results, fields) {
            if (results.length >= 0) {
                for (i = 0; i < results.length; i++) {
                    var messageID = results[i].messageID;
                    var messageDB = results[i].message;
                    var receiverDB = results[i].receiverID;
                    var subject = results[i].subject;
                    var uhrzeit = results[i].date;
                    var gelesenUmUnix = results[i].gelesenUm;
                    var gelesenVor = gelesenUmUnix - uhrzeit;
                    var gelesenVorInMinuten = Math.floor(gelesenVor / 1000 / 60);

                    dateObj = new Date(gelesenUmUnix);
                    dateObjZwei = new Date(uhrzeit);

                    var options = {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                    };
                    gesendetUm = dateObjZwei.toLocaleString('de-DE', options);
                    if(gelesenUmUnix === 0){
                        gelesenUm = "ungelesen";
                    }else{
                        gelesenUm = dateObj.toLocaleString('de-DE', options);
                    }

                    var receiver = receiverDB.toString();
                    var message = messageDB.toString();
                    var gesendetAn = gesendetUm + ".........." + "Gelesen am : " + gelesenUm + ".........." + "An " + receiver + ": " + subject;
                    var btnUndMessage = {
                        an: gesendetAn,
                        message: message,
                        messageID: messageID,
                    };
                    messageArray.push(btnUndMessage);
                }
                response.send(messageArray);
            }
        });
    } else {
        console.log("Token ist leer");
    }
});

app.get("/zeigeGesendetNachricht", function (request, response) {
    console.log("kommt bei zeigeEmpfangenNachricht an");
    var token = request.query.token;
    var date = request.query.date;
    var iNeu = request.query.i;
    var messageArray = [];
    console.log("Token bei zeigeGesendetNachricht: " + token);
    if (token != "") {
        verifyToken = jwt.getTokenLegit(token);
        // console.log(verifyToken);
        username = verifyToken.user.username;
        console.log(username);
        connection.query("SELECT * FROM chatverlauf WHERE senderID = ?", [username], function (error, results, fields) {
            if (results.length > 0) {
                for (i = 0; i < results.length; i++) {
                    var massageIDDB = results[i].messageID;
                    var messageDB = results[i].message;
                    var message = messageDB.toString();
                    var messageID = massageIDDB.toString();
                    var btnUndMessage = {
                        message: message
                    };
                    messageArray.push(btnUndMessage);
                }
                response.send(messageArray);
            }
        });
    } else {
        console.log("Token ist leer");
    }
});



app.get("/zeigeEmpfangenAnzahl", function (request, response) {
    var token = request.query.token;
    if (token != "") {
        verifyToken = jwt.getTokenLegit(token);
        username = verifyToken.user.username;
        zugriff = 1;
        connection.query("SELECT * FROM chatverlauf WHERE zugriffReceiver = ? && receiverID = ?", [zugriff, username], function (error, results, fields) {
            var empfangeneNachrichtenAnzahl = results.length;
            response.status(200);
            response.json(empfangeneNachrichtenAnzahl);
        });
    }
});

app.get("/zeigeEmpfangen", function (request, response) {
    var token = request.query.token;
    var sOffset = request.query.offset;
    var offset = parseInt(sOffset);
    var messageArray = [];
    if (token != "") {
        verifyToken = jwt.getTokenLegit(token);
        username = verifyToken.user.username;
        zugriff = 1;
        connection.query("SELECT * FROM chatverlauf WHERE zugriffReceiver = ? && receiverID = ? ORDER BY date DESC LIMIT 10 OFFSET ?", [zugriff, username, offset], function (error, results, fields) {
            if (results.length >= 0) {
                for (i = 0; i < results.length; i++) {
                    var messageIDDB = results[i].messageID;
                    var subject = results[i].subject;
                    var senderDB = results[i].senderID;
                    var uhrzeit = results[i].date;
                    var messageDB = results[i].message;
                    var message = messageDB.toString();
                    var messageID = messageIDDB.toString();
                    var sender = senderDB.toString();
                    dateObj = new Date(uhrzeit);

                    var options = {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                    };
                    gesendetUm = dateObj.toLocaleString('de-DE', options);

                    var empfangenVon = gesendetUm + "   " + "Von " + sender + ": " + subject;
                    var btnUndMessage = {
                        von: empfangenVon,
                        message: message,
                        messageID: messageID,
                    };
                    messageArray.push(btnUndMessage);
                }
                response.send(messageArray);
            }
        });
    } else {
        // response.redirect("/login.html");
        console.log("Token ist leer");
    }
});

//function bei emfangenenachrichten die ausgeführt wird sobald ein betreff angeklickt wurde und die nachricht angezeigt werden soll

app.post("/gelesenUmZeit", function (request, response) {
    console.log("kommt bei zeigeEmpfangenNachricht annnn");
    var token = request.body.token;
    var messageID = request.body.messageID;
    var date = Date.now();


    if (token != "") {
        verifyToken = jwt.getTokenLegit(token);
        console.log(verifyToken);
        username = verifyToken.user.username;
        zugriff = 1;
        connection.query("SELECT * FROM chatverlauf WHERE messageID = ?", [messageID], function (error, results, fields) {
            if (results.length > 0) {
                // for (i = 0; i < results.length; i++) {
                //     var massageIDDB = results[i].messageID;
                //     var messageID = massageIDDB.toString();
                // }
                if (date) {
                    console.log(date);
                    var gelesenUm = results[0].gelesenUm;
                    console.log("gelesenUm" + gelesenUm);
                    if (gelesenUm = "0") {
                        var sql = "UPDATE chatverlauf SET gelesenUm = " + connection.escape(date) + " WHERE messageID = '" + messageID + "' ";
                        console.log("message. " + messageID);
                        connection.query(sql, function (err, result) {
                            if (err) {
                                throw err;
                            }else{
                                response.send(200);
                            }
                        });
                    }
                }
            }
        });
    } else {
        console.log("Token ist leer");
    }
});

app.post("/loescheNachrichtReceiver", function (request, response) {
    console.log("kommt bei loescheNachricht an");
    var token = request.body.token;
    var nachrichtDiv = request.body.nachrichtDiv;
    var messageID = request.body.messageID;
    console.log(nachrichtDiv);
    console.log("Token bei loescheNachricht: " + token);
    if (token != "") {
        verifyToken = jwt.getTokenLegit(token);
        // console.log(verifyToken);
        connection.query("SELECT * FROM chatverlauf WHERE messageID = ?", [messageID], function (error, results, fields) {
            if (results.length > 0) {
                console.log(results);
                var zugriffReceiver = results[0].zugriffReceiver;
                var zugriffSender = results[0].zugriffSender;
                console.log("MESSAGEID: " + messageID);

                if (zugriffReceiver == 1) {
                    var sql = "UPDATE chatverlauf SET zugriffReceiver = 2 WHERE messageID = '" + messageID + "' ";
                    connection.query(sql, function (err, result) {
                        if (err) throw err;
                    });
                    var zugriffZwei = 2;
                    var sql = "DELETE FROM chatverlauf WHERE zugriffSender = " + zugriffZwei + " AND zugriffReceiver = " + zugriffZwei + " ";
                    connection.query(sql, function (err, result) {
                        if (err) throw err;
                    });
                }
                response.status("200");
                response.send("gut");
            }
        });
    } else {
        console.log("Token ist leer");
    }
});

app.post("/loescheNachrichtSender", function (request, response) {
    console.log("kommt bei loescheNachricht an");
    var token = request.body.token;
    var messageID = request.body.messageID;
    console.log("Token bei loescheNachricht: " + token);
    if (token != "") {
        verifyToken = jwt.getTokenLegit(token);
        connection.query("SELECT * FROM chatverlauf WHERE messageID = ?", [messageID], function (error, results, fields) {
            if (results.length > 0) {
                console.log(results);
                var zugriffReceiver = results[0].zugriffReceiver;
                var zugriffSender = results[0].zugriffSender;

                console.log(zugriffSender);
                console.log(zugriffReceiver);
                if (zugriffSender == 1) {
                    console.log("ZUGRIFFSENDER IST 1 UND ICH KRIEGE EINEN KNAXX")
                    var sql = "UPDATE chatverlauf SET zugriffSender = 2 WHERE messageID = '" + messageID + "' ";
                    connection.query(sql, function (err, result) {
                        if (err) throw err;
                    });
                    var zugriffZwei = 2;
                    var sql = "DELETE FROM chatverlauf WHERE zugriffSender = " + zugriffZwei + " AND zugriffReceiver = " + zugriffZwei + " ";
                    connection.query(sql, function (err, result) {
                        if (err) throw err;
                    });
                }
                response.status(200);
                response.send("gut");
            }
        });
    } else {
        console.log("Token ist leer");
    }
});

app.post("/usernameAendern", function (request, response) {
    console.log("kommt bei usernameAendern an");
    var token = request.body.token;
    var password = request.body.password;
    var neuerUsername = request.body.neuerUsername;

    if (token != "") {
        verifyToken = jwt.getTokenLegit(token);
        console.log(verifyToken);
        username = verifyToken.user.username;

        if (username && neuerUsername && password) {
            connection.query("SELECT * FROM accounts WHERE username = ?", [neuerUsername], function (error, results, fields) {
                if (results.length > 0) {
                    response.send("vergeben");
                } else {
                    connection.query("SELECT * FROM accounts WHERE username = ?", [username], function (error, results, fields) {
                    if(results[0].password == password){
                        var sql = "UPDATE accounts SET username = " + connection.escape(neuerUsername) + " WHERE username = '" + username + "' ";
                        connection.query(sql, function (err, result) {
                            if (err) {
                                throw err;
                            }
                        });
                        response.send("good");
                    }else{
                        response.send("falsches Passwort")
                    }
                });
                }
            });
        } else {
            response.send("leer");
        }
    }
});

app.post("/passwordAendern", function (request, response) {
    console.log("kommt bei passwordAendern an");
    var token = request.body.token;
    var altesPassword = request.body.altesPassword;
    var neuesPassword = request.body.neuesPassword;

    if (token != "") {
        verifyToken = jwt.getTokenLegit(token);
        username = verifyToken.user.username;
        if (altesPassword && neuesPassword) {
            connection.query("SELECT * FROM accounts WHERE username = ?", [username], function (error, results, fields) {
                if (results.length > 0) {
                    if (results[0].password == altesPassword) {
                        var sql = "UPDATE accounts SET password = " + connection.escape(neuesPassword) + " WHERE username = '" + username + "' ";
                        connection.query(sql, function (err, result) {
                            if (err) {
                                throw err;
                            }
                        });
                        response.send("good");
                    } else {
                        response.send("fail");
                    }
                } else {
                    response.send("leer");
                }
            });
        }
    }
});


app.listen(5000);
console.log("server runs on port 5000");