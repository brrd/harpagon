const path = require('path');
const findUp = require('find-up');

async function findConfigDir() {
	return await findUp('.harpagon', { type: 'directory' })
}

module.exports = {
	findConfigDir
};