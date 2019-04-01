import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { RichEditorExample } from './RichEditorExample'
import { SlateRichTextEditor } from './SlateRichTextEditor'
import { SlateEditor } from './SlateEditor'
import { SimpleCollapsible } from './SimpleCollapsible'
import { Display } from './CardSlider'
import { normalizeColor, deepMerge } from 'grommet/utils'
import { Block } from 'slate'
import { compose } from 'lodash/fp'

import './CheckBox.css'

import { Grommet, Box, Button, Grid, Text, Carousel, CheckBox } from 'grommet'
// var CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup')
// import { CSSTransition } from 'react-transition-group'
import {
  Transition,
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group'

import {
  Attraction,
  Car,
  TreeOption,
  FormCheckmark,
  Solaris,
} from 'grommet-icons'
// import { FormCheckmark } from 'grommet-icons'
import { grommet } from 'grommet/themes'
import { css } from 'styled-components'
import { isContext } from 'vm'

const checkboxCheckStyle = css`
  background-color: #e03a3e;
  border-color: #e03a3e;
`

// const todostyle = css`
//   .example-enter {
//     opacity: 0.01;
//   }

//   .example-enter.example-enter-active {
//     opacity: 1;
//     transition: opacity 500ms ease-in;
//   }

//   .example-leave {
//     opacity: 1;
//   }

//   .example-leave.example-leave-active {
//     opacity: 0.01;
//     transition: opacity 300ms ease-in;
//   }
// `

export class TodoList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { items: ['hello', 'world', 'click', 'me'], effect: true }
    this.handleAdd = this.handleAdd.bind(this)
  }

  handleAdd() {
    const newItems = this.state.items.concat([prompt('Enter some text')])
    this.setState({ items: newItems })
  }

  changeState() {
    this.setState({ effect: !this.state.effect })
    // this.effect = !this.effect
    console.log(this.state.effect)
  }

  handleRemove(i) {
    let newItems = this.state.items.slice()
    newItems.splice(i, 1)
    this.setState({ items: newItems })
  }

  render() {
    const items = this.state.items.map((item, i) => (
      <div key={item} onClick={() => this.handleRemove(i)}>
        {item}
      </div>
    ))

    const { effect } = this.state
    console.log(effect)

    return (
      <div>
        <button onClick={this.handleAdd}>Add Item </button>
        <button onClick={() => this.changeState()}>
          Fade out Item {`${effect}`}
        </button>
        {/* <TransitionGroup> */}
        <CSSTransition in={true} appear={true} timeout={6000} classNames="fade">
          <div>
            <h1>Fading at Initial Mount</h1> sgosgosng
          </div>
          {/* <FormCheckmark /> */}
        </CSSTransition>
        {/* </TransitionGroup> */}
        {items}
      </div>
    )
  }
}

export class App extends React.Component {
  constructor(props) {
    super(props)
    this.transitionEnd = this.transitionEnd.bind(this)
    this.mountStyle = this.mountStyle.bind(this)
    this.unMountStyle = this.unMountStyle.bind(this)
    this.state = {
      //base css
      show: true,
      style: {
        fontSize: 60,
        opacity: 0,
        transition: 'all 2s ease',
      },
    }
  }

  componentWillReceiveProps(newProps) {
    // check for the mounted props
    if (!newProps.mounted) return this.unMountStyle() // call outro animation when mounted prop is false
    this.setState({
      // remount the node when the mounted prop is true
      show: true,
    })
    setTimeout(this.mountStyle, 10) // call the into animation
  }

  unMountStyle() {
    // css for unmount animation
    this.setState({
      style: {
        fontSize: 60,
        opacity: 0,
        transition: 'all 1s ease',
      },
    })
  }

  mountStyle() {
    // css for mount animation
    this.setState({
      style: {
        fontSize: 60,
        opacity: 1,
        transition: 'all 1s ease',
      },
    })
  }

