module.exports = function(app) {

    var ReadingSvc = require("../mongo/reading_svc");

    var router = require('koa-route');

    app.use(router.get('/v1/sensors', function *() {
        this.body.data = [
            {
                sensorId: 123
            },
            {
                sensorId: 124
            }
        ];
    }));

    app.use(router.get('/v1/sensors/:id', function *(sensorId) {
        this.body.data = {
            sensorId: sensorId,
            description: "Humidity",
            unit: "%"
        };
    }));

    app.use(router.get('/v1/sensors/:id/readings', function *(sensorId) {
        this.body.data = {
            sensorId: sensorId,
            readings: []
        };
    }));

    app.use(router.post('/v1/sensors/:id/readings', function *(sensorId) {
        this.body.data = {
            sensorId: sensorId
        };
    }));


};