import React from 'react';
import ReactDOM from 'react-dom';
import TrendGraph from './../components/progress_visualization/trend_graph';


export function create(data) {
  ReactDOM.render( <TrendGraph data={data}/> , document.getElementById('elephants-pv-data'));
}
