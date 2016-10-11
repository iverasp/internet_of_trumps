/*
    SensorTag IR Temperature sensor example
    This example uses Sandeep Mistry's sensortag library for node.js to
    read data from a TI sensorTag.
    The sensortag library functions are all asynchronous and there is a
    sequence that must be followed to connect and enable sensors.
      Step 1: Connect
        1) discover the tag
        2) connect to and set up the tag
      Step 2: Activate sensors
        3) turn on the sensor you want to use (in this case, IR temp)
        4) turn on notifications for the sensor
      Step 3: Register listeners
        5) listen for changes from the sensortag
      Step 4 (optional): Configure sensor update interval
*/
var SensorTag = require('sensortag');
var PythonShell = require('python-shell');
//var http = require('http');
//var Router = require('router');

var log = function(text) {
  if(text) {
    console.log(text);
  }
}

//==============================================================================
// Step 1: Connect to sensortag device.
//------------------------------------------------------------------------------
// It's address is printed on the inside of the red sleeve
// (replace the one below).
var ADDRESS = "b0:b4:48:bd:ce:04";
var connected = new Promise((resolve, reject) => SensorTag.discoverByAddress(ADDRESS, (tag) => resolve(tag)))
  .then((tag) => new Promise((resolve, reject) => tag.connectAndSetup(() => resolve(tag))));

//==============================================================================
// Step 2: Enable the sensors you need.
//------------------------------------------------------------------------------
// For a list of available sensors, and other functions,
// see https://github.com/sandeepmistry/node-sensortag.
// For each sensor enable it and activate notifications.
// Remember that the tag object must be returned to be able to call then on the
// sensor and register listeners.
var sensor = connected.then(function(tag) {
  log("connected");

  tag.enableIrTemperature(log);
  tag.notifyIrTemperature(log);

  tag.enableHumidity(log);
  tag.notifyHumidity(log);

  tag.enableGyroscope(log);
  tag.notifyGyroscope(log);
  return tag;
});

//==============================================================================
// Step 3: Register listeners on the sensor.
//------------------------------------------------------------------------------
// You can register multiple listeners per sensor.
//

// A simple example of an act on the humidity sensor.
var prev = 0;
sensor.then(function(tag) {
  tag.on("humidityChange", function(temp, humidity){
    if(prev < 35 && humidity > 35) {
      log("Don't slobber all over the SensorTag please...");
    }
    prev = humidity;
  });
});

//var lights = function(enabled) {
//  var command = enabled ? "on" : "off";
//  log("turning lights " + command);
//var request = require('request');
//var router = Router();
//
//var cookieString = null;
//
//var authFormData = {
//  uri: 'http://10.0.1.13:8083/ZAutomation/api/v1/login',
//  method: 'POST',
//  json: {
//    "form": true,
//    "login": "admin",
//    "password": "WelcometoCX01",
//    "keepme": false,
//    "default_ui": 1
//  }
//};
//
///* GET home page. */
//router.get('/', function(req, res, next) {
//  log("in the get");
//  var zWaveCommandPath = 'http://10.0.1.13:8083/ZAutomation/api/v1/devices/ZWayVDev_zway_5-0-37/command/' + command;
//
//  if(cookieString == null){
//    request(authFormData, function(error, response, body) {
//      cookieString = response.headers["set-cookie"][0];
//    });
//  }
//
//  var zWaveCommand = {
//    url: zWaveCommandPath,
//    headers: {
//      'Cookie': cookieString
//    }
//  };
//	log("starting req");
//  request(zWaveCommand, function(error, response, body) {
//	log("requesting...");
//	log(error);
//	log(response);
//	log(body);
//      res.send(error);
//  });
//});
//}
//
//lights(true);

// A simple example of an act on the irTemperature sensor.
var flag = 0
sensor.then(function(tag) {
  tag.on("irTemperatureChange", function(objectTemp, ambientTemp) {
    if(objectTemp > 25 && flag == 0) {
      lights(true);
      //flag = 1
      log("You're so hot");
      PythonShell.run('main.py', function (err, result) {
        if (err) log("lol");
	flag = 0;
	//lights(false);
      });
    }
  })
});

//==============================================================================
// Step 4 (optional): Configure periods for sensor reads.
//------------------------------------------------------------------------------
// The registered listeners will be invoked with the specified interval.
sensor.then(function(tag) {
  tag.setIrTemperaturePeriod(3000, log);
});
