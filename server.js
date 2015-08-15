var fivebeans = require('fivebeans').worker;

var options = {
	id: 'Terminator T-800',
	host: 'challenge.aftership.net',
	port: 11300,
	handlers:
	{
		getrates: require('./handlers/getrates')()
	},
	ignoreDefault: true
}

var worker = new fivebeans(options);
var tube_list = ['marekyggdrasil'];

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

// writes to mongoDB
function setRate(rt) {
	rate = rt;
	console.log(rt);
}

function someshit() {
	console.log('someshit');
}

worker.start(tube_list);
