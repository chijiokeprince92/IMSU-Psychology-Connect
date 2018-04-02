var connect = require('connect');

var interceptorfunction = function(request, response, next) {
    console.log('request for % with method %', request.url, request.method);
    next();
};

var server = connect()
    .use(interceptorFunction)
    .use(function onrequest(request, response) {

        response.end('Hello from connect');
    }).listen(8080);