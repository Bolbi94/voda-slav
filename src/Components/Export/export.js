import React from 'react';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import { handleCsvFile } from './functions';

export default class Export extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  exportFile = (e) => {
    let file = e.target.files[0];
    let table = e.target.name;
    if(file) {
      const { firebase } = this.props;
      const config = firebase.getDefaultExportDictionaryByName(table);
      if(!config) {
        console.log("Can not find necessary default dictionary");
        return;
      }
      handleCsvFile(config, file)
      .then(
        data => {
          console.log("data is prepared", data);
          if(data) {
            // /*
            //   reduced amount of data for test purposes!!!
            // */
            // data = data.slice(0, 20);
            firebase.exportTableByName(table, data)
            .then(
              () => {
                console.log("Table successfuly saved!");
              },
              err => {
                console.log("Table saving has been failed.", err);
              }
            );
          }
        },
        reason => {
          console.log(reason);
        }
      );
    } else {
      console.log("No file detected");
    }
  }

  render() {
    return(
      <div>
        {/* <div>
          <TextField value = "Export Accruals Table" />
          <Input type = "file" onChange = {e => this.exportFile(e)} name = "Accruals" />
        </div>
        <div>
          <TextField value = "Export Accounts Table" />
          <Input type = "file" onChange = {e => this.exportFile(e)} name = "Accounts" />
        </div>
        <div>
          <TextField value = "Export Counters Table" />
          <Input type = "file" onChange = {e => this.exportFile(e)} name = "Counters" />
        </div> */}
      </div>
    )
  }
}