var fivebeans = require('fivebeans');

var host = 'challenge.aftership.net';
var port = 11300;
var tube = 'marekyggdrasil';

var client = new fivebeans.client(host, port);

client.on('connect', function()
{
	client.use(tube, function(err, tname)
	{
		console.log("- Using tube: " + tname);
		client.peek_delayed(function(err, jobid, payload) {
			if(err != 'NOT_FOUND') {
				console.log('- next job: '+jobid+ ',removing...');
				client.destroy(jobid, function(err) {});
			}
			else {
				console.log('- no delayed jobs');
			}
			client.end();
			process.exit(0);
		});
	});
});

client.connect();
