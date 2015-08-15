var fivebeans = require('fivebeans').worker;
var config = require('./config');

var options = {
	id: config.worker.id,
	host: config.beanstalkd.host,
	port: config.beanstalkd.port,
	handlers:
	{
		getrates: require('./handlers/getrates')()
	},
	ignoreDefault: true
}

var worker = new fivebeans(options);
var tube_list = config.beanstalkd.tube;

// Beanstalkd worker events
worker.on('started', function() {
	console.log('- worker '+options.id+': started');
});
worker.on('stopped', function() {
	console.log('- worker '+options.id+': stopped');
});
worker.on('error', function(err) {
	console.log('- worker '+options.id+': error');
});
worker.on('close', function() {
	console.log('- worker '+options.id+': close');
});

worker.start(tube_list);
