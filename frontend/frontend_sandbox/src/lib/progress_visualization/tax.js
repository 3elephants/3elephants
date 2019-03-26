import React from 'react';
import ReactDOM from 'react-dom';
import Tax from './../components/progress_visualization/tax';


export function create(cost) {
  ReactDOM.render( <Tax cost={cost}/> , document.getElementById('elephants-pv-tax'));
}
