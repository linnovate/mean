REPORTER = spec
NODEARGS = 
test:
	@if [ ! -n "$(NODE_ENV)" ]; then NODE_ENV=test NODE_PATH=lib ./node_modules/grunt-nodemon/node_modules/.bin/nodemon -x ./node_modules/.bin/mocha -R $(REPORTER) -t 15000 --recursive test $(NODEARGS); else NODE_PATH=lib ./node_modules/.bin/mocha -R $(REPORTER) -t 15000 --recursive test $(NODEARGS); fi

start:
	@if [ ! -n "$(NODE_ENV)" ]; then NODE_ENV=development NODE_PATH=lib ./node_modules/grunt-nodemon/node_modules/.bin/nodemon server.js $(NODEARGS) ; else NODE_PATH=lib ./node_modules/.bin/foreman start; fi

mocha:
	 NODE_PATH=lib ./node_modules/.bin/mocha -R $(REPORTER) -t 15000 --recursive test $(NODEARGS)

repl:
	@NODE_ENV=development NODE_PATH=lib node --debug $(NODEARGS)

webtest:
	@NODE_ENV=test NODE_PATH=lib ./node_modules/.bin/web-mocha test	$(NODEARGS)

.PHONY: jshint test repl webtest mocha
