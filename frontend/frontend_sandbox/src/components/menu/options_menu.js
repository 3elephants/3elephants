import React, { Component } from 'react';
import './scss/App.scss';
import * as optionsManager from '../../lib/menu/options_manager';
class OptionsMenu extends Component {

  render() {

    return (
        <div id="elephants-menu">
              <ul>
                <li>
                      <input type="checkbox" id="sort-results"/>


                      <label htmlFor="sort-results">


                        <span className="checkmark"></span>
                        <div className="label">
                          Sort Results By Green Score
                        </div>
                      </label>


                </li>

                <li>
                      <input type="checkbox" id="restrictive-mode"/>


                      <label htmlFor="restrictive-mode">


                        <span className="checkmark"></span>
                        <div className="label">
                          Restrictive Mode
                        </div>
                      </label>


                </li>
                <li>
                      <input type="checkbox" id="green-tax"/>


                      <label htmlFor="green-tax">


                        <span className="checkmark"></span>
                        <div className="label">
                          Green Tax
                        </div>
                      </label>


                </li>
                <li>
                <span className="small-elephants"> **This is just to make you more aware of products we identify as potentially hazardous. We don't charge you anything.</span>
                </li>

                <li>
                      <input type="checkbox" id="bg-color"/>


                      <label htmlFor="bg-color">


                        <span className="checkmark"></span>
                        <div className="label">
                          Background Color
                        </div>
                      </label>


                </li>
                <li>
                      <input type="checkbox" id="cart-buttons"/>


                      <label htmlFor="cart-buttons">


                        <span className="checkmark"></span>
                        <div className="label">
                          Cart Buttons
                        </div>
                      </label>
                </li>


              </ul>
        </div>

    );
  }

  componentDidMount() {
    var options = [
      {
        id: 'sort-results',
        features: ['sort_results']
      }, {
        id: 'restrictive-mode',
        features: ['restrictive_mode']
      }, {
        id: 'green-tax',
        features: ['price']
      }, {
        id: 'bg-color',
        features: ['background_color']
      }, {
        id: 'cart-buttons',
        features: ['add_to_cart', 'nav_cart']
      }
    ];
    optionsManager.create(options);
  }

}

export default OptionsMenu;
