import logo from './logo.svg';
import './App.css';

import { Line,Chart } from "react-chartjs-2";
import React, { Component } from "react";
import LineChart from "chart.js";
import "chartjs-plugin-zoom";
import { ScrollView } from "react-native";
import ReactDOM from "react-dom";
//import   "chartjs-plugin-streaming";

let values = [65,45,78,89,56,45,78,45,12,24,23,15,78,56];
let values1 = [5,3,4,6,7,8,9,4,5,6,1,2,32,2];
let dateTme = [new Date().getTime()]
var xAxisLabelMinWidth = 10;


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    // for(var i=0;i<20;i++)
    // {
    //   values.push(values.length+1);
    //   values1.push(values1.length+2);
    // }
   

    this.state = {
      timerInterval: 1000,
      isOn:true,
      currentDate:new Date().toLocaleString(),
        windowWidth: window.innerWidth ,
        //120 mSeconds -- 2Min - Default Window Span
        currentWindowSpan: 60,
        singlePoint: 10,
        graphWidth: 10,
        pan :false,
        zoom:true
   }
  }


  componentDidMount() {
    
    this.myChart = new Chart(this.chartRef.current, {
      type: "line",
      options: {
        title: {
          display: false,
          text: 'Interactions sample'
        },
        responsive: true,
        maintainAspectRatio: false,
        zoomEnabled: true,
        animationEnabled: true,
        scales: {
          xAxes: [{
            type: "time",
            time: {
              unit:"second",
              displayFormats: {
                millisecond: "hh:mm:ss"
              }
            }

          }],
          yAxes: [{
            type: 'linear',
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'value'
            }
          }]
        },
        pan: {
          enabled: false,
          drag: true,
          mode: "x",
          // speed: 10,
          // threshold: 10
        },
        zoom: {
          enabled: true,
          drag: true,
          mode: "x",
          limits: {
            // max: 10,
            // min: 0.5
          },
          rangeMin: {
            // x: 0,
            // y: 0
          },
          rangeMax: {
            // x: 5,
            // y: 5
          }
        }
      },
      data: {
        labels: dateTme,
        datasets: [
          {
            label: "Chart",
            data: values,
            fill: "none",
            backgroundColor: "Black",
            pointRadius: 2,
            borderColor: "Black",
            borderWidth: 1,
            lineTension: 0.5,
            Hidden:false
          },
          {
            label: "Chart1",
            data: values1,
            fill: "none",
            backgroundColor: "Green",
            pointRadius: 2,
            borderColor: "Green",
            borderWidth: 1,
            lineTension: 0.5
          }
        ]
      }
    });
    //this.componentDidUpdate();
   this.timer = setInterval(() => this.update(), this.state.timerInterval);
 //setTimeout(this.componentDidUpdate(), this.state.timerInterval);
  }

  singlepoint(){
    //Graph Width----
    this.maxWidth = this.chartRef.current.parentElement.offsetWidth;

    //Single POint----
    const point = this.state.windowWidth / this.state.currentWindowSpan ;
    this.setState({singlePoint:point});
   
    console.log(this.state.singlePoint);
    console.log("Graph-Width");
    console.log(this.maxWidth);
    console.log("window-Width");
    console.log(this.state.windowWidth);
    console.log("Print");
  }

  update() {

    if(this.state.currentDate != new Date().toLocaleString())
    {
      this.setState({currentDate:new Date().toLocaleString()});
    }
  

     this.date = new Date().toLocaleString();

    const min = 1;
    const max = 100;

    const rand = min + Math.random() * (max - min);
    const rand1 = min + Math.random() * (max - min);
    this.myChart.data.labels.push(new Date().getTime());
    this.myChart.data.datasets[0].data.push(rand);
    this.myChart.data.datasets[1].data.push(rand1);
    console.log(this.myChart.data.labels.length);

    //this is to find the width of the Graph Screen-----

  this.singlepoint()
    //This is to scroll the graph after the currentWindowSpan
    if (this.myChart.data.labels.length > 60) {
  
    const tempwidth = this.myChart.data.labels.length*this.state.singlePoint

         var width = tempwidth + this.state.singlePoint ;
        
      this.chartRef.current.parentElement.style.width = width + "px";

      this.setState({graphWidth:width});

      this.scrollView.scrollTo({ x: width });
    }
    this.myChart.update();
    //setTimeout(this.componentDidUpdate(), this.state.timerInterval);
    //    this.scrollToBottom();
  }


  //Stop and Resume Graph-------
 handleClick = (e) =>  {
    console.log("Button Clicked");
    if(this.state.isOn == true)
    {
      clearInterval(this.timer);
      this.setState({isOn: false});
    }else{
      this.timer = setInterval(() => this.update  (), this.state.timerInterval);
      this.setState({isOn: true})
    }
  }

  //Select Sample Rate DropDown-------
  handleChange = (e) => {
    const val = e.target.value;  
    console.log("DropDown Selected");
    clearInterval(this.timer);
    this.setState({ timerInterval: val*1000 }, () => {
      console.log(this.state.timerInterval);
      this.timer = setInterval(() => this.update(), this.state.timerInterval);

    }); 
  }

  ResetGraphhandleClick = (e) => {
    console.log("Reset Graph Clicked");
    clearInterval(this.timer);
    

    this.myChart.resetZoom();
    this.scrollView.scrollTo({ x: this.state.graphWidth });
    this.timer = setInterval(() => this.update(), this.state.timerInterval);

  }


    //Select Window Span DropDown-------
    windowSpanHandleChange = (e) => {
      const val = e.target.value;  
      console.log("DropDown Selected");
          clearInterval(this.timer);
      this.setState({ currentWindowSpan: val*60 }, () => {
        console.log(this.state.currentWindowSpan);
       // this.singlepoint();
        this.timer = setInterval(() => this.update(), this.state.timerInterval);
  
      }); 

    }


    hiddenOnClick = (e)  => {
      console.log("hidden Selected");

      this.myChart.data.datasets[0].hidden = !this.myChart.data.datasets[0].hidden

    }


    handleChange = () =>{
      console.log("Checkbox Clicked");
      
    }




    panOnClick = (e) => {
      console.log("Pan Clicked");
      this.myChart.options.pan.enabled = !this.state.pan 
      this.myChart.options.zoom.enabled = !this.state.zoom 
      this.setState({pan: !this.state.pan} );
      this.setState({zoom: !this.state.zoom} );

    }

  render() {

    let start = (this.state.isOn == true) ?
      <button   className="btn btn-primary" onClick={this.handleClick}>Stop Graph</button> :
      <button  className="btn btn-primary" onClick={this.handleClick}>Resume Graph</button>


    return (
      <div style={{width:"400"}}>
        <ScrollView
          ref={(ref) => {
            this.scrollView = ref;
          }}
        >
         <canvas id="chart" width="500px" ref={this.chartRef}></canvas>
        </ScrollView>

      <p>Screen Width :{this.state.windowWidth}</p>
      <p>Date & Time : {this.state.currentDate}</p>
      <p> Sample Rate -{this.state.timerInterval}</p>
       <p>Sample time</p>

       <div> 
         <select id="timerInterval" onChange={this.handleChange}>
        <option value="1">1 sec</option>
        <option value="2">2 sec</option>
        <option value="3">3 sec</option>
        <option value="5">5 sec</option>
        <option value="10">10 sec</option>
     </select>
     </div>

    <p>Window Span</p>
     <div> 
         <select id="WindowInterval" onChange={this.windowSpanHandleChange}>
        <option value="1">1 Min</option>
        <option value="2">2 Min</option>
        <option value="3">3 Min</option>
        <option value="5">5 Min</option>
        <option value="10">10 Min</option>
     </select>
     </div>
     <p></p>

         <div>{start}
        </div>  
  
       {/* // <input type="checkbox" checked={item.value} onChange={this.handleChange.bind(this, index)}/> */}
       <input type="checkbox"   onChange={this.handleChange()} / >

        <div>
        <button   className="btn btn-primary" onClick={this.hiddenOnClick}>Hidden</button></div>

<div>
        <button   className="btn btn-primary" onClick={this.ResetGraphhandleClick}>Reset Graph</button></div>

        <div>
        <button   className="btn btn-primary" onClick={this.panOnClick}>Pan{this.state.pan}</button></div>
     </div>


    );
  }
}



