/*
Zen
*/"use strict";

var parse = require("slick/lib/parser"),
    $ = require("./elements")

var map = function(array, fn){
    var i = 0, l = array.length, result = new Array(l)
    for (; i < l; i++) result[i] = fn(array[i], i)
    return result
}

module.exports = function(expression, doc){

    return $(map(parse(expression), function(expression){

        var previous, result

        for (var i = 0, l = expression.length; i < l; i++){
            var part = expression[i],
                node = (doc || document).createElement(part.tag)

            if (part.id) node.id = part.id

            if (part.classList) node.className = part.classList.join(" ")

            var attributes = part.attributes
            if (attributes) for (var j = 0; j < attributes.length; j++){
                var attribute = attributes[j]
                node.setAttribute(attribute.name, attribute.value)
            }

            var pseudos = part.pseudos
            if (pseudos) for (var k = 0; k < pseudos.length; k++){
                var pseudo = pseudos[k], n = $(node), method = n[pseudo.name]
                if (method) method.call(n, pseudo.value)
            }

            if (i === 0){

                result = node

            } else if (part.combinator === " "){

                previous.appendChild(node)

            } else if (part.combinator === "+"){
                var parentNode = previous.parentNode
                if (parentNode) parentNode.appendChild(node)
            }

            previous = node

        }

        return result

    }))

}
