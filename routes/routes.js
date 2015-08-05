var ReadingSvc = require("../mongo/reading_svc");
var router = require('koa-router')();

ReadingSvc.connect(function() { console.log('connected'); }, "localhost");

router.get('/v1/sensors', function *(next) {

    console.log("getting all sensors!");

    this.body.data = [
        {
            sensorId: 123
        },
        {
            sensorId: 124
        }
    ];

    yield next;
});

router.get('/v1/sensors/:id', function *(next) {

    console.log("getting sensor!");

    this.body.data = {
        sensorId: this.params.id,
        description: "Humidity",
        unit: "%"
    };

    yield next;
});

router.get('/v1/sensors/:id/readings', function *(next) {

    console.log("getting last reading!");

    this.body.data = {
        sensorId: this.params.id,
        readings: []
    };

    yield next;
});

router.post('/v1/sensors/:id/readings', function *(next) {

    try {
        var resp = yield ReadingSvc.add(this.params.id, this.query.value);

        if(resp) {
            console.log("added new reading!");
            this.body._status = {code:201, message:"OK", status:"reading created"};
            this.body.data = resp;
        } else {
            console.log("error adding new reading!");
            body._status = {code:400, message:"err"};
        }
    } catch(err) {
        console.log("error adding new reading!", err);
        body._status = {code:400, message:"err", err:err};
    }

    yield next;
});

module.exports = router.routes();