var fivebeans = require('fivebeans');

var host = 'challenge.aftership.net';
var port = 11300;
var tube = 'marekyggdrasil';

var job =
{
	type: 'getrates',
	payload:
	{
		from: 'USD',
		to: 'HKD'
	}
};

var emitter = new fivebeans.client(host, port);

emitter.on('connect', function()
{
	emitter.use(tube, function(err, tname)
	{
		console.log("- Using tube: " + tname);
		emitter.put(0, 0, 60, JSON.stringify([tube, job]), function(err, jobid)
		{
			console.log('- Seeded, id: '+jobid);
			emitter.end();
			process.exit(0);
		});
	});
});

emitter.connect();
