const ncp = require('ncp');
const promisify = require('util').promisify;
const utils = require('../utils.js');
const ncpP = promisify(ncp);

async function createNewRecord(filename) {
	const sourcePath = utils.getPath().record;
	return ncpP(sourcePath, filename);
}

module.exports = function(args, options, logger) {
	const filename = args.filename || 'record.yml';
	createNewRecord(filename)
		.then(() => console.log(filename + ' was created.'))
		.catch(console.error);
};