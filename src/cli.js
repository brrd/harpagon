#!/usr/bin/env node
const prog = require('caporal');
const pkg = require('../package.json');

const templateNames = ['quote', 'invoice'];

prog
	.version(pkg.version)

	// harpagon new
	.command('new', 'Create new record')
	.action((args, options, logger) => { logger.log("action") })

	// harpagon edit
	.command('edit', 'Edit record')
	.action((args, options, logger) => { logger.log("action") })

	// harpagon export <template>
	.command('export', 'Export record to PDF')
	.argument('<template>', 'Template name', templateNames)
	.action((args, options, logger) => { logger.log("action") })
;

prog.parse(process.argv);