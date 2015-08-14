module.exports.requestExchangeRate = function(from,to,callback_processing,callback_failed,callback_thread) {
	var select = require('soupselect').select,
	    htmlparser = require("htmlparser"),
	    http = require('http');
	var request = http.request({
		port: 80,
		host: 'www.xe.com',
		method: 'GET',
		path: '/currencyconverter/convert/?From='+to+'&To='+from // reversed on purpose!
	});
	request.on('response', function (response) {
		response.setEncoding('utf8');
		var body = "";
		response.on('data', function (chunk) {
			body = body + chunk;
		});
		response.on('end', function() {
		// now we have the whole body, parse it and select the nodes we want...
			var handler = new htmlparser.DefaultHandler(function(err, dom) {
				if (err) {
					// put it back to queue with 3 seconds delay
					callback_failed(callback_thread);
				} else {
					// select right table row
					var titles = select(dom, 'tr.uccResUnit td');
					try {
						// first column is currency name, second is exchange rate
						var str = titles[1].children[0].raw;
						// remove semicolons
						str = str.replace(/;/g,"");
						// split
						var res = str.split("&nbsp");
						// round to 2 decimal points
						var flt = parseFloat(res[res.length - 2]);
						var flt = flt.toFixed(2);
						// before last is what we are looking for
						callback_processing(from,to,flt.toString(),callback_thread);
					}
					catch(e) {
						// if xe.com changed their CGI we end up here
						callback_failed(callback_thread);
					}
				}
			});
			var parser = new htmlparser.Parser(handler);
			parser.parseComplete(body);
		});
	});
	request.end();
}
