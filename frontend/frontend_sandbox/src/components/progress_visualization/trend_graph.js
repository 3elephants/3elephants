import React, { Component } from 'react';
import React from 'react';
import {Line} from 'react-chartjs-2';



var options = {
  scales: {
    xAxes: [{
      type: 'time'
    }]
  }
};

class TrendGraph  extends Component {

  constructor(props) {
    super(props);
    var trendGraphData = this.data.map((item)=> {return {x: item.d y: item.s}});
    this.data = {

      datasets: [
        {
          label: 'My First dataset',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: trendGraphData
        }
      ]
    };
  }

  render() {
    return (
      <div>
        <h2>Line Example</h2>
        <Line data={data} options={options} />
      </div>
    );
  }
}

export default Tax;