  componentDidMount() {
    setTimeout(this.mountStyle, 10) // call the into animation
  }

  transitionEnd() {
    if (!this.props.mounted) {
      // remove the node on transition end when the mounted prop is false
      this.setState({
        show: false,
      })
    }
  }

  render() {
    return (
      this.state.show && (
        <h1 style={this.state.style} onTransitionEnd={this.transitionEnd}>
          Hello
        </h1>
      )
    )
  }
}

export class Parent extends React.Component {
  constructor(props) {
    super(props)
    this.buttonClick = this.buttonClick.bind(this)
    this.state = {
      showChild: true,
    }
  }
  buttonClick() {
    this.setState({
      showChild: !this.state.showChild,
    })
  }
  render() {
    return (
      <div>
        <App
          onTransitionEnd={this.transitionEnd}
          mounted={this.state.showChild}
        />
        <button onClick={this.buttonClick}>
          {this.state.showChild ? 'Unmount' : 'Mount'}
        </button>
      </div>
    )
  }
}

export class InfoCards extends React.Component {
  render() {
    // console.log('contextMapping within new class InfoCards')
    // console.log(this.props.contextMapping)
    let infoCards = []
    const currentContextMapping =
      this.props.contextMapping === null ? [] : this.props.contextMapping

    for (var i = 0; i < currentContextMapping.length; i++) {
      const gapKey = 'infocard-gap-' + i.toString()
      infoCards.push(<Box gap="medium" pad="medium" key={gapKey} />) //This is the gap
      console.log('infoCards' + i.toString())
      console.log(infoCards)
      infoCards.push(
        <Display
          originalText={currentContextMapping[i].userInput}
          similarClaim={currentContextMapping[i].similarClaim}
          contextStruct={currentContextMapping[i].contextStruct}
        />
      )
    }
    const newInfoCards = infoCards
    return <div>{newInfoCards}</div>
  }
}

// https://teamcolorcodes.com/maryland-terrapins-color-codes/
const customToggleTheme = {
  global: {
    colors: {
      'toggle-bg': '#6C6C6C',
      'toggle-knob': 'white',
    },
  },
  checkBox: {
    border: {
      color: {
        light: 'toggle-bg',
      },
    },
    color: {
      light: 'toggle-knob',
    },
    check: {
      radius: '2px',
    },
    hover: {
      border: {
        color: undefined,
      },
    },
    toggle: {
      background: 'toggle-bg',
      color: {
        light: 'toggle-knob',
      },
      size: '36px',
      knob: {
        extend: `
            top: -4px;
            box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.12), 0px 2px 2px 0px rgba(0,0,0,0.24);
          `,
      },
      extend: ({ checked }) => `
          height: 14px;
          ${checked && checkboxCheckStyle}
        `,
    },
    gap: 'xsmall',
    size: '18px',
  },
}

var divStyle = {
  backgroundImage: require('./logo.png'), // 'url(' + './logo.png' + ')',
}

const customCheckBoxTheme = {
  checkBox: {
    border: {
      color: {
        light: 'neutral-1',
      },
      radius: '2px',
    },
    color: {
      light: 'neutral-1',
    },
    check: {
      extend: ({ theme, checked }) => `
          ${checked &&
            `background-color: ${normalizeColor('neutral-1', theme)};`}
        `,
    },
    hover: {
      border: {
        color: undefined,
      },
    },
    icon: {
      size: '18px',
      extend: 'stroke: white;',
    },
    icons: {
      checked: FormCheckmark,
    },
    gap: 'xsmall',
    size: '18px',
    extend: `
        color: #9C9C9C;
      `,
  },
}

