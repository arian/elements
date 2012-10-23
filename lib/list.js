/*
elements events
*/"use strict";

var $ = require("./elements")

module.exports = $.implement({

    forEach: function(fn, context){
        for (var i = 0, l = this.length; i < l; i++) fn.call(context, this[i], i, this)
    },

    map: function(fn, context){
        var i = 0, l = this.length, result = new Array(l)
        for (; i < l; i++) result[i] = fn.call(context, this[i], i, this)
        return result
    },

    filter: function(fn, context){
        var i = 0, l = this.length, result = []
        for (; i < l; i++) if (fn.call(context, this[i], i, this)) result.push(this[i])
        return result
    },

    every: function(fn, context){
        for (var i = 0, l = this.length; i < l; i++){
            if (!fn.call(context, this[i], i, this)) return false
        }
        return true
    },

    some: function(fn, context){
        for (var i = 0, l = this.length; i < l; i++){
            if (fn.call(context, this[i], i, this)) return true
        }
        return false
    }

})
