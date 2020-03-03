import React from 'react';
import readXlsxFile from 'read-excel-file';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';

const schemaCounters = {
  'ЛИЦЕВОЙ': {
    prop: 'id',
    type: String,
    required: true
  },
  'ХВС ВАННА НОМЕР': {
    prop: 'bathColdId',
    type: String,
    required: true
  },
  'ХВС ВАННЯ ПОКАЗ': {
    prop: 'bathColdValue',
    type: String,
    required: true
  },
  'ХВС ТУАЛЕТ НОМЕР': {
    prop: 'toiletColdId',
    type: String,
    required: true
  },
  'ХВС ТУАЛЕТ ПОКАЗ': {
    prop: 'toiletColdValue',
    type: String,
    required: true
  },
  'ХВС КУХНЯ НОМЕР': {
    prop: 'kitchenColdId',
    type: String,
    required: true
  },
  'ХВС КУХНЯ ПОКАЗ': {
    prop: 'kitchenColdValue',
    type: String,
    required: true
  },
  'ПОЛИВ НОМЕР': {
    prop: 'wateringId',
    type: String,
    required: true
  },
  'ПОЛИВ ПОКАЗ': {
    prop: 'wateringValue',
    type: String,
    required: true
  },
  'ГВС ВАННА НОМЕР': {
    prop: 'bathHotId',
    type: String,
    required: true
  },
  'ГВС ВАННЯ ПОКАЗ': {
    prop: 'bathHotValue',
    type: String,
    required: true
  },
  'ГВС ТУАЛЕТ НОМЕР': {
    prop: 'toiletHotId',
    type: String,
    required: true
  },
  'ГВС ТУАЛЕТ ПОКАЗ': {
    prop: 'toiletHotValue',
    type: String,
    required: true
  },
  'ГВС КУХНЯ НОМЕР': {
    prop: 'kitchenHotId',
    type: String,
    required: true
  },
  'ГВС КУХНЯ ПОКАЗ': {
    prop: 'kitchenHotValue',
    type: String,
    required: true
  },
  'ОБРАТКА НОМЕР': {
    prop: 'reverseId',
    type: String,
    required: true
  },
  'ОБРАТКА ПОКАЗ': {
    prop: 'reverseValue',
    type: String,
    required: true
  }
}

export function ReadXLSX(file) {
  console.log("start read xlsx");
  let schema = {...schemaCounters};
  readXlsxFile(file, { schema })
    .then(({ rows, errors }) => {
      console.log("rows:", rows);
      console.log("errors:", errors);
    })
    .catch(err => {
      console.log("some error", err);
    })
}

export function WriteCSV() {
  console.log("start write csv");

  let headers = [
    { label: "First Name", key: "firstname" },
    { label: "Last Name", key: "lastname" },
    { label: "Email", key: "email" }
  ];
   
  let data = [
    { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
    { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
    { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" }
  ];
  return(
    <CSVLink data = {data} headers = {headers} filename = {"test.xlsx"}>Write xlsx</CSVLink>
  )
}

export function WriteXLS(data) {
  let exportToExcel = (filename) => {
    console.log("exportToExcel()")
    // let data = [
    //   { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
    //   { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
    //   { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" }
    // ];
    let worksheet = XLSX.utils.json_to_sheet(data);
    console.log("worksheet", worksheet);
    let new_workbook = XLSX.utils.book_new();
    console.log("create workbook", new_workbook);
    XLSX.utils.book_append_sheet(new_workbook, worksheet, "sheet");
    console.log("add worksheet", new_workbook);
    XLSX.writeFile(new_workbook, filename);
  }

  return(
    <button onClick = {e => exportToExcel('test excel.xlsx')}>get excel</button>
  )
}