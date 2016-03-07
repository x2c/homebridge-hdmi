// Accessory for HDMI CEC connected devices
var Service, Characteristic;
var NodeCEC = require('nodecec');
var cec = new NodeCEC();
// var deviceId = {
// 	'0': {'name':'TV','status':0},
// 	'1': {'name':'Unknown','status':0},
// 	'2': {'name':'Unknown','status':0},
// 	'3': {'name':'Unknown','status':0},
// 	'4': {'name':'CONSOLE','status':0},
// 	'5': {'name':'AMP','status':0},
// 	'8': {'name':'Unknown','status':0}
// 	}
// ;
var deviceId = {};



module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    
    CECInit();
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

		var state = (deviceId[0].status == 1 ? 'on' : 'off');
		callback(null, state);
}

TvAccessory.prototype.setOn = function(on, callback) {
	
	if(deviceId[0].status == 0) {
		console.log('Turning TV on');
		cec.send('on 0');
		deviceId[0].status = 1;
	} else {
		console.log('Turning TV off');
		cec.send('standby 0');
		deviceId[0].status = 0;
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

		var state = (deviceId[5].status == 1 ? 'on' : 'off');
		callback(null, state);
}

AmpAccessory.prototype.setOn = function(on, callback) {
	
	if(deviceId[5].status == 0) {
		console.log('Turning AMP on');
		cec.send('on 5');
		deviceId[5].status = 1;
	} else {
		console.log('Turning AMP off');
		cec.send('standby 5');
		deviceId[5].status = 0;
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

	// start cec connection
	cec.start();

	cec.on('ready', function(data) {
	    console.log("HDMI ready...");
	    cec.send('scan');
	});

	cec.on('status', function(data) {
	   deviceId[data.id] = { 'name':'TV','status': (data.to == '\'on\'' ? 1 : 0 ) } ;
	   console.log("Device ID [" + data.id + "] changed from " + data.from + " to " + data.to); 
	   console.log(deviceId);
	});

	cec.on('key', function(data) {
	    console.log(data.name);
	});

	cec.on('close', function(code) {
	    process.exit(0);
	});
}

// tv on
// echo "on 0" | cec-client -s

// tv off
// echo "standby 0" | cec-client -s

// get tv status
// echo 'pow 0' | cec-client -t p -p 1 -d 1 -s | tail -n1 | grep 'power' | awk '{print $3}'

// scan for all devices
// echo "scan" | cec-client -s
// echo "scan" | cec-client -s -d 1