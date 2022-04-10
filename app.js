const fs = require('fs');
const csv = require('csv-parser');
const results = [];
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


fs.createReadStream('абоненты.csv')
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        console.log(results);
        results.forEach(it=>{
            if (it['Тип начисления']==1) {
                it['Начислено']='301.26';
            } else {
                it['Начислено']=((it['Текущее']-it['Предыдущее'])*1.52).toFixed(2);
            }
        });
        console.log(results);
        const csvWriter = createCsvWriter({
            path: 'Начисления_абоненты.csv',
            header: [
                {id: '№ строки', title: '№ строки'},
                {id: 'Фамилия', title: 'Фамилия'},
                {id: 'Улица', title: 'Улица'},
                {id: '№ дома', title: '№ дома'},
                {id: '№ Квартиры', title: '№ Квартиры'},
                {id: 'Тип начисления', title: 'Тип начисления'},
                {id: 'Предыдущее', title: 'Предыдущее'},
                {id: 'Текущее', title: 'Текущее'},
                {id: 'Начислено', title: 'Начислено'},
            ]
        });
        csvWriter.writeRecords(results)       // returns a promise
            .then(() => {
                console.log('...Done');
            });
        let arrSumPerHouse = [];
        for (let i=0;i<results.length;i++) {
            let elementIndex = arrSumPerHouse.findIndex(it=>it['Улица']==results[i]['Улица'] && it['№ дома']==results[i]['№ дома']);
            if (elementIndex==-1) {
                arrSumPerHouse.push({
                    '№ строки': arrSumPerHouse.length+1,
                    'Улица': results[i]['Улица'],
                    '№ дома': results[i]['№ дома'],
                    'Начислено': results[i]['Начислено']
                });
            } else {
                arrSumPerHouse[elementIndex]['Начислено']=(+arrSumPerHouse[elementIndex]['Начислено'] + +results[i]['Начислено']).toFixed(2);
            }
        }
        console.log(arrSumPerHouse);
        const csvWriter1 = createCsvWriter({
            path: 'Начисления_дома.csv',
            header: [
                {id: '№ строки', title: '№ строки'},
                {id: 'Улица', title: 'Улица'},
                {id: '№ дома', title: '№ дома'},
                {id: 'Начислено', title: 'Начислено'},
            ]
        });
        csvWriter1.writeRecords(arrSumPerHouse)       // returns a promise
            .then(() => {
                console.log('...Done');
            });
    });