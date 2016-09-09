/*
* Template engine for Handlebars
* Based on Handlebars.js - http://github.com/wycats/handlebars.js
*/

var BaseEngine = require("punch").TemplateEngines.Base;
var Handlebars = require("handlebars");

var _ = require("underscore");
var util = require('util');

function HandlebarsEngine(options){
	BaseEngine.call(this, options);

	this.extension = HandlebarsEngine.extension;
	this.renderFunction = HandlebarsEngine.renderFunction;
};

util.inherits(HandlebarsEngine, BaseEngine);

HandlebarsEngine.extension = ".handlebars";

HandlebarsEngine.renderFunction = function(template, content, partials, helpers) {
    _.each(helpers.tag, function(helper_function, name) {
        Handlebars.registerHelper(name, helper_function);
    });

    // register helpers
    _.each(helpers.block, function(helper_function, name) {
        Handlebars.registerHelper(name, function() {
            try {
                return helper_function.apply(this, Array.prototype.slice.call(arguments, 0));
            } catch (e) {
                var last_arg = arguments[arguments.length -1];
                // check if the last argument is a options hash containing the propery fn.
                if (last_arg.fn) {
                    return helper_function(last_arg.fn(this));
                } else {
                    // if not just call the helper with the first argument
                    return helper_function(arguments[0]);
                }
            }
        });
    });

    // register partials
    _.each(partials, function(partial, name) {
        Handlebars.registerPartial(name, partial);
    });

    var compiled_template = Handlebars.compile(template);
    return compiled_template(content);
};

module.exports = HandlebarsEngine;
