var handlebars_renderer = require("../lib/handlebars_engine.js");
var Handlebars = require("handlebars");

describe("creating a new instance", function(){

	it("set the extension as handlebars", function(){
    var handlebars_instance = new handlebars_renderer();
		expect(handlebars_instance.extension).toEqual(".handlebars");
	});

});

describe("calling render", function(){

	it("call Handlebar's compile function with the template", function(){
    spyOn(Handlebars, "registerHelper");
    spyOn(Handlebars, "registerPartial");
    spyOn(Handlebars, "compile");

    var handlebars_instance = new handlebars_renderer();
		handlebars_instance.template = "template";
		handlebars_instance.content = {};
		handlebars_instance.partials = {};
		handlebars_instance.helpers = {};
		handlebars_instance.lastModified = new Date(2012, 6, 18);
		spyOn(handlebars_instance, "emit");

		handlebars_instance.render();
		expect(Handlebars.compile).toHaveBeenCalledWith("template");
	});

	it("register each tag and block helper", function(){
    spyOn(Handlebars, "registerHelper");
    spyOn(Handlebars, "registerPartial");
    spyOn(Handlebars, "compile");

    var handlebars_instance = new handlebars_renderer();
		handlebars_instance.template = "template";
		handlebars_instance.content = {};
		handlebars_instance.partials = {};
		handlebars_instance.helpers = { "block": { "sample_helper1": function(){}, "sample_helper2": function(){} }, "tag": { "sample_helper3": function(){} } };
		handlebars_instance.lastModified = new Date(2012, 6, 18);
		spyOn(handlebars_instance, "emit");

		handlebars_instance.render();
		expect(Handlebars.registerHelper.callCount).toEqual(3);
	});

	it("register each partial", function(){
    spyOn(Handlebars, "registerHelper");
    spyOn(Handlebars, "registerPartial");
    spyOn(Handlebars, "compile");

    var handlebars_instance = new handlebars_renderer();
		handlebars_instance.template = "template";
		handlebars_instance.content = {};
		handlebars_instance.partials = { "partial1": "partial1", "partial2": "partial2", "partial3": "partial3" };
		handlebars_instance.helpers = {};
		handlebars_instance.lastModified = new Date(2012, 6, 18);
		spyOn(handlebars_instance, "emit");

		handlebars_instance.render();
		expect(Handlebars.registerPartial.callCount).toEqual(3);
	});

	it("re-attempt a helper function after rendering for the context, if it throws an error", function() {
		var helperFunction = null;

		spyOn(Handlebars, "registerHelper").andCallFake( function(name, helper_function) {
			helperFunction = helper_function;
		});

		var dummy_helper = function() {
			if (arguments.length > 1 || typeof arguments[0] !== "string") {
				throw "Error"
			}	else {
				return arguments[0];
			}
		};

		var render_output = handlebars_renderer.renderFunction("", {}, {}, { "tag": {}, "block": { "dummy_helper": dummy_helper }})

		expect(helperFunction.call("helper text", { "fn": function(text) { return String(text); } })).toEqual("helper text");
	});

});
