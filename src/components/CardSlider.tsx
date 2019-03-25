import styles from './CardSlider.css'
import { SimpleCollapsible } from './SimpleCollapsible'
import * as React from 'react'
import { Tooltip } from 'grommet-icons'
// import images from '../images/*'
// console.log(images)

// import { readFileSync } from 'fs'

// import image from 'Jones_2010_Age-and-Great-Invention-p10.png'

import {
  Grommet,
  Box,
  Button,
  Grid,
  Text,
  Carousel,
  CheckBox,
  Paragraph,
  Collapsible,
} from 'grommet'

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

export class ScrolledImage extends React.Component {
  private stepInput: React.RefObject<HTMLInputElement>
  constructor(props) {
    super(props)
    this.scrollInput = React.createRef()

    this.state = {
      contextStruct: props.contextStruct,
    }
  }

  componentDidMount() {
    // var node = React.findDOMNode(this)
    // this.scrollInput.scrollLeft = this.scrollInput.scrollHeight
    // this.refs['thisImage'].scrollTop = this.refs['thisImage'].scrollHeight
    this.scrollInput.current.scrollTop = this.state.contextStruct.top
    this.scrollInput.current.scrollLeft = this.state.contextStruct.left
    // console.log(this.scrollInput.current.scrollTop)
    this.render()
  }

  render() {
    let imageRequire: string
    // console.log(this.state.contextStruct.pdfDir)
    // console.log(
    //   this.state.contextStruct.pdfDir ===
    //     'Jones-2009-Review-of-Economic-Studies-The-Burden-of-Knowledge-and-the-“Death-of-the-Renaissance-Man”-Is-Innovation-Getting-Harder'
    // )
    switch (this.state.contextStruct.pdfDir) {
      case 'Jones_2010_Age-and-Great-Invention':
        imageRequire = require('../images/Jones_2010_Age-and-Great-Invention-p10.png')
        break
      case 'Bloom-et-al_2017_Are-Ideas-Getting-Harder-to-Find':
        imageRequire = require('../images/Bloom-et-al_2017_Are-Ideas-Getting-Harder-to-Find-p10.png')
        break
      case 'Jones-2009-Review-of-Economic-Studies-The-Burden-of-Knowledge-and-the-“Death-of-the-Renaissance-Man”-Is-Innovation-Getting-Harder':
        imageRequire = require('../images/Jones-2009-Review-of-Economic-Studies-The-Burden-of-Knowledge-and-the-“Death-of-the-Renaissance-Man”-Is-Innovation-Get-p24.png')
        break
      case 'Wuchty-et-al_2007_The-increasing-dominance-of-teams-in-production-of-knowledge':
        imageRequire = require('../images/Wuchty-et-al_2007_The-increasing-dominance-of-teams-in-production-of-knowledge-p3.png')
        break
      case 'nsf_big_ideas':
        imageRequire = require('../images/nsf_big_ideas-p11.png')
        break
      case 'Wu-et-al_2019_Large-teams-develop-and-small-teams-disrupt-science-and-technology':
        imageRequire = require('../images/Wu-et-al_2019_Large-teams-develop-and-small-teams-disrupt-science-and-technology-p3.png')
        break
      case 'Bloom-et-al_2017_Are-Ideas-Getting-Harder-to-Find':
        imageRequire = require('../images/Bloom-et-al_2017_Are-Ideas-Getting-Harder-to-Find-p10.png')
        break
      default:
        imageRequire = require('../images/Jones_2010_Age-and-Great-Invention-p10.png') // code block
    }

    return (
      <div
        // href={card.url}
        style={{
          // height: '11in',
          // width: '8.5in',
          // overflow: 'scroll',

          margin: '0px',
          padding: '0px',
          maxHeight:
            (this.state.contextStruct.height < 250
              ? 250
              : this.state.contextStruct.height) + 'px',
          minHeight: '30px',
          maxWidth: 'full',
          minWidth: '100px',
          overflow: 'scroll',
          position: 'relative',
        }}
        ref={this.scrollInput}
      >
        <img
          // https://blog.vjeux.com/2013/javascript/scroll-position-with-react.html
          // src="https://cdn.pixabay.com/photo/2017/07/24/02/40/pink-roses-2533389__340.jpg"
          // src={imagePath}
          src={imageRequire}
          // scrollTop="700px"
          style={{
            //   width: '200%',
            width: '1275px' /* width:'670px'  7in; */,
            height: '1650px' /*'900px',*/,
            //   position: 'absolute',
            //   scrollLeft: '500px',
            //   top:
            //     showTop + 'px' /*TODO translate the numbers correctly*/,
            //   position: 'absolute',
            //   transform: 'translateX(10px)',
            //   clip: 'rect(0, 100px, 200px, 0)',
            /* clip: shape(top, right, bottom, left); NB 'rect' is the only available option */
            //   }
            //   minWidth: '300%',
            //   margin: '0px',
            //   padding: '0px',
            //   width: '100px' /* width: 7in; */,
            //   height: '100px' /* or height: 9.5in; */,
            //   clear: both;
            //   background-color: gray;
            //   page-break-after: always;
            //   overflow: 'visible',
            //   'max-width': '200%',
          }}
        />
      </div>
    )
  }
}

