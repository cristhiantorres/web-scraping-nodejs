const rp = require('request-promise');
const $ = require('cheerio');

const regex = /[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/gm;

const potusParse = (url) => {
  return rp(url)
    .then((html) => {
      let name = $('#firstHeading', html).text();
      let bday = $('.bday', html).text();
      return { name: name, birthday: bday };
    })
    .catch((error) => {
      return {};
    }); 
}

module.exports = potusParse; 