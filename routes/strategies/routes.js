module.exports = function(app) {

    app.use(function *(next) {
        yield next;
    });

};