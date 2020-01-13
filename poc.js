const yaml = require("js-yaml");
const fs = require("fs");
const nunjucks = require('nunjucks');
const puppeteer = require('puppeteer');

const dataPath = "demo/record.yml";
const destPath = "demo/out/test.pdf";

async function writePDF(contents, destPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(contents);
  await page.pdf({ path: destPath, format: 'A4' });
  await browser.close();
}

try {
  // YAML => JSON
  // TODO: utiliser async readfile
  const data = yaml.safeLoad(fs.readFileSync(dataPath, "utf8"));

  // Load config
  const config = yaml.safeLoad(fs.readFileSync("config.yml", "utf8"));
  data._config = config;

  // JSON => HTML
  const html = nunjucks.render(
    'templates/invoice.njk',
    data
  );

  // HTML => PDF
  // https://gutier.io/posts/programming-tutorial-nodejs-generate-pdf/
  writePDF(html, destPath).then(() => console.log("done"));
} catch (e) {
  console.error(e);
}