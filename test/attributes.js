
var expect = require('expect.js')
var $ = require('../lib/attributes')

describe('attributes', function(){

	it('should get the ID of an element', function(){
		var div = document.createElement('div')
		div.id = 'test'
		expect($(div).id()).to.equal('test')
	})

	it('should get the attrubte of a form when the form has an input with as ID the attribute name', function(){
		var div = document.createElement('div')
		div.innerHTML = '<form action="s"><input id="action"></form>'
		expect($(div.firstChild).getAttribute('action')).to.equal('s')
	})

})

