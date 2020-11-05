import React from 'react';
import Input from '@material-ui/core/Input';
import 'core-js/features/promise';
import { te } from 'date-fns/locale';

export default class ExportTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }

    this.config = {
      account: "LS",
      accountMap: undefined,
      dictionary: {
        Accrued: "NACH",
        Paid: "OPL",
        Debt: "DOLG",
      },
      dictionaryMap: {},
    }
  
  }
  exportFile = (e) => {
    console.log(e);
    console.log(e.target.files, e.files);
    let file = e.target.files[0];
    if(file) {
      console.log("kek1");
      let reader = new FileReader();
      reader.onload = event => {
        console.log("event", event, event.target.result);
        let csvArray = CSVToArray(event.target.result);
        console.log(csvArray, csvArray[0]);
        let csvHeader = [...csvArray[0]];
        this.mapHeader(csvHeader);
        let csvData = [...csvArray].slice(1).filter(row => row.length > 1);
        let data = this.mapData(csvData);
        console.log(csvHeader, csvData, data);

        // this.saveTable("Accruals", data);
      }
      reader.readAsText(file, "ISO-KOI8-U");
    }
  }

  mapHeader = (csvHeader) => {
    const { account, dictionary } = this.config;
    for(let key in dictionary) {
      csvHeader.forEach((header, i) => {
        if(header === account)
          this.config.accountMap = i;
        if(header === dictionary[key]) 
          this.config.dictionaryMap[key] = i;
      })
    }
    
  }

  mapData = (csvData) => {
    const { accountMap, dictionary, dictionaryMap } = this.config;
    console.log(this.config, accountMap, dictionary, dictionaryMap);
    if(Number.isInteger(accountMap) && 
        Object.keys(dictionary).length === Object.keys(dictionaryMap).length) {
      let data = csvData.map(dataRow => {
        let dataRowObj = {
          account: dataRow[accountMap],
          record: {},
        };
        for(let key in dictionaryMap) {
          dataRowObj.record[key] = dataRow[dictionaryMap[key]];
        };
        return dataRowObj;
      });
      console.log("data obj", data);
      return data;
    }
  }

  saveTable = (tableName, data) => {
    if(data) {
      const { firebase } = this.props; 
      const BATCH_COUNT = 400;
      let monthStamp = `${
        [
          "January", 
          "February", 
          "March", 
          "April", 
          "May", 
          "June", 
          "July", 
          "August", 
          "September", 
          "October", 
          "November", 
          "December",
        ]
        [new Date().getUTCMonth()]
      }${new Date().getUTCFullYear()}`;
      let transactionCount = Math.ceil(data.length / BATCH_COUNT);
      let saveTransaction = (iteration = 0) => {
        return new Promise((resolve, reject) => {
          let dataBatch = [...data].slice(BATCH_COUNT * iteration, BATCH_COUNT * (iteration + 1));
          let batch = firebase.firestore().batch();
          dataBatch.forEach((dataRow, i) => {
            if(dataRow.account && typeof(dataRow.account) === "string") {
              let ref = firebase
                .firestore()
                .collection(tableName)
                .doc(new Date().getUTCFullYear().toString())
                .collection(monthStamp)
                .doc(dataRow.account);
              batch.set(ref, dataRow.record);
            } else {
              console.log(`Unexpected account (index = ${iteration * BATCH_COUNT + i})`, dataRow);
            }
          });
          batch.commit()
          .then(() => {
            console.log("iteration " + iteration + " success!")
            if(++iteration < transactionCount) {
              console.log(`Proceed further... ${transactionCount - iteration} transaction${transactionCount - iteration > 1 ? '' : 's'} remain.`);
              saveTransaction(iteration)
              .then(
                () => {
                  resolve("saved");
                },
                err => {
                  reject(err);
                }
              );
            } else 
              resolve("saved");
          })
          .catch(err => {
            console.log("error transaction", err, dataBatch, iteration);
            reject(err);
          });
        });
      };

      saveTransaction()
      .then(
        () => {
          console.log("Table successfuly saved!");
        },
        err => {
          console.log("Table saving has been failed.", err);
        }
      );
    } else {
      console.log("No data read from csv!");
    }
  }

  render() {
    return(
      <div>
        <Input type = "file" onChange = {(e) => this.exportFile(e)} />
      </div>
    )
  }
}

function CSVToArray(strData, strDelimiter) {
  strDelimiter = (strDelimiter || ",");
  var objPattern = new RegExp(
    (
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" + 
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" + 
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
  );
  var arrData = [
    []
  ];
  var arrMatches = null;
  while (arrMatches = objPattern.exec(strData)) {
    var strMatchedDelimiter = arrMatches[1];
    if (
      strMatchedDelimiter.length &&
      strMatchedDelimiter !== strDelimiter
    ) {
      arrData.push([]);
    }
    var strMatchedValue;
    if (arrMatches[2]) {
      strMatchedValue = arrMatches[2].replace(
        new RegExp("\"\"", "g"),
        "\""
      );
    } else {
      strMatchedValue = arrMatches[3];
    }
    arrData[arrData.length - 1].push(strMatchedValue);
  }
  return arrData;
}