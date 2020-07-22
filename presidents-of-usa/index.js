const rp = require('request-promise');

const $ = require('cheerio');
const potusParse = require('./potusParse');

const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States';
const wikiUrl = 'https://en.wikipedia.org';

rp(url)
.then(function (html) {
  let data = $('b > a', '.wikitable', html);
  let wikiLinks = [];
  
  // Message
  console.log('starting web scraping...');

  data.each(function(index, element){
    let href = element.attribs.href; 

    if (href) {
      wikiLinks.push(href);
    }
  });

  return Promise.all(
    wikiLinks.map((link) => {
      return potusParse(wikiUrl + link);
    })
  )
})
.then((presidents) => {
  
  console.log(presidents);
  
  // Message
  console.log('end web scraping...');
})
.catch(function (error) {
  console.error(error);
});

