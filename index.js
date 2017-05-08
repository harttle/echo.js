#!/usr/bin/env node

var http = require('http');
 
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
    });
});

server.listen(8061);
