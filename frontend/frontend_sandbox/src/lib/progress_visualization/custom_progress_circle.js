import React from 'react';
import ReactDOM from 'react-dom';
import ElephantsProgressCircle from './../components/progress_visualization/custom_progress_circle';


export function create(score) {
  ReactDOM.render( <ElephantsProgressCircle percentage={score} counterClockwise={true}/> , document.getElementById('elephants-pv-circle'));
}
