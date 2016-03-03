// Accessory for HDMI CEC connected devices
var Service, Characteristic;
var NodeCEC = require('nodecec');
var cec = new NodeCEC();
var deviceId;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    
    CECInit();
    homebridge.registerAccessory("homebridge-hdmi", "TV", TvAccessory);
    homebridge.registerAccessory("homebridge-hdmi", "AMP", AmpAccessory);
};


/*****************
TV Accessory
******************/

function TvAccessory(log, config) {
    
    this.service = new Service.Switch('TV');
    this.service
        .getCharacteristic(Characteristic.On)
        .on('get', this.getOn.bind(this))
        .on('set', this.setOn.bind(this));

    deviceId[0] = 0;
}


TvAccessory.prototype.getOn = function(callback) {

		var state = (deviceId[0] == 1 ? 'on' : 'off');
		callback(null, state);
}

TvAccessory.prototype.setOn = function(on, callback) {
	
	if(deviceId[0]) {
		console.log('Turning TV on');
		cec.send('on 0');
		deviceId[0] = 1;
	} else {
		console.log('Turning TV off');
		cec.send('standby 0');
		deviceId[0] = 0;
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


/*****************
Amp Accessory
******************/

function AmpAccessory(log, config) {
    
    this.service = new Service.Switch('TV');
    this.service
        .getCharacteristic(Characteristic.On)
        .on('get', this.getOn.bind(this))
        .on('set', this.setOn.bind(this));

    deviceId[4] = 0;
}


AmpAccessory.prototype.getOn = function(callback) {

		var state = (deviceId[4] == 1 ? 'on' : 'off');
		callback(null, state);
}

AmpAccessory.prototype.setOn = function(on, callback) {
	
	if(deviceId[4) {
		console.log('Turning TV on');
		cec.send('on 0');
		deviceId[4] = 1;
	} else {
		console.log('Turning TV off');
		cec.send('standby 0');
		deviceId[4] = 0;
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



/*****************
CEC client wrapper
******************/

function CECInit() {

	// start cec connection
	cec.start();

	cec.on('ready', function(data) {
	    console.log("HDMI ready...");
	});

	cec.on('status', function(data) {
	   //deviceId[data.id] = (data.to == 'on' ? 1 : 0 );
	   console.log("Device ID [" + data.id + "] changed from " + data.from + " to " + data.to); 
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