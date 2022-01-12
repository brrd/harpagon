const utils = require('../utils.js');

module.exports = function (args, options, logger) {
  utils.initConfigDir({ force: true })
    .then(() => console.log('User config was reset.'))
    .catch(console.error);
};
