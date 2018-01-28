const http = require('http');
const defaults = require('./defaults');

function createServer({ statusLine, headers, onResponseEndCb } = {}) {
    const server = http.createServer(function(req, res) {
        var statusLine = statusLine || defaults.statusLine(req);
        var headers = headers || defaults.headers(req);
        var text = statusLine + '\n' + headers;
        text += '\n';

        req.addListener('data', chunk => (text += chunk));
        req.addListener('end', function() {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(text, () => {
                if (onResponseEndCb) {
                    onResponseEndCb({ req, server });
                }
            });
        });
    });

    return server;
}

module.exports = {
    defaults,
    createServer,
};
