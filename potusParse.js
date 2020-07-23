const rp = require('request-promise');
const $ = require('cheerio');
const months = [
  { 'key': 'enero', 'value': '01' },
  { 'key': 'febrero', 'value': '02' },
  { 'key': 'marzo', 'value': '03' },
  { 'key': 'abril', 'value': '04' },
  { 'key': 'mayo', 'value': '05' },
  { 'key': 'junio', 'value': '06' },
  { 'key': 'julio', 'value': '07' },
  { 'key': 'agosto', 'value': '08' },
  { 'key': 'septiembre', 'value': '09' },
  { 'key': 'octubre', 'value': '10' },
  { 'key': 'noviembre', 'value': '11' },
  { 'key': 'diciembre', 'value': '12' },
];

const potusParse = (url) => {
  return rp(url)
    .then((html) => {
      
      let tables = $('.detalle-resultado', html)
      
      let dates = [];
      let titles = [];
      let rows = [];
      let posi = [];

      tables.map((index, element) => {
        
        let date = getDate($('.fecha', element).first().text().trim());
        dates.push(date);
        
        let title = $('.cifra-titulo', '.row.cabecera', element);
        let tmpTitle = [];
        title.map((index, t) => {
          tmpTitle.push($(t).text().trim())
        });
        titles.push(tmpTitle)

        let pos = $('.postura', '.row', element);
        let tmpPos = [];
        
        pos.map((index, p) => {
          if ($(p).text().trim()) {
            tmpPos.push($(p).text().trim());
          }
        });

        posi.push(tmpPos);

        let row = $('.cifra', '.row', element);
        let tmpRows = [];
        row.map((index, r) => {
          tmpRows.push($(r).text().trim());
        });

        rows.push(tmpRows);

      });

      let data = [];
      let positions = 13;

      for (let a = 0; a < dates.length; a++) {
        
        let titlesCount = titles[a].length - 1 ;
        let count = titles[a].length - 1;
      
        for (let b = 0; b < rows[a].length; b++) {
          let index = count - titlesCount;

          let item = {
            'posicion': 14 - positions,
            'fecha': dates[a],
            'horario': titles[a][index],
            'numero': rows[a][b],
          };

          data.push(item);
          
          if (titlesCount == 0) {
            titlesCount = count;
            positions--;
          } else {
            titlesCount--;
          }
        }
        positions = 13;
      }

      return data;
    })
    .catch((error) => {
      console.log('url', url);
      console.error('Error potus', error);
    }); 
}

const getDate = (date) => {
  let arrayDate = date.split(" ");

  let day = arrayDate[1];
  let month = months.find((item) => {
    return item.key == arrayDate[2];
  }).value;
  let year = arrayDate[3];

  return `${day}-${month}-${year}`;
}

module.exports = potusParse; 