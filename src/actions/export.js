const yaml = require('js-yaml');
const fs = require('fs');
const nunjucks = require('nunjucks');
const puppeteer = require('puppeteer');
const path = require('path');
const promisify = require('util').promisify;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const utils = require('../utils.js');

// https://stackoverflow.com/questions/17699599/node-js-check-if-file-exists/35008327#35008327
const checkFileExists = s => new Promise(r => fs.access(s, fs.F_OK, e => r(!e)))

// https://gutier.io/posts/programming-tutorial-nodejs-generate-pdf/
async function writePDF(destPath, contents) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setContent(contents);
	await page.pdf({ path: destPath, format: 'A4' });
	await browser.close();
}

async function doExport({ template, sourceFile }, options) {
	// Get config dir
	const configDir = utils.getPath().configDir;
	if (!configDir) {
		throw Error('Harpagon project not found.');
	}

	// Read config
	const configPath = path.join(configDir, 'config.yml');
	const yamlConfig = await readFile(configPath, 'utf8');
	const config = yaml.safeLoad(yamlConfig);

	// Find template
	// Use .harpagon/templates/ in priority, otherwise use default templates/ dir
	const userTemplatePath = path.join(configDir, 'templates', template + '.njk');
	
	const userTemplateExists = await checkFileExists(userTemplatePath)
	const templateDir = userTemplateExists ? 
		path.resolve(userTemplatePath, '..') :
		path.join(require.main.filename, '../../templates');

	// Set nunjucks temlates path
	nunjucks.configure(templateDir);
	
	// Create data object
	const yamlData = await readFile(sourceFile, 'utf8');
	const data = yaml.safeLoad(yamlData);
	data._config = config;

	// JSON => HTML
	const html = nunjucks.render(template + '.njk', data);

	if (options.format && options.format.toLowerCase() === 'html') {
		// Export HTML
		const destPath = path.join(path.dirname(sourceFile), path.basename(sourceFile, path.extname(sourceFile)) + '-' + template + '.html');
		await writeFile(destPath, html, 'utf8');
		return;
	} 

	// HTML => PDF
	const destPath = path.join(path.dirname(sourceFile), path.basename(sourceFile, path.extname(sourceFile)) + '-' + template + '.pdf');
	await writePDF(destPath, html);
}

module.exports = function(args, options, logger) {
	doExport(args, options)
		.then(() => console.log('Document was successfully exported.'))
		.catch(console.error);
};