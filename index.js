// Accessory for HDMI CEC connected devices
var Service, Characteristic;
var NodeCEC = require('nodecec');
var deviceModule = require('./lib/devices');
var cec = new NodeCEC();
var devices = deviceModule.devices;

CECInit();

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-hdmi", "TV", TvAccessory);
    homebridge.registerAccessory("homebridge-hdmi", "AMP", AmpAccessory);
};


function TvAccessory(log, config) {
    this.service = new Service.Switch('TV');
    this.service
        .getCharacteristic(Characteristic.On)
        .on('get', this.getOn.bind(this))
        .on('set', this.setOn.bind(this));
}

TvAccessory.prototype.getOn = function(callback) {
    var state = (devices[0].status == 1 ? 'on' : 'off');
    callback(null, state);
}

TvAccessory.prototype.setOn = function(on, callback) {
    if (devices[0].status == 0) {
        console.log('Turning TV on');
        cec.send('on 0');
        devices[0].status = 1;
    } else {
        console.log('Turning TV off');
        cec.send('standby 0');
        devices[0].status = 0;
    }

    callback(null);
}

TvAccessory.prototype.getInformationService = function() {
    var informationService = new Service.AccessoryInformation();
    informationService
        .setCharacteristic(Characteristic.Name, 'HDMI TV')
        .setCharacteristic(Characteristic.Manufacturer, 'Unknown')
        .setCharacteristic(Characteristic.Model, '1.0.0')
        .setCharacteristic(Characteristic.SerialNumber, '123456789');
    return informationService;
};

TvAccessory.prototype.getServices = function() {
    return [this.service, this.getInformationService()];
};


function AmpAccessory(log, config) {
    this.service = new Service.Switch('AMP');
    this.service
        .getCharacteristic(Characteristic.On)
        .on('get', this.getOn.bind(this))
        .on('set', this.setOn.bind(this));
}

AmpAccessory.prototype.getOn = function(callback) {
    var state = (devices[5].status == 1 ? 'on' : 'off');
    callback(null, state);
}

AmpAccessory.prototype.setOn = function(on, callback) {
    if (devices[5].status == 0) {
        console.log('Turning AMP on');
        cec.send('on 5');
        devices[5].status = 1;
    } else {
        console.log('Turning AMP off');
        cec.send('standby 5');
        devices[5].status = 0;
    }

    callback(null);
}

AmpAccessory.prototype.getInformationService = function() {
    var informationService = new Service.AccessoryInformation();
    informationService
        .setCharacteristic(Characteristic.Name, 'HDMI AMP')
        .setCharacteristic(Characteristic.Manufacturer, 'Unknown')
        .setCharacteristic(Characteristic.Model, '1.0.0')
        .setCharacteristic(Characteristic.SerialNumber, '123456789');
    return informationService;
};

AmpAccessory.prototype.getServices = function() {
    return [this.service, this.getInformationService()];
};

function CECInit() {
    cec.start();

    cec.on('ready', function(data) {
        console.log("HDMI ready...");
        cec.send('scan');
    });

    cec.on('status', function(data) {
        devices[data.id].status = (data.to == '\'on\'' ? 1 : 0);
        console.log("Device [" + devices[data.id].name + "] changed from " + data.from + " to " + data.to);
    });

    cec.on('key', function(data) {
        console.log(data.name);
    });

    cec.on('close', function(code) {
        process.exit(0);
    });

}