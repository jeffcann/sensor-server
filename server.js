var uuid = require('node-uuid');
var koa = require('koa');
var middlewares = require('koa-middlewares');
var app = koa();


// initialise body with a unique request id
app.use(function *(next) {
    this.body = { };
    this.body._requestId = uuid.v4();
    this.body._request = { url: this.url, method: this.method, from:(this.req.headers['x-forwarded-for'] || this.req.connection.remoteAddress) };
    this.body._info = {};
    yield next;
});


// total time
app.use(function *(next) {
    var startTime = process.hrtime();
    yield next;
    var totalTime = process.hrtime(startTime);
    this.body._info.requestTimeMillis = (totalTime[0] * 1000000000 + totalTime[1]) / 1000000;
});

app.use(middlewares.logger());
app.use(middlewares.bodyParser());
middlewares.csrf(app);

// render time
app.use(function *(next) {
    var startTime = process.hrtime();
    yield next;
    var totalTime = process.hrtime(startTime);
    this.body._info.renderTimeMillis = (totalTime[0] * 1000000000 + totalTime[1]) / 1000000;
});


app.use(require('./routes/routes'));

// add a status if we don't have one
app.use(function *(next) {
    if(!this.body._status) {
        this.body._status = {code: 404, message: "Not found"};
    }

    yield next;
});

app.listen(3000);