export class SynthesisLayoutGrid extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.editorRef = React.createRef()
    this.state = {
      // style: {
      //   // transition: `opacity 3s ease-in-out`,
      //   // opacity: 0,
      //   transition: `width 2s`,
      //   // transition-timing-function: linear;
      // },
      sidebar: false,
      editorSelectedValue: null,
      numOfX: 0,
      contextMapping: null,
      editorValue: null,
      infoCards: null,
    }
  }

  // https://stackoverflow.com/questions/35800491/how-to-get-values-from-child-components-in-react
  // state = {}
  mapping = require('./mapping.json')
  // infoCards:any = null

  graph = require('./state.json')
  claim2Context = null

  fromClaimToContext() {
    // Claim is the target, context is the source
    const links = this.graph['graph']['links']
    let claimID2ContextID = Object()
    let claim2ClaimID = Object()
    let contextID2Context = Object()
    const flattenedClaims = [].concat.apply([], Object.values(this.mapping))

    for (const linkID in links) {
      let link = links[linkID]
      claimID2ContextID[link['target']] = link['source']
    }

    const nodes = this.graph['graph']['nodes']

    for (const nodeID in nodes) {
      let node = nodes[nodeID]

      if (node['data'] && node['data'].hasOwnProperty('text')) {
        if (flattenedClaims.includes(node['data']['text'])) {
          claim2ClaimID[node['data']['text']] = node['id']
        }
      } else if (
        node['style']['type'] === 'circle' &&
        node['style']['fill'] === 'blue'
      ) {
        contextID2Context[node['id']] = node
      }
    }
    // console.log(contextID2Context)
    // console.log(claimID2ContextID)

    let claim2Context = Object()
    for (const claim in claim2ClaimID) {
      const claimID = claim2ClaimID[claim]
      const contextID = claimID2ContextID[claimID]
      const context = contextID2Context[contextID]
      claim2Context[claim] = context
    }
    this.claim2Context = claim2Context
    // console.log('claim2Context')
    // console.log(claim2Context)
  }

  /*
    onHoverHighlightCurrentUserInput() is an example of 
    child to parent communication. 
    It changes infocard style (border color) when the child 
    SlateRichTextEditor passes value to it. 
  */

  onHoverHighlightCurrentUserInput = userInput => {
    // console.log('userInput is ' + userInput)
    const trimedUserInput = userInput.trim()

    if (
      this.refsCollection != null &&
      this.refsCollection.hasOwnProperty(trimedUserInput) &&
      this.refsCollection[trimedUserInput] != null
    ) {
      this.refsCollection[trimedUserInput].setStyle()
    }
  }

  /*
    offHoverHighlightCurrentUserInput() is another example of 
    child to parent communication. 
    It resets infocard style (border color) when the child SlateRichTextEditor 
    passes signal to it. 
  */

  offHoverHighlightCurrentUserInput = userInput => {
    const trimedUserInput = userInput.trim()
    if (
      this.refsCollection != null &&
      this.refsCollection.hasOwnProperty(trimedUserInput) &&
      this.refsCollection[trimedUserInput] != null
    ) {
      this.refsCollection[trimedUserInput].resetStyle()
    }
  }

  componentDidMount() {
    this.fromClaimToContext()

    // TODO: check how to get reference for child component
    // for (var i = 0; i < Object.keys(this.refsCollection).length; i++) {
    //   if (
    //     Object.keys(this.refsCollection)[i] ===
    //     'The most important problems in science are increasingly interdisciplinary'
    //   ) {
    //     console.log('matched!')
    //     console.log(this.refsCollection[i])
    //   } else {
    //     console.log('not matched!')
    //     console.log(
    //       Object.keys(this.refsCollection)[i] ===
    //         'The most important problems in science are increasingly interdisciplinary'
    //     )
    //   }
    // }

    // console.log(this.props.children)
    // console.log(Object.keys(this.refsCollection)[0]) //['By doing more science in teams'])
    // console.log(this.refsCollection[Object.keys(this.refsCollection)[0]])
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('inside componentDidUpdate')

    // const userInput =
    //   'The most important problems in science are increasingly interdisciplinary'

    // if (
    //   this.refsCollection.hasOwnProperty(userInput) &&
    //   // this.refsCollection[userInput].hasOwnProperty('current') &&
    //   this.refsCollection[userInput] != null
    // ) {
    //   console.log(Object.keys(this.refsCollection[userInput]))
    //   console.log(this.refsCollection[userInput].style)
    //   // console.log(window.getComputedStyle(this.refsCollection[userInput]))
    //   this.refsCollection[userInput].setStyle()
    //   // const node = ReactDOM.findDOMNode(this)
    //   // console.log(this.refsCollection[userInput]['current'].focus())
    //   // console.log(
    //   //   Object.keys(this.refsCollection[userInput]['current'].state.style)
    //   // )
    // }

    // if (this.refsCollection.hasOwnProperty
    //   'The most important problems in science are increasingly interdisciplinary' &&this.refsCollection['The most important problems in science are increasingly interdisciplinary']!=null){
    //   console.log(this.refsCollection['The most important problems in science are increasingly interdisciplinary'].current)}
  }

  onUpdate(value, selected_or_whole) {
    // For sibling communication https://stackoverflow.com/questions/24147331/react-the-right-way-to-pass-form-element-state-to-sibling-parent-elements
    if (selected_or_whole === 1) {
      if (value.fragment.text.includes('[x]')) {
        this.setState({ editorSelectedValue: value.fragment.text })
      } else {
        this.setState({
          editorSelectedValue:
            ' o(╥﹏╥)o NO CONTEXT FOR THIS SELECTION (。_。)',
        })
      }
      this.setState({
        numOfX: (value.document.text.match(/\[x|x\]/g) || []).length,
      })
    }
    this.setState({ editorValue: value })
    this.getContextMapping(value)
  }

  updateContextMapping(currentContextMapping) {
    return (previousState, currentProps) => {
      return { ...previousState, contextMapping: currentContextMapping }
    }
  }

  getContextMapping(value: any) {
    let currentContextMapping: Object[] = []
    for (var i = 0; i < value.document.nodes.size; i++) {
      const node: Block = value.document.nodes.get(i)
      const toRecontextArray = node.text.match(/(.*?)(\[x\])+/g) //non-greedy match followed by [x] and its variant
      if (toRecontextArray != null && null != this.claim2Context) {
        for (var j = 0; j < toRecontextArray.length; j++) {
          const nodeText = toRecontextArray[j].replace(/\[x\]/g, '').trim()
          const mappingValue = this.mapping[nodeText]
          if (typeof mappingValue === 'string') {
            if (null != this.claim2Context[mappingValue]) {
              currentContextMapping.push({
                userInput: nodeText,
                similarClaim: [mappingValue],
                contextStruct: [this.claim2Context[mappingValue].data], //this.claim2Context[this.mapping[nodeText]].data.pdfDir.toString()
              })
            }
          } else if (Array.isArray(mappingValue)) {
            let similarClaims = []
            let contextStructs = []
            for (var k = 0; k < mappingValue.length; k++) {
              if (null != this.claim2Context[mappingValue[k]]) {
                similarClaims.push(mappingValue[k])
                contextStructs.push(this.claim2Context[mappingValue[k]].data)
              }
            }
            currentContextMapping.push({
              userInput: nodeText,
              similarClaim: similarClaims,
              contextStruct: contextStructs, //this.claim2Context[this.mapping[nodeText]].data.pdfDir.toString()
            })
          }
        }
      }
    }

    this.setState(this.updateContextMapping(currentContextMapping))

    // TODO: this is where to insert floating box hovering button
    if (null != this.editorRef && null != this.editorRef.current) {
      this.editorRef.current.codeForFun() //This will be invoked whenever the code is on change!!
    }

    // for (var i = 0; i < currentContextMapping.length; i++) {
    //   this.refsCollection[
    //     currentContextMapping[i].userInput
    //   ] = React.createRef()
    // }
  }

  refsCollection = {}

  render() {
    const { sidebar } = this.state
    this.refsCollection = {}

    const infoCardHeight = this.state.numOfX * 700 + 'px'
    // console.log(this.state.contextMapping)
    const listItems =
      this.state.contextMapping != null ? (
        this.state.contextMapping.map(
          (item, index) => {
            this.refsCollection[item.userInput.toString()] = React.createRef()
            return (
              <CSSTransition
                in={true}
                appear={true}
                enter={true}
                timeout={2000}
                classNames="fade"
                // unmountOnExit
                key={'CSSTransition' + item.userInput.substring(0, 10)}
              >
                <div key={'Display' + item.userInput.substring(0, 10)}>
                  <Display
                    // ref={this.refsCollection[item.userInput.toString()]}
                    ref={c =>
                      (this.refsCollection[item.userInput.toString()] = c)
                    }
                    originalText={item.userInput}
                    contextStruct={item.contextStruct}
                    similarClaim={item.similarClaim}
                    displayKey={item.userInput}
                    key={item.userInput} //Must use a key value unique to the element from https://stackoverflow.com/questions/43642351/react-list-rendering-wrong-data-after-deleting-item.
                  />
                </div>
              </CSSTransition>
            )
          }
          // <div>{item.userInput}</div>
        )
      ) : (
        <div />
      )

    return (
      <Grommet full theme={deepMerge(grommet, customToggleTheme)}>
        {/* TODO: animate based on this Parent component  */}
        {/* <CSSTransition in={true} appear={true} timeout={6000} classNames="fade"><TodoList /></CSSTransition> */}
        <Grid
          fill
          rows={['auto', 'full']}
          //   columns={['auto', 'flex']}
          columns={['60%', '40%']} // how many layout each column occupies
          areas={[
            { name: 'header', start: [0, 0], end: [1, 0] },
            // { name: 'headertwo', start: [1, 0], end: [1, 0] },
            { name: 'main', start: [0, 1], end: [1, 1] },
            { name: 'sidebar', start: [1, 1], end: [1, 1] },
          ]}
        >
          <Box
            gridArea="header"
            direction="row"
            align="center"
            justify="between"
            pad={{ horizontal: 'medium', vertical: 'small' }}
            round="medium"
            height="xsmall"
          >
            <Text
              alignSelf="center"
              textAlign="center"
              weight="bold"
              color="#800020"
            >
              Synthesis interface
            </Text>
            <CheckBox
              toggle={true}
              label={
                <Text weight="bold" color="#800020">
                  Re-contextualize/De-contextualize
                </Text>
              }
              checked={this.state.sidebar}
              onChange={() => {
                this.setState({ sidebar: !sidebar })
              }}
            />
          </Box>

          <Box gridArea="main" pad="large" height="full">
            {/* TODO: change to another view  */}
            {/* <RichEditorExample /> */}
            {/* <SlateEditor /> */}
            {/* To communicate btw siblings: https://stackoverflow.com/questions/24147331/react-the-right-way-to-pass-form-element-state-to-sibling-parent-elements */}
            <SlateRichTextEditor
              onUpdate={this.onUpdate.bind(this)}
              // ref="thisEditor"
              ref={this.editorRef}
              onHoverHighlightCurrentUserInput={
                this.onHoverHighlightCurrentUserInput
              }
              offHoverHighlightCurrentUserInput={
                this.offHoverHighlightCurrentUserInput
              }
            />
            {/* updateSelectedValue={this.updateSelectedValue} */}
          </Box>

          {sidebar && (
            //   TODO: change the element css here and semantic too!!
            <Box gridArea="sidebar" pad="medium" height={infoCardHeight}>
              {/* Basically limitless height */}
              {listItems}
              {/* <InfoCards contextMapping={this.state.contextMapping} /> */}
              {/* <div>{this.state.contextMapping}</div> */}
            </Box>
          )}
        </Grid>
      </Grommet>
    )
  }
}