export class SingleCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      originalText: props.originalText,
      similarClaim: props.similarClaim,
      contextStruct: props.contextStruct,
      i: props.i,
      open: false,
    }
  }

  render() {
    const { open } = this.state
    // const imagePath =
    //   '../images/' +
    //   this.state.contextStruct.pdfDir +
    //   '-p' +
    //   this.state.contextStruct.pageNumber +
    //   '.png'
    // console.log(imagePath)
    const showWidth = 1275 // scale=2 letter width 670
    const showHeight = 1650
    const showTop = -1 * this.state.contextStruct.top

    // const dir = './'
    // const raw = readFileSync(
    //   dir + 'src/images/' + this.state.contextStruct.pdfDir.toString(),
    //   'utf-8'
    // )
    // console.log(raw)

    return (
      <div
        className="card"
        id="card"
        style={this.props.cardStyle}
        key={this.state.i}
      >
        <Grid
          rows={['auto', 'auto']}
          columns={['3/4', '1/4']}
          gap="small"
          fill={true}
          areas={[
            { name: 'headerLeft', start: [0, 0], end: [0, 0] },
            { name: 'headerRight', start: [1, 0], end: [1, 0] },
            { name: 'main', start: [0, 1], end: [1, 1] },
          ]}
          align="center"
          alignContent="center"
          alignSelf="center"
          justify="center"
        >
          <Box gridArea="headerLeft">
            {/* <p className="desc">{this.state.similarClaim}</p> */}
            {/* <p className="desc" align="center">
              "{this.state.similarClaim}"{' '}
            </p> */}
            <p className="desc" align="center">
              "{this.state.similarClaim}" <br />
              from
              <b>
                {' '}
                {this.state.contextStruct.pdfDir}-p
                {this.state.contextStruct.pageNumber}
              </b>
            </p>
          </Box>
          {/* <SimpleCollapsible gridArea="headerRight" /> */}
          <Button
            onClick={() => this.setState({ open: !open })}
            icon={<Tooltip color="plain" />}
            plain={true}
            alignSelf="center"
            gridArea="headerRight"
          >
            {/* <Tooltip /> */}
          </Button>
          <Box gridArea="main">
            <Collapsible open={open} {...this.props} gridArea="main">
              <Box
              //   background="light-2"
              //   round="medium"
              //   pad="medium"
              //   align="center"
              //   justify="center"
              >
                {/* <Text>
      <Anchor> This is </Anchor>This is a box inside a Collapsible
      component
    </Text> */}

                <ScrolledImage {...this.state} />
                {/* </div> */}
              </Box>
            </Collapsible>
            {/* <Text>This is other content outside the Collapsible box</Text> */}
          </Box>
        </Grid>
        {/* <p className="title">{card.title}</p> */}
        {/* <p className="title">{this.state.originalText}</p> */}
        {/* <SimpleCollapsible /> */}
        {/* Do something for the semantic of SimpleCollapsible */}
        {/* <p className="desc">{card.desc}</p>
    <p className="desc">{this.state.similarClaim}</p>
    <p className="desc">
      {this.state.contextStruct.pdfDir.toString()}
    </p> */}
        {/* <div> */}
        {/* <div
      // href={card.url}
      style={{
        height: '200px',
        width: '200px',
        overflow: 'scroll',
      }}
    >
      <img
        src={card.url}
        style={{
          width: '500px',
        }}
      />
    </div> */}
        {/* </div> */}
      </div>
    )
  }
}

export class CardDeck extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      originalText: props.originalText,
      similarClaim: props.similarClaim,
      contextStruct: props.contextStruct,
    }
  }
  render() {
    const cardData = CardData()
    return (
      <section>
        {cardData.map((card, i) => {
          return (
            <SingleCard
              {...this.state}
              cardStyle={this.props.cardStyle}
              key={i}
              i={i}
            />
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
      originalText: props.originalText,
      similarClaim: props.similarClaim,
      contextStruct: props.contextStruct,
      displayKey: props.displayKey,
    }
    // console.log('as Display argument')
    // console.log(this.state.originalText)
    // console.log(this.state.similarClaim)
    // console.log(this.state.contextStruct)
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
      <div
        className="cards-slider"
        id={this.state.displayKey}
        key={this.state.displayKey}
      >
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
        <CardDeck cardStyle={this.state.cardStyle} {...this.state} />
      </div>
    )
  }
}

// ReactDOM.render(<Display />, document.getElementById('root'))
// document.getElementById('Jones_2010_Age-and-Great-Invention-p10')
