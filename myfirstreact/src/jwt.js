'use strict';

var base64UrlEncode = require("base64url")
const jwt = require('jsonwebtoken');
var fs = require("fs");
var path = require("path");

// PRIVATE and PUBLIC key
var privateKEY = fs.readFileSync('D:\\workspace\\JS-Kurs\\private.key');
var publicKEY = fs.readFileSync('D:\\workspace\\JS-Kurs\\public.key');


exports.getToken = function (user) {
      var header = base64UrlEncode(JSON.stringify({
            "typ": "JWT",
            "alg": "HS256"
      }));
      /*
      ==============================   JWT Signing ===============================
      */
      var payload = {
            user: user,
      };

      var i = "Mysoft corp"; // Issuer 
      var s = "romanvartanjan@gmail.com"; // Subject 
      var a = "http://172.20.20.75:4000"; // Audience

      var signOptions = {
            issuer: i,
            subject: s,
            audience: a,
            expiresIn: "12h",
            algorithm: "RS256"
      };

      var token = jwt.sign(payload, privateKEY, signOptions);
      console.log("Token - " + token);

      return token;
}

exports.getTokenLegit = function (token) {
      /*
      ==============================   JWT Signing ===============================
      */


      var i = "Mysoft corp"; // Issuer 
      var s = "romanvartanjan@gmail.com"; // Subject 
      var a = "http://172.20.20.75:4000"; // Audience

      /*
      ==============================   JWT Verify ===============================
      */
      var verifyOptions = {
            issuer: i,
            subject: s,
            audience: a,
            expiresIn: "12h",
            algorithm: ["RS256"]
      };

      var legit = jwt.verify(token, publicKEY, verifyOptions);

      return legit;
}