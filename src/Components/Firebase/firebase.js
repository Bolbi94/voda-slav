import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'core-js/features/promise';

import { config, AccrualsTableConfig, AccountsTableConfig, CountersTableConfig} from './config';

export default class Firebase {
  constructor() {
    app.initializeApp(config);

    const DATE = new Date();

    this.auth = app.auth();
    this.db = app.firestore();
    this.monthStamp = `${["January", "February", "March", "April", "May", 
      "June",  "July", "August", "September", "October", "November", 
      "December",][DATE.getMonth()]}${DATE.getFullYear()}`;
    this.dayStamp = `${DATE.getDate()}${["January", "February", "March", "April", "May", 
      "June",  "July", "August", "September", "October", "November", 
      "December",][DATE.getMonth()]}${DATE.getFullYear()}`;
    this.yearStamp = `${DATE.getUTCFullYear()}`;
  }

  createUserWithEmailAndPassword = (email, password) => 
    this.auth.createUserWithEmailAndPassword(email, password);

  signInWithEmailAndPassword = (email, password) => 
    this.auth.signInWithEmailAndPassword(email, password);

  signOut = () => 
    this.auth.signOut();

  passwordReset = (email) => 
    this.auth.sendPasswordResetEmail(email);

  passwordUpdate = (password) => 
    this.auth.currentUser.updatePassword(password);

  auth = () =>
    this.auth;

  getGoogleProviderID = () =>
    app.auth.GoogleAuthProvider.PROVIDER_ID;

  firestore = () =>
    app.firestore();

  timestamp = () => 
    app.firestore.FieldValue.serverTimestamp();
  
  getDefaultExportDictionaryByName = (name) => {
    switch(name) {
      case "Accruals":
        return AccrualsTableConfig.FieldsDictionary;
      case "Accounts":
        return AccountsTableConfig.FieldsDictionary;
      case "Counters":
        return CountersTableConfig.FieldsDictionary;
      default:
        return null;
    }
  }

  exportAccrualsTable = (data, exportingConfig = AccrualsTableConfig) => {
    // data = data.slice(0, 20);
    const { TableName, FieldsDictionary } = exportingConfig;
    let setTableDataArray = [];
    data.forEach((dataRow, i) => {
      if(dataRow[FieldsDictionary.keyAttr] && typeof(dataRow[FieldsDictionary.keyAttr]) === "string") {
        let ref = this.db
          .collection(TableName)
          .doc(this.yearStamp)
          .collection(this.monthStamp)
          .doc(dataRow[FieldsDictionary.keyAttr]);
        setTableDataArray.push({
          ...dataRow,
          firestoreRef: ref,
        });
      } else {
        console.log(`Unexpected key attribute value or type (index = ${i}), skipped`, dataRow);
      }
    });
    return this.firestoreBatchSet(setTableDataArray);
  }

  exportAccountsTable = (data, exportingConfig = AccountsTableConfig) => {
    const { TableName, FieldsDictionary } = exportingConfig;
    let setTableDataArray = [];
    data.forEach((dataRow, i) => {
      if(dataRow[FieldsDictionary.keyAttr] && typeof(dataRow[FieldsDictionary.keyAttr]) === "string") {
        let ref = this.db
          .collection(TableName)
          .doc(dataRow[FieldsDictionary.keyAttr]);
        setTableDataArray.push({
          ...dataRow,
          firestoreRef: ref,
        });
      } else {
        console.log(`Unexpected key attribute value or type (index = ${i}), skipped`, dataRow);
      }
    });
    return this.firestoreBatchSet(setTableDataArray);
  }

  exportCountersTable = (data, exportingConfig = CountersTableConfig) => {
    const { TableName, FieldsDictionary } = exportingConfig;
    let setTableDataArray = [];
    data.forEach((dataRow, i) => {
      if(dataRow[FieldsDictionary.keyAttr] && typeof(dataRow[FieldsDictionary.keyAttr]) === "string") {
        let ref = this.db
          .collection(TableName)
          .doc(dataRow[FieldsDictionary.keyAttr]);
        setTableDataArray.push({
          ...dataRow,
          firestoreRef: ref,
        });
      } else {
        console.log(`Unexpected key attribute value or type (index = ${i}), skipped`, dataRow);
      }
    });
    return this.firestoreBatchSet(setTableDataArray);
  }

  exportTableByName = (table, data, exportingConfig = undefined) => {
    switch(table) {
      case "Accruals":
        return this.exportAccrualsTable(data, exportingConfig);
      case "Accounts":
        return this.exportAccountsTable(data, exportingConfig);
      case "Counters":
        return this.exportCountersTable(data, exportingConfig);
      default:
        return null;
    }
  }

  firestoreBatchSet = (dataArray) => {
    const BATCH_COUNT = 400;
    let transactionCount = Math.ceil(dataArray.length / BATCH_COUNT);

    let batchSetIteration = (iteration = 0) => {
      return new Promise((resolve, reject) => {
        let batchData = [...dataArray].slice(BATCH_COUNT * iteration, BATCH_COUNT * (iteration + 1));
        let batch = this.db.batch();
        batchData.forEach(row => batch.set(row.firestoreRef, row.record));
        batch.commit()
        .then(() => {
          console.log("iteration " + iteration + " success!")
          if(++iteration < transactionCount) {
            console.log(`Proceed further... ${transactionCount - iteration} transaction${transactionCount - iteration > 1 ? '' : 's'} remain.`);
            batchSetIteration(iteration)
            .then(
              () => {
                resolve("done");
              },
              err => {
                reject(err);
              }
            );
          } else 
            resolve("done");
        })
        .catch(err => {
          console.log("error transaction", err, batchData, iteration);
          reject(err);
        });
      });
    };
    console.log(`Preparing to write ${dataArray.length} documents in ${transactionCount} iterations...`);
    return batchSetIteration();
  }
}