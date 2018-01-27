#!/usr/bin/env node

var http = require('http');
var process = require('process')
 
var server = http.createServer(function (req, res) {
    var text = '';
    text += req.method + ' ' + req.url + ' HTTP/' + req.httpVersion + '\n';
    text += '\n';
    text += req.rawHeaders
        .map((val, i) => i%2 ? val + '\n' : val + ': ')
        .join('');
    text += '\n';
    req.addListener('data', chunk => text += chunk);
    req.addListener('end', function () {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(text);
        if (req.url === '/shutdown' && req.method === 'POST') {
            server.close(function () {
                console.log('echo.js shutdown successful');
            });
        }
    });
});

var port = process.env.PORT || 8061;

server.listen(port, function(){
    console.log('echo.js listening to port', port)
});
