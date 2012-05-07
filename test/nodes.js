"use strict";

var nodes = require('../lib/nodes')
var expect = require('expect.js')

describe('Nodes', function(){

	it('should create a wrapped node', function(){

		var $ = nodes()

		var attrib = nodes()
		attrib.implement({

			setAttribute: function(key, value){
				this.handle(function(node){
					node.setAttribute(key, value)
				})
			}

		})

		var search = nodes({

			search: function(selector, context){
				search.search(selector, context, this)
			}

		})

		search.search = function(selector, context, append){
			var el = document.getElementById(selector.slice(1))
			append[append.length++] = el
		}

		var traversal = nodes({

			getChildren: function(){
				var nodes = []
				this.handle(function(el){
					var node = el.firstChild
					while (node){
						if (node.nodeType == 1) nodes.push(node)
						node = node.nextSibling
					}
				})
				return this.$(nodes)
			}

		})

		$.use(attrib).use(search).use(traversal)

		var e1 = $('#e1')
		expect(e1.length).to.be(1)

		var children = e1.getChildren()
		expect(children.length).to.be(2)
		console.log(children)

	})

});

