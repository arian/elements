/*
elements events
*/"use strict";

var $ = require("./elements")

var slice = Array.prototype.slice

var EID = 0

var html = document.documentElement

var addEventListener = html.addEventListener ? function(node, event, handle){
    node.addEventListener(event, handle, false)
    return handle
} : function(node, event, handle){
    node.attachEvent('on' + event, handle)
    return handle
}

var removeEventListener = html.removeEventListener ? function(node, event, handle){
    node.removeEventListener(event, handle, false)
} : function(node, event, handle){
    node.detachEvent("on" + event, handle)
}

function on(node, event, fn){
    var key = '_listeners_' + event,
        listeners = node[key] || (node[key] = {}),
        exists = false

    for (var k in listeners) if (listeners[k] === fn){
        exists = true
        break
    }

    if (!exists) listeners[(EID++).toString(36)] = fn
}

function off(node, event, fn){
    var key = '_listeners_' + event, listeners = node[key]
    if (!listeners) return

    var k, x, empty = true
    for (k in listeners) if (listeners[k] === fn){
        delete listeners[k]
        for (x in listeners){
            empty = false
            break
        }
        if (empty) delete node[key]
        break
    }
}

$.implement({

    on: function(event, handle){
        var key = '_domListener_' + event
        this.handle(function(node){
            on(this, event, handle)
            var self = this
            // the _domListener_event doesn't exist yet
            if (!this[key]) this[key] = addEventListener(node, event, function(e){
                self.emit(event, (e || window.event))
            })
        })

        return this
    },

    off: function(event, handle){
        var key = '_domListeners_' + event
        this.handle(function(node){
            off(this, event, handle)
            if (!this[key]){
                // all listeners were removed, remove _domListener_event
                removeEventListener(node, event, this[key])
                ;delete this[key]
            }
        })

        return this
    },

    emit: function(event){
        var args = slice.call(arguments, 1)
        this.handle(function(node){
            var key = '_listeners_' + event, listeners = this[key]
            if (listeners ) for (var k in listeners) listeners[k].apply(this, args)
        })
        return this
    }

})

module.exports = $
