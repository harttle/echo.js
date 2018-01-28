function statusLine(req) {
    return req.method + ' ' + req.url + ' HTTP/' + req.httpVersion;
}

function headers(req) {
    return req.rawHeaders.map((val, i) => (i % 2 ? val + '\r\n' : val + ': ')).join('');
}

module.exports = {
    statusLine,
    headers,
};
