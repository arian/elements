
var fs = require('fs')
var url = require('url')
var qs = require('querystring')
var wrapup = require("wrapup")

var app = require('http').createServer(function(req, res){

	var parsedURL = url.parse(req.url)
	var pathname = parsedURL.pathname

	if (pathname == '/') pathname = '/index.html'
	// serve static index.html and test.html
	var path = {
		'/index.html': __dirname,
		'/test.html': __dirname,
		'/mocha.css':__dirname + '/../node_modules/mocha/',
		'/mocha.js': __dirname + '/../node_modules/mocha/',
		'/expect.js': __dirname + '/../node_modules/expect.js/'
	}[pathname]

	if (path){

		fs.readFile(path + pathname, function (err, data){
			if (err){
				res.writeHead(500)
				res.end('Error loading ' + pathname)
			} else {

				var contentType = {
					'css': 'text/css',
					'js': 'text/javascript'
				}[pathname.split('.').pop()] || 'text/html'

				res.writeHead(200, {
					'Content-Type': contentType
				})
				res.end(data)
			}
		})

	} else if (pathname == '/test.js' && parsedURL.search){

		var query = qs.parse(parsedURL.search.slice(1))
		var wrup = wrapup()

		var js = wrup.require('test', query.test)
		if (js){
			res.writeHead(200, {
				'Content-Type': 'text/javascript'
			})
			res.end(js.up())
		} else {
			res.writeHead(500)
			wrup.log("ERROR: ")
		}

	} else {
		res.writeHead(500)
		res.end('Unkown file requested')
	}

})

app.listen(8080)
console.log('running the tests on http://localhost:8080')
