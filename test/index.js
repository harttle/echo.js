const assert = require('chai').assert;
const client = require('./client');
const { createServer } = require('../src');

const server = createServer();
const port = 8061;

server.listen(port, function() {
    /*
    GET /api/v1/pizzas HTTP/1.1
    Host: localhost:8061
    Accept-Encoding: gzip, deflate
    User-Agent: node-superagent/3.8.2
    Connection: close

    */
    const getPizzasPromise = client.getPizzas().then(res => {
        // add assertions, e.g.
        const lines = res.text.split('\n');

        assert.equal(lines[0], 'GET /api/v1/pizzas HTTP/1.1');
    });

    /*
    POST /api/v1/pizzas HTTP/1.1
    Host: localhost:8061
    Accept-Encoding: gzip, deflate
    User-Agent: node-superagent/3.8.2
    Content-Type: application/json
    X-API-Key: foobar
    Content-Length: 21
    Connection: close

    {"name":"margherita"}
    */
    const postPizzasPromise = client.postPizza().then(res => {
        // add assertions, e.g.
        assert.equal(
            res.text,
            [
                'POST /api/v1/pizzas HTTP/1.1',
                'Host: localhost:8061',
                'Accept-Encoding: gzip, deflate',
                'User-Agent: node-superagent/3.8.2',
                'Content-Type: application/json',
                'X-API-Key: foobar',
                'Content-Length: 21',
                'Connection: close',
                '',
                '{"name":"margherita"}',
            ].join('\n'),
        );
    });

    Promise.all([getPizzasPromise, postPizzasPromise])
        .then(() => {
            console.log('All tests pass');
        })
        .catch(err => {
            console.error(err.message);
        })
        .then(() => {
            server.close();
        });
});
