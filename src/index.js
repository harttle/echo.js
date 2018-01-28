const http = require('http');
const defaults = require('./defaults');

function createServer({ statusLine, headers, closeCb } = {}) {
    const server = http.createServer(function(req, res) {
        var statusLine = statusLine || defaults.statusLine(req);
        var headers = headers || defaults.headers(req);
        var text = statusLine + '\r\n' + headers;
        text += '\r\n';

        req.addListener('data', chunk => (text += chunk));
        req.addListener('end', function() {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(text);
            if (req.url === '/shutdown' && req.method === 'POST') {
                server.close(closeCb || defaults.closeCb);
            }
        });
    });

    return server;
}

module.exports = {
    defaults,
    createServer,
};
