import React, {Component} from 'react';
class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.result = this.props.data;


  }

  //data quality

  render() {
    var dQratingsMap = {
      2: 'Limited',
      3: 'Fair',
      4: 'Good',
      5: 'Robust'
    };
    return (
      <span>
        <span>
          &nbsp;
          <i className="material-icons icon-colors">info</i>
          <span className="tooltiptext">
            {this.result.data_quality >=2 &&
              <span>
            <br/>
            Based on <span className="tooltiptextemphasis">
              {dQratingsMap[Math.round(this.result.data_quality)]}
            </span> amount of data.
            </span>
            }
            <br/>
            <a  target="_blank" style="font-style: italic;" href="https://3elephants.github.io/website/description.html">
              See More Information on How We Rate Products
            </a>
          </span>
        </span>
      </span>
    );
  }
}

export default Tooltip;
