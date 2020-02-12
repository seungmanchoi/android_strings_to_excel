const fs = require('fs');
const Excel = require('exceljs');
const moment = require('moment');
const xml2js = require('xml2js');
const inquirer = require('inquirer');
const SAVE_DIR = './results';

inquirer.prompt([{
  type: 'rawlist',
  name: 'target',
  message: '실행할 명령 선택.\n',
  choices: ['strings.xml => excel', 'excel => string.xml']
}]).then((choice) => {
  const command = choice.target;

  // [1]strings.xml --> EXCEL
  if (command.indexOf('strings') === 0) {
    const files = fs.readdirSync('./target/xml');
    const langList = [];

    if (files.length > 0) {
      // ex) values : en, values-ko : ko, values-vi : vi
      for (var i = 0, max = files.length; i < max; i += 1) {
        if (files[i].indexOf('values') === 0) {
          langList.push({
            lang: files[i].split('-').length > 1 ? files[i].split('-')[1] : 'en',
            directory: files[i],
          });
        }
      }

      if (langList.length > 0) {
        const workbook = new Excel.Workbook();
        const tempFilePath = `${SAVE_DIR}/excel/lang_${moment().format('YYYY-MM-DD')}.xlsx`;

        for (var i = 0, max = langList.length; i < max; i += 1) {
          const directory = langList[i].directory;
          const lang = langList[i].lang;
          const filePath = `./target/xml/${directory}/strings.xml`;

          if (fs.existsSync(filePath)) {
            const xml = fs.readFileSync(filePath);
            const worksheet = workbook.addWorksheet(lang);

            xml2js.parseString(xml, function (err, result) {
              var list = result.resources.string;

              worksheet.columns = [
                { header: 'code', key: 'key', width: 30 },
                { header: lang, key: 'content', width: 70 },
              ];

              for (var i = 0, max = list.length; i < max; i += 1) {
                worksheet.addRow({
                  key: list[i].$.name,
                  content: list[i]._,
                });
              }
            });
          }
        }

        if (!fs.existsSync(`${SAVE_DIR}/excel`)) {
          fs.mkdirSync(`${SAVE_DIR}/excel`, { recursive: true })
        }

        workbook.xlsx.writeFile(tempFilePath).then(function() {
          console.log(`${SAVE_DIR}/excel/sovoro_language_${moment().format('YYYY-MM-DD')}.xlsx [생성]`);
        });

      } else {
        console.error('"values" directory not found.');
      }
    } else {
      console.error('file or directory not found.');
    }

  // [2]EXCEL --> strings.xml
  } else {
    const files = fs.readdirSync('./target/excel');
    const excelList = [];

    if (files.length > 0) {
      for (var i = 0, max = files.length; i < max; i += 1) {
        if (['xlsx'].indexOf(files[i].split('.').pop()) !== -1) {
          excelList.push(files[i]);
        }
      }

      if (files.length > 0) {
        inquirer.prompt([{
          type: 'rawlist',
          name: 'target',
          message: '파일 선택\n',
          choices: excelList,
        }]).then((choice) => {
          const workbook = new Excel.Workbook();

          // read excel file
          workbook.xlsx.readFile(`./target/excel/${choice.target}`).then(() => {
            // read sheet
            workbook.eachSheet((worksheet, id) => {
              const builder = new xml2js.Builder();
              const lang = worksheet.name;
              let directory = 'values';
              let xmlRoot = {
                resources: []
              };

              if (lang !== 'en') {
                directory = `${directory}-${lang}`;
              }

              if (!fs.existsSync(`${SAVE_DIR}/xml/${directory}`)) {
                fs.mkdirSync(`${SAVE_DIR}/xml/${directory}`, { recursive: true })
              }

              worksheet.eachRow((row, rowNumber) => {
                if (rowNumber !== 1) {
                  const string = {
                    $: {
                      name: ''
                    },
                    _: ''
                  };

                  row.eachCell((cell, cellNumber) => {
                    const value = cell.value;

                    switch(cellNumber) {
                      case 1 : // code
                        string['$']['name'] = value;
                        break;
                      case 2 : // content
                        string['_'] = value;
                        break;
                    }
                  });

                  xmlRoot.resources.push({ string });
                }
              })

              const xml = builder.buildObject(xmlRoot);

              fs.writeFile(`${SAVE_DIR}/xml/${directory}/strings.xml`, xml, (err) => {
                  if (err) {
                    console.error('error ', err);
                    return;
                  }

                  console.log(`${SAVE_DIR}/xml/${directory}/strings.xml [생성]`);
              });

            })
          });

        }).catch((error) => {
          console.error(`error ${error}`);
        })
      } else {
        console.log('excel file not found.');
      }

    } else {
      console.error('file or directory not found.');
    }
  }
});





