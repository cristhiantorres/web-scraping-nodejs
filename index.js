const rp = require('request-promise');

const $ = require('cheerio');
const potusParse = require('./potusParse');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const url = 'https://www.tuquinielateete.com/Resultados';
const detailUrl = 'https://www.tuquinielateete.com';

rp(url)
.then(function (html) {
  let data = $('a', 'table', html);
  let links = [];

  // Message
  console.log('starting web scraping...');

  data.map((index, element) => {
    let href = element.attribs.href; 
    if (href) {
      links.push(href);
    }
  });

  console.log('link count', links.length);
  return Promise.all(
    
    links.map((link) => {
      let tmp
      setInterval(() => {
        console.log('potus...');
        tmp = potusParse(detailUrl + link);
      }, 5000);

      return tmp;
    })
  )
})
.then((items) => {
  
  let fileName = items[0];
  console.log(fileName);
  // createCsv(items, fileName)

  // Message
  console.log('end web scraping...');
})
.catch(function (error) {
  console.error("Error Index", error);
});


const createCsv = (data, fileName) => {
  const csvWriter = createCsvWriter({
    path: `assets/${fileName}.csv`,
    header: [
      { id: 'posicion', title: 'posicion' },
      { id: 'fecha', title: 'fecha' },
      { id: 'horario', title: 'horario' },
      { id: 'numero', title: 'numero' },
    ]
  });

  csvWriter
    .writeRecords(data)
    .then(() => console.log('CSV created'));

}