import styles from './CardSlider.css'
import { SimpleCollapsible } from './SimpleCollapsible'
import * as React from 'react'

function CardData() {
  const rtn = [
    {
      title: 'CARNATIONS',
      desc:
        "Carnations require well-drained, neutral to slightly alkaline soil, and full sun. Numerous cultivars have been selected for garden planting.[4] Typical examples include 'Gina Porto', 'Helen', 'Laced Romeo', and 'Red Rocket'.",
      url:
        'https://cdn.pixabay.com/photo/2017/07/24/02/40/pink-roses-2533389__340.jpg',
    },
    {
      title: 'STREET',
      desc:
        'A street is a public thoroughfare (usually paved) in a built environment.',
      url:
        'https://cdn.pixabay.com/photo/2017/08/01/20/06/storm-2567670__340.jpg',
    },
    {
      title: 'CAMERA',
      desc: 'Camera captures memories for you and saves them permanently.',
      url:
        'https://cdn.pixabay.com/photo/2017/08/07/01/41/magnifying-glass-2598507__340.jpg',
    },
    {
      title: 'BREAKFAST',
      desc: 'Breakfast provides many benefits to our health and wellbeing.',
      url:
        'https://images.pexels.com/photos/8524/food-spoon-milk-strawberry.jpg?h=350&auto=compress&cs=tinysrgb',
    },
  ]
  return rtn
}

export class Cards extends React.Component {
  render() {
    const cardData = CardData()
    return (
      <section>
        {cardData.map((card, i) => {
          return (
            <div
              className="card"
              id="card"
              style={this.props.cardStyle}
              key={i}
            >
              <p className="title">{card.title}</p>
              <SimpleCollapsible />
              <p className="desc">{card.desc}</p>
              <a href={card.url}>
                <img src={card.url} />
              </a>
            </div>
          )
        })}
      </section>
    )
  }
}

// className={styles.relative}

export class Display extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentCard: 0,
      position: 0,
      cardStyle: {
        transform: 'translateX(0px)',
      },
      width: 0,
    }
  }

  componentDidMount() {
    let boxWidth = document.getElementById('card').clientWidth
    this.setState({ width: boxWidth })
  }

  // func: click the slider buttons
  handleClick(type) {
    // get the card's margin-right
    let margin = window.getComputedStyle(document.getElementById('card'))
      .marginRight
    margin = JSON.parse(margin.replace(/px/i, ''))

    const cardWidth = this.state.width // the card's width
    const cardMargin = margin // the card's margin
    const cardNumber = CardData().length // the number of cards
    let currentCard = this.state.currentCard // the index of the current card
    let position = this.state.position // the position of the cards

    // slide cards
    if (type === 'next' && currentCard < cardNumber - 1) {
      currentCard++
      position -= cardWidth + cardMargin
    } else if (type === 'prev' && currentCard > 0) {
      currentCard--
      position += cardWidth + cardMargin
    }
    this.setCard(currentCard, position)
  }

  setCard(currentCard, position) {
    this.setState({
      currentCard: currentCard,
      position: position,
      cardStyle: {
        transform: `translateX(${position}px)`,
      },
    })
  }
  // # {styles['cards-slider']}>
  render() {
    return (
      <div className="cards-slider">
        <div className="slider-btns">
          <button
            className="slider-btn btn-l"
            onClick={() => this.handleClick('prev')}
          >
            &lt;
          </button>
          <button
            className="slider-btn btn-r"
            onClick={() => this.handleClick('next')}
          >
            &gt;
          </button>
        </div>
        <Cards cardStyle={this.state.cardStyle} />
      </div>
    )
  }
}

// ReactDOM.render(<Display />, document.getElementById('root'))
