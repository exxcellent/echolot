/*
 * This file (nodejs_httpserver.js) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2011 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * a simple server for nodejs 0.4x.
 * 1. Simply install nodejs
 * 2. Run "node nodejs_httpserver.js" in the folder of the test application
 * 3. Point your browser on the test page
 *
 * Based on:
 * @see http://42blue.de/webstandards/statischer-webserver-in-nodejs
 */
HOST = null; // localhost
PORT = 8000;
var sys = require("sys"),  
    http = require("http"),  
    url = require("url"),  
    path = require("path"),  
    fs = require("fs");
var server = http.createServer(function (req, res) {
  var uri = url.parse(req.url).pathname; 
  var filename = path.join(process.cwd(), uri);  
  path.exists(filename, function (exists) {	
    if(!exists) {  
	  res.writeHead(404, { "Content-Type": "text/plain"});
  	  res.end("Not Found");
    }
    fs.readFile(filename, function (err, data) {	
        if(err) {  
            res.writeHead(500, {"Content-Type": "text/plain"});  
            res.end(err + "\n");    
            return;  
        }
        res.writeHead(200); 
        res.write(data, "binary");
        res.end();
	});
  });
});
listen = function (port, host) {
  server.listen(port, host);
  sys.puts("Server at http://" + (host || "127.0.0.1") + ":" + port.toString() + "/");
};
listen(Number(PORT), HOST);
