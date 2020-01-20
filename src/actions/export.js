const yaml = require('js-yaml');
const fs = require('fs');
const nunjucks = require('nunjucks');
const puppeteer = require('puppeteer');
const path = require('path');
const promisify = require('util').promisify;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const utils = require('../utils.js');

// https://stackoverflow.com/a/35008327
const checkFileExists = s => new Promise(r => fs.access(s, fs.F_OK, e => r(!e)))

// https://stackoverflow.com/a/16637170
function num2Fr(num) {
	var parts = num.toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	return parts.join(",");
}

// https://gutier.io/posts/programming-tutorial-nodejs-generate-pdf/
async function writePDF(destPath, contents) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setContent(contents);
	await page.pdf({ 
		path: destPath, 
		format: 'A4',
		margin: { 
			top: 30, 
			right: 40,
			bottom: 50,
			left: 40
		},
		displayHeaderFooter: true,
		headerTemplate: '<div></div>',
		footerTemplate: `
			<div class='footer' style='text-align:center; font-size: 8px; color: #777; display: block; width: 100%;'>
				Page <span class='pageNumber'></span> / <span class='totalPages'></span>
			</div>
		`
	});
	await browser.close();
}

async function doExport({ template, sourceFile }, options) {
	// Read config
	const configDir = utils.getPath().configDir;
	const configPath = path.join(configDir, 'config.yml');
	const yamlConfig = await readFile(configPath, 'utf8');
	const config = yaml.safeLoad(yamlConfig);

	// Use user templates in priority, otherwise use default/templates/
	const userTemplatePath = path.join(configDir, 'templates', template + '.njk');
	
	const userTemplateExists = await checkFileExists(userTemplatePath)
	const templateDir = userTemplateExists ? 
		path.resolve(userTemplatePath, '..') :
		path.join(utils.getPath().app, 'default/templates');

	// Set nunjucks temlates path
	nunjucks.configure(templateDir, { throwOnUndefined: true });
	
	// Create data object
	const yamlData = await readFile(sourceFile, 'utf8');
	const data = yaml.safeLoad(yamlData);
	data._config = config;

	// Compute prices and total
	// NOTE: French numbers used : 1 234,56
	let total = 0
	data.items.forEach((item) => {
		const unitPriceInt = Number(String(item.unitPrice).replace(' ', '').replace(',', '.'));
		const itemTotal = unitPriceInt * item.quantity;
		if (unitPriceInt === NaN) throw Error('unitPrice is NaN');		
		if (itemTotal === NaN) throw Error('itemTotal is NaN');
		total += itemTotal;
		item.unitPrice = num2Fr(unitPriceInt);
		item.total = num2Fr(itemTotal)
	});
	data.total = num2Fr(total);

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