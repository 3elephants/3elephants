import React, {Component} from 'react';
import Label from './label';
class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.result = this.props.data;


  }

  //data quality

  render() {
    var dQratingsMap = {
      0: {name:'Low', color:'#DDA629'},
      1: {name:'Mixed', color:'#5F8013'},
      2: {name:'Reasonable', color:'#7A9200'},
      3: {name:'High', color:'#0A9A93'}
    };

    var sourceItems = this.result.sources.map((source) =>
      <li key={source.source}> <a target="_blank" href={source.url}> {source.source} </a> </li>
    );

    let credFormat = dQratingsMap[Math.round(this.result.data_quality)];
    this.result.health_risk = 0;
    return (

      <div>



        <div className="elephants-tooltip-title"> <img src={chrome.extension.getURL("assets/images/el-logo.png")}/> <span style={"color:"+credFormat.color}> {credFormat.name.toUpperCase()} </span> Credibility </div>
      

        <div className="elephants-source-text">  Sources - click the source to
          see the original data </div>

        <ul className="elephants-sources-list">
          {sourceItems}
        </ul>
        <br/>
      <a  target="_blank" className="elephants-menu-footer-link" href="https://3elephants.github.io/website/description.html">
          How Products are Rated
        </a>

      </div>
    );
  }
}

export default Tooltip;
