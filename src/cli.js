#!/usr/bin/env node
const prog = require('caporal');
const utils = require('./utils.js');
const pkg = require('../package.json');

prog
	.version(pkg.version)

	// harpagon new
	.command('new', 'Create new record')
	.action(require('./actions/new.js'))

	// harpagon export <template> <sourceFile>
	.command('export', 'Export record to PDF')
	.argument('<template>', 'Template name', ['quote', 'invoice'])
	// TODO: validate file existence here
	.argument('<sourceFile>', 'Source filepath')
	.action(require('./actions/export.js'))

	// harpagon reset
	.command('reset', 'Delete current user config and reset to default')
	.action(function (args, options, logger) {
		utils.initConfigDir({ force: true })
			.then(() => console.log('User config was reset.'))
			.catch(console.error);
	})

	// test
	// TODO: remove
	.command('test', 'Dev test')
	.action(function (args, options, logger) {
				
	})
;

utils.initConfigDir()
	.then(() => {
		prog.parse(process.argv);
	})
	.catch(console.error);