#!/usr/bin/env node

var process = require('process');
var echojs = require('./src');

var server = echojs.createServer();

var port = process.env.PORT || 8061;

server.listen(port, function() {
    console.log('echo.js listening to port', port);
});
