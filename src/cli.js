#!/usr/bin/env node
const prog = require('caporal');
const utils = require('./utils.js');
const pkg = require('../package.json');

prog
	.version(pkg.version)

	// harpagon new [filename]
	.command('new', 'Create new record')
	.argument('[filename]', 'Record filename (default: record.yml)')
	.action(require('./actions/new.js'))

	// harpagon export <template> <sourceFile>
	.command('export', 'Export record to PDF')
	.argument('<template>', 'Template name', ['quote', 'invoice', 'delivery'])
	.argument('<sourceFile>', 'Source filepath')
	.option('--format <format>', 'Output format (default: pdf)', ['html', 'pdf'])
	.action(require('./actions/export.js'))

	// harpagon reset
	.command('reset', 'Delete current user config and reset to default')
	.action(require('./actions/reset.js'))
;

utils.initConfigDir()
	.then(() => prog.parse(process.argv))
	.catch(console.error);