import React, {Component} from 'react';
class OriginalTooltip extends Component {
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
      {this.result.data_quality >=2 &&
        <span>
          <i className="material-icons icon-colors">info</i>
          <span className="tooltiptext">

            <br/> <br/> Based on
            <span className="tooltiptextemphasis">
              {dQratingsMap[Math.round(this.result.data_quality)]}
            </span> amount of data.
          </span>
        </span>
      }
      </span>
    );
  }
}

export default OriginalTooltip;
