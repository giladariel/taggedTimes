import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import './App.css';
import * as XLSX from "xlsx";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      file: "",
      times: "",
      vectors: "",
      timesTagged: "",
      classTagged: "",
    };
    this.styles = StyleSheet.create({
      button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        width: '70px',
        borderRadius: '15%',
      }
    })
  }

  handleClick(e) {
    this.refs.fileUploader.click();
  }

  filePathset(e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.target.files[0];
    var uploadFile = true
    // console.log(file);
    this.setState({ file });
    // console.log(this.state.file);
  }

  readFile() {
    var f = this.state.file;
    // var f = require('./test_data/test.xlsx');
    const reader = new FileReader();
    reader.onload = (evt) => {
      // evt = on_file_select event
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      /* Update state */
      // console.log("Data>>>" + data);// shows that excel data is read
      this.convertToJson(data)
    };
    reader.readAsBinaryString(f);
  }

  convertToJson(csv) {
    var lines = csv.split("\n");
    
    var times = [];
    var vectors = [];
    var headers = lines[0].replace('"', "").split(",");
    // lines.forEach(element => {
    //   console.log(element)
    // });
    for (var i = 1; i < lines.length; i++) {
      var currentline = lines[i].replaceAll('"', "").split(/,(.+)/);
      times.push(currentline[0]);
      vectors.push(currentline[1]);
      }
    this.setState({ times });
    this.setState({ vectors });
  }

  createTimeline() {
    let block = []
    // console.log("times", this.state.times)
    for (var i = 0; i < this.state.times.length; i++) {
      var left = 12*this.state.times[i] + 'px';
      var top = 100 + 50* (i%3) + 'px'
      block.push(
      <div style={{left: left, position:'absolute'}}>
        <p>{this.state.times[i]}</p>
        <div style={{top: top, position:'absolute'}}>
          <TouchableOpacity style={this.styles.button} onPress={this.onPress}>
            <Text> {this.state.vectors[i]} </Text>
          </TouchableOpacity>
        </div>
      </div>)
    }
    return block
  };

  onPress() {

  }

  readTaggedFiles() {
    var f = this.state.file;
    // var f = require('./test_data/test.xlsx');
    const reader = new FileReader();
    reader.onload = (evt) => {
      // evt = on_file_select event
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      /* Update state */
      // console.log("Data>>>" + data);// shows that excel data is read
      this.addTaggedTimes(data)
    };
    reader.readAsBinaryString(f);
  }

  addTaggedTimes(csv) {
    var lines = csv.split("\n");
    
    var timesTagged = [];
    var classTagged = [];
    for (var i = 1; i < lines.length; i++) {
      var currentline = lines[i].replaceAll('"', "").split(/,(.+)/);
      timesTagged.push(currentline[0]);
      classTagged.push(currentline[1]);
      console.log(currentline)
      }
    this.setState({ timesTagged });
    this.setState({ classTagged });
  }

  createTaggedTimeline() {
    console.log(this.state.timesTagged)
    let block = []
    for (var i = 0; i < this.state.timesTagged.length; i++) {
      var left = 12*this.state.timesTagged[i] + 'px';
      var top = 150 + 'px'
      block.push(
      <div class="vertical-line" style={{left: left, top: top, position:'absolute'}}></div>)
    }
    return block
  };

  render() {
    return (
      <div>
        <input type="file" id="file" ref="fileUploader" onChange={this.filePathset.bind(this)}/>
        <button onClick={() => {this.readFile();}}>
          Read File
        </button>
        <input type="file" id="file" ref="fileUploader" onChange={this.filePathset.bind(this)}/>
        <button onClick={() => {this.readTaggedFiles();}}>
          Tagged File
        </button>
      {this.state.file != "" && 
        <div>
          <h3>I have file for you</h3>
          <div style={{display: 'flex'}}>{this.createTimeline()}</div>
          <div style={{display: 'flex'}}>{this.createTaggedTimeline()}</div>
        </div>
      }
      </div>
    );
  }
}

export default App;