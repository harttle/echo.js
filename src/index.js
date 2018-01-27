var http = require('http');

function defaultStatusLine(req) {
    return req.method + ' ' + req.url + ' HTTP/' + req.httpVersion;
}

function defaultHeaders(req) {
    return req.rawHeaders
        .map((val, i) => i%2 ? val + '\n' : val + ': ')
        .join('');
}

function defaultCloseCb() {
    console.log('echo.js shutdown successful');
}

function createServer(opts) {
    opts = opts || {};

    return http.createServer(function (req, res) {
        var statusLine = opts.statusLine || defaultStatusLine(req);
        var headers = opts.headers || defaultHeaders(req);
        var text = statusLine + '\n' + headers;
        text += '\n';

        req.addListener('data', chunk => text += chunk);
        req.addListener('end', function () {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(text);
            if (req.url === '/shutdown' && req.method === 'POST') {
                server.close(opts.closeCb || defaultCloseCb);
            }
        });
    });
}

module.exports = {
    defaults: {
        defaultStatusLine,
        defaultHeaders,
        defaultCloseCb,
    },
    createServer,
};
