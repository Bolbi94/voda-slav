import 'core-js/features/promise';

/*
  Your need to set up dictionary for handling csf file.
  Structure of dictionary:
  {
    keyAttr: *keyAttr* - name of key attriute,
    *keyAttr*: Column header value in csv file related to *keyAttr*,
    dictionary: {
      Attribute name in firestore: Column header value in csv file related to this attribute,
      attr name in firestore: column header value in csv,
      attr name in firestore: column header value in csv,
      ...: ...,
    }
  }
  Mapping fields will be generated automatically, by adding "Map" to the end
*/
export function handleCsvFile(dictionaryConfig, file, strDelimiter = ',', encoding = "ISO-KOI8-U") {
  
  let mapHeader = (csvHeader, config) => {
    const { keyAttr, dictionary } = config;
    console.log("metka1", csvHeader, config);
    let parseDictionary = (dictionaryObj) => {
      console.log("rekyrsiya start", dictionaryObj);
      let dictionaryMapObj = {};
      for(let key in dictionaryObj) {
        if(dictionaryObj[key]) {
          if(typeof(dictionaryObj[key]) === "object") {
            console.log("rekyrsiya", dictionaryObj, dictionaryObj[key]);
            dictionaryMapObj[key] = parseDictionary(dictionaryObj[key]);
          } else {
            if(dictionaryObj[key].toString()[0] === '$') {
              dictionaryMapObj[key] = dictionaryObj[key].toString().slice(1);
            } else {
              csvHeader.forEach((header, i) => {
                if(header === dictionaryObj[key]) 
                dictionaryMapObj[key] = i;
              });
            }
          }
        }
      }
      return dictionaryMapObj;
    }

    let mappedConfig = {...config};
    mappedConfig[keyAttr + "Map"] = csvHeader.indexOf(config[keyAttr]);
    console.log("metka2", {...mappedConfig});
    let dictionaryMap = parseDictionary(dictionary);
    console.log("metka3", {...dictionaryMap});
    mappedConfig.dictionaryMap = dictionaryMap;
    return mappedConfig;
  }

  let mapData = (csvData, config) => {
    const { keyAttr, dictionary, dictionaryMap } = config;

    console.log(config, config[keyAttr + "Map"], dictionary, dictionaryMap);

    if(Number.isInteger(config[keyAttr + "Map"]) && Object.keys(dictionary).length > 0) {
      // let proceed = true;
      // if(Object.keys(dictionary).length > Object.keys(dictionaryMap).length) {
      //   let missedAttributes = Object.keys(dictionaryMap).concat(Object.keys(dictionary))
      //       .filter((el, i, arr) => arr.indexOf(el) === arr.lastIndexOf(el));
      //   proceed = window.confirm(`Next fields from dictionary have NOT been detected in csv file's headers:\n` + 
      //     `${missedAttributes.join(', ')}.\n` + 
      //     `Press "OK" to procced anyway, or "Cancel" to discard`);
      // };
      // if(!proceed)
      //   return null;
      let data = csvData.map(dataRow => {
        let createDataRowObj = (dictionaryMapObj) => {
          let record = {};
          for(let key in dictionaryMapObj) {
            if(dictionaryMapObj[key]) {
              if(typeof(dictionaryMapObj[key]) === "object") {
                record[key] = createDataRowObj(dictionaryMapObj[key]);
              } else if(typeof(dictionaryMapObj[key]) === "number") {
                record[key] = dataRow[dictionaryMapObj[key]];
              }
            }
          }
          return deleteEmptyKeys(record);
        }
        let fillWithDefaultValues = (parsedRecord, dictionaryMapObj) => {
          let fullRecord = {...parsedRecord};
          for(let key in dictionaryMapObj) {
            if(dictionaryMapObj[key]) {
              if(typeof(dictionaryMapObj[key]) === "object") {
                if(fullRecord[key]) {
                  fullRecord[key] = fillWithDefaultValues(parsedRecord[key], dictionaryMapObj[key]);
                }
              } else if(typeof(dictionaryMapObj[key]) === "string") {
                fullRecord[key] = dictionaryMapObj[key];
              }
            }
          }
          return fullRecord;
        }
        let dataRowObj = {};
        dataRowObj[keyAttr] = dataRow[config[keyAttr + "Map"]];
        let record = createDataRowObj(dictionaryMap);
        dataRowObj.record = fillWithDefaultValues(record, dictionaryMap);
        return dataRowObj;
      });
      console.log("data obj", data);
      return data;
    } else {
      console.log("Key attribute or dictionary have not been configured correctly");
      return null;
    }
  }

  /* return array of arrays (array of csv rows) */
  let CSVToArray = (strData, strDelimiter) => {
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

  return new Promise((resolve, reject) => {
    if(file && 
      dictionaryConfig && 
      dictionaryConfig.keyAttr &&
      dictionaryConfig.dictionary && 
      typeof(dictionaryConfig.dictionary) === "object") {
        const { keyAttr } = dictionaryConfig;
        let config = {
          ...dictionaryConfig,
          dictionaryMap: {},
        };
  
        let reader = new FileReader();
        reader.onload = event => {
          let csvArray = CSVToArray(event.target.result);
          console.log(csvArray, csvArray[0]);
          if(csvArray.length > 3) {
            let csvHeader = [...csvArray[0]];
            config = {...mapHeader(csvHeader, config)};
            let csvData = [...csvArray].slice(1).filter(row => row.length > 1);
            let data = mapData(csvData, config);
            console.log(csvHeader, csvData, data);
            resolve(data);
          } else {
            console.log("Looks like csv file has no data", csvArray);
            reject("No data in csv file");
          }
        }
        reader.onerror = event => {
          console.log("Failed to read file", reader.error);
          reject("Failed to read file")
        }
        reader.readAsText(file, encoding);
    } else {
      reject("Invalid dictionary");
    }
  });
}

export function deleteEmptyKeys(obj) {
  let newObj = {...obj};
  for(let key in newObj) {
    if(!newObj[key]) {
      delete newObj[key];
    } else if(typeof(newObj[key]) === "object") {
      if(!deleteEmptyKeys(newObj[key]))
        delete newObj[key]
    }
    if(newObj[key] === "0") {
      delete newObj[key];
    }
  }
  if(Object.keys(newObj).length === 0)
    newObj = null;
  return newObj;
}