const yaml = require('js-yaml');
const fs = require('fs');
const nunjucks = require('nunjucks');
const puppeteer = require('puppeteer');

const promisify = require('util').promisify;
const readFile = promisify(fs.readFile);

const dataPath = './demo/record.yml';
const destPath = './demo/out/test.pdf';

async function writePDF(contents, destPath) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setContent(contents);
	await page.pdf({ path: destPath, format: 'A4' });
	await browser.close();
}

async function doExport(template) {
	try {
		// YAML => JSON
		const yamlData = await readFile(dataPath, 'utf8');
		const data = yaml.safeLoad(yamlData);

		// Load config
		const yamlConfig = await readFile('config.yml', 'utf8');
		const config = yaml.safeLoad(yamlConfig);
		data._config = config;

		// JSON => HTML
		const html = nunjucks.render(
			'templates/invoice.njk',
			data
		);

		// HTML => PDF
		// https://gutier.io/posts/programming-tutorial-nodejs-generate-pdf/
		await writePDF(html, destPath);
		console.log("Export done");
		
	} catch (e) {
		console.error(e);
	}
}

module.exports = function({ template }, options, logger) {
	doExport(template);
};