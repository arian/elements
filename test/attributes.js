
var expect = require('expect.js')
var $ = require('../lib/attributes')

describe('attributes', function(){

	it('should get the ID of an element', function(){
		var div = document.createElement('div')
		div.id = 'test'
		expect($(div).id()).to.equal('test')
	})

})

