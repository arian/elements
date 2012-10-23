"use strict";

var $   = require("./events")
require('./traversal')

var EID = 0

$.implement({

    delegate: function(event, selector, handle){

        var key = '_delegation_' + selector + '_' + event

        this.handle(function(node){

            var delegation = this[key] || (this[key] = {})

            var action = function(e){
                var target = $(e.target),
                    match  = target.matches(selector) ? target : target.parent(selector)
                if (match) handle.call(this, e, match)
            }

            delegation[(EID++).toString(36)] = {h: handle, a: action}

            this.on(event, action)

        })

        return this

    },

    undelegate: function(event, selector, handle){

        var key = '_delegation_' + selector + '_' + event

        this.handle(function(node){

            var delegation = this[key]
            if (!delegation) return

            for (var k in delegation) if (delegation[k].h === handle){

                this.off(event, delegation[k].a)
                ;delete delegation[k]

                var empty = true
                for (var l in delegation){
                    empty = false
                    break
                }

                if (empty) delete this[key]

                break
            }

        })

        return this
    }

})

module.exports = $
