var apixe = require('../apixe');
var connections = require('../database.js');
var serverCache = connections('localhost', 27017);

module.exports = function() {
	function GetRatesHandler() {
		this.type = 'getrates';
	}
	GetRatesHandler.prototype.work = function(payload, callback) {
		// callback function if success
		var succeed = function(from,to,rt,callback_thread) {
			console.log('- from: '+from+', to: '+to+ ', '+rt);
			var input = {'from': from, 'to': to, 'created_at': new Date(), 'rate': rt};
			serverCache('test', 'aftership', function(e, collection){
				collection.insert(input, function(){});
			});
			// make another reading in 60s
			callback_thread('release', 60);
		}
		// callback function if failed
		var failed = function(callback_thread) {
			var input = {'created_at': new Date()};
			serverCache('test', 'failures', function(e, collection){
				collection.insert(input, function(){})
			});
			// try again in 3s
			callback_thread('release', 3);
		}
		// processing starts here
		serverCache('test', 'failures', function(e, failures){
			// see if there are less than 3 failures records in the database
			failures.count(function(err, failures_count) {
				if(failures_count < 3) {
					// count records
					serverCache('test', 'aftership', function(e, aftership){
						aftership.count(function(err, aftership_count) {
						if(aftership_count < 10) {
							apixe.requestExchangeRate(payload.from,payload.to,succeed,failed,callback);
						}
						else {
							callback('success');
						}
					})});
				}
				else {
					// reset failures
					failures.remove();
					// cancell this attempt
					callback('success');
				}
			});
		});
	}
	var handler = new GetRatesHandler();
	return handler;
};
