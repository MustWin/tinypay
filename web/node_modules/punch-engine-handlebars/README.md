# Handlebars Template Engine for Punch 

Use this plugin to replace Punch's default Mustache template engine with [Handlebars](http://handlebarsjs.com). 

### How to Setup

* Install the package
	
		npm install punch-engine-handlebars

* Open your Punch project's configurations (`config.json`) and add the following:

		"plugins": {
			
			"template_engine": "punch-engine-handlebars" 

		}

* Now you can use Handlebars syntax for your project's templates. 

	Make sure you **save the templates with `.handlebars` extension**.


