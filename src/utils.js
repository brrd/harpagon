const fs = require('fs');
const ncp = require('ncp');
const path = require('path');
const util = require('util');
const ncpP = util.promisify(ncp);

const appPath = path.join(require.main.filename, '../../');
const homedir = require('os').homedir();
const configDirPath = path.join(homedir, '.harpagon');

function getPath() {
  return {
    app: appPath,
    configDir: configDirPath,
    record: path.join(configDirPath, 'record.yml')
  };
}

async function initConfigDir({ force } = {}) {
  if (!fs.existsSync(configDirPath) || force === true) {
    const defaultDirPath = path.join(appPath, 'default');
    return await ncpP(defaultDirPath, configDirPath);
  }
  return Promise.resolve();
}

module.exports = {
  getPath,
  initConfigDir
};
