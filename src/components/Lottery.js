import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Api from '../services/Api';
import { getRandomIntInclusive } from '../services/Utils';
import Card from './Card';

class Lottery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      planetCount: null,
      chosenCard: null,
      chosenPlanet: null,
      spin: true
    };
    this.handleCardClick = this.handleCardClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentDidMount() {
    Api.getRequest('/planets/')
      .then((result) => {
        this.setState({
          planetCount: result.count,
        });
      });
  }

  componentDidUpdate() {
    const chosenCard = this.state.chosenCard;
    const chosenPlanet = this.state.chosenPlanet;

    if (chosenCard && chosenPlanet) {
      for (let i = 0; i < chosenCard.children.length; i++) {
        if (chosenCard.children[i].className === 'lottery__card-front') {
          ReactDOM.render(
            <Card chosenCard={chosenPlanet} />,
            chosenCard.children[i]
          );
        }
      }
    }
  }

  handleCardClick(e) {
    if (this.state.spin === true) {
      this.setState({ spin: false });
      const el = e.currentTarget;
      const lotteryCards = document.getElementsByClassName('lottery__card');

      for (let i = 0; i < lotteryCards.length; i++) {
        if(lotteryCards[i] === el) {
          this.setState({ chosenCard: lotteryCards[i] });
          lotteryCards[i].classList.add('lottery__card--selected');
        } else {
          lotteryCards[i].classList.add('lottery__card--stop');
        }
      }

      this.setState({
        chosenPlanet: getRandomIntInclusive(1, this.state.planetCount),
      });
    }
  }

  handleButtonClick() {
    const chosenCard = this.state.chosenCard;

    if (this.state.spin === false && chosenCard) {
      const lotteryCards = document.getElementsByClassName('lottery__card');

      for (let i = 0; i < chosenCard.children.length; i++) {
        if (chosenCard.children[i].className === 'lottery__card-front') {
          ReactDOM.unmountComponentAtNode(chosenCard.children[i])
        }
      }

      this.setState({
        chosenPlanet: null,
        spin: true
      });

      for (let i = 0; i < lotteryCards.length; i++) {
        lotteryCards[i].classList.remove('lottery__card--selected');
        lotteryCards[i].classList.remove('lottery__card--stop');
      }
    }
  }

  render() {
    const cards = function() {
      let cardsArray = [];

      for (let i = 0; i < 3; i++) {
        cardsArray[i] = (
          <div key={i} className="lottery__card lottery__card--spin"
            onClick={(e) => this.handleCardClick(e)}>
            <div className="lottery__card-back"></div>
            <div className="lottery__card-front"></div>
          </div>
        );
      }

      return cardsArray;
    }.bind(this);

    return (
      <div className="lottery">
        <div className="lottery__wrapper">
          <div className="lottery__container">
            { cards() }
          </div>
        </div>
        { this.state.spin === false &&
          <button
            className="button" title="Spin again"
            action="stop" onClick={() => this.handleButtonClick()}>
            Spin again
          </button>
        }
      </div>
    );
  }
}

export default Lottery;
