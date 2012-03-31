var fs = require('fs')
var url = require('url')
var qs = require('querystring')
var wrapup = require("wrapup")

var app = require('http').createServer(function(req, res){

	var parsedURL = url.parse(req.url)
	var pathname = parsedURL.pathname

	if (pathname == '/') pathname = '/index.html'
	// serve static index.html and test.html
	if ({
		'/index.html': 1,
		'/test.html': 1,
		'/mocha.css': 1,
		'/mocha.js': 1
	}[pathname]){

		var file = __dirname + pathname
		if (/^\/mocha/.test(pathname)){
			file = __dirname + '/../node_modules/mocha/'	+ pathname
		}

		fs.readFile(file, function (err, data){
			if (err){
				res.writeHead(500)
				res.end('Error loading ' + pathname)
			} else {
				var contentType = 'text/html'
				if (/\.css$/.test(pathname)) contentType = 'text/css'
				if (/\.js$/.test(pathname)) contentType = 'text/javascript'
				res.writeHead(200, {
					'Content-Type': contentType
				})
				res.end(data)
			}
		});

	} else if (pathname == '/test.js' && parsedURL.search){

		var query = qs.parse(parsedURL.search.slice(1))
		var test = query.test
		var wrup = wrapup();

		var js = wrup.require('test', query.test)
		if (js){
			res.writeHead(200, {
				'Content-Type': 'text/javascript'
			})
			res.end(js.up())
		} else {
			res.writeHead(500)
			wrup.log("ERROR".red.inverse + ": ")
		}

	} else {
		res.writeHead(500)
		res.end('Unkown file requested')
	}

});

app.listen(8080);

