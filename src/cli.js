#!/usr/bin/env node
const prog = require('caporal');
const pkg = require('../package.json');

prog
	.version(pkg.version)

	// harpagon new
	.command('new', 'Create new record')
	.action(require('./actions/new.js'))

	// harpagon edit
	.command('edit', 'Edit record')
	.action(require('./actions/edit.js'))

	// harpagon export <template>
	.command('export', 'Export record to PDF')
	.argument('<template>', 'Template name', ['quote', 'invoice'])
	.action(require('./actions/export.js'))

	// test
	// TODO: remove
	.command('test', 'Dev test')
	.action(function (args, options, logger) {
		console.log(process.cwd());
		const utils = require('./utils.js');
		utils.findConfigDir().then(console.log)
		
	})
;

prog.parse(process.argv);