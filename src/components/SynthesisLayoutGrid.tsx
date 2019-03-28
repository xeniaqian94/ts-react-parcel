import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { RichEditorExample } from './RichEditorExample'
import { SlateRichTextEditor } from './SlateRichTextEditor'
import { SlateEditor } from './SlateEditor'
import { SimpleCollapsible } from './SimpleCollapsible'
import { Display } from './CardSlider'
import { normalizeColor, deepMerge } from 'grommet/utils'
import { Block } from 'slate'
import { Grommet, Box, Button, Grid, Text, Carousel, CheckBox } from 'grommet'
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

export class InfoCards extends React.Component {
  // private stepInput: React.RefObject<HTMLInputElement>
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     contextMapping: props.contextMapping,
  //   }
  // }

  // static getDerivedStateFromProps(props, state) {
  //   if (props.contextMapping !== state.contextMapping) {
  //     console.log('state changed!! ')
  //     return {
  //       contextMapping: props.contextMapping,
  //     }
  //   }

  //   // Return null if the state hasn't changed
  //   return null
  // }

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

// export class SingleInfoCard extends React.Component {
//   render() {
//     return (
//       <Display
//         originalText={this.props.userInput}
//         similarClaim={this.props.similarClaim}
//         contextStruct={this.props.contextStruct}
//         displayKey={this.props.displayKey}
//         key={this.props.displayKey}
//       />
//     )
//   }
// }

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

const reservedRecontextualizeMap: { [userInputText: string]: string } = {
  'The most important problems in science are increasingly interdisciplinary':
    'grand challenges in science are increasingly interdisciplinary',
  'This means we have a growing interdisciplinary “burden of knowledge”':
    'the burden of knowledge on innovators and scientists is increasing',
  'With more specialized education':
    'people tend to specialize more over time (especially in areas with deeper knowledge) due to....',
}

export class SynthesisLayoutGrid extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.editorRef = React.createRef()
  }

  // https://stackoverflow.com/questions/35800491/how-to-get-values-from-child-components-in-react
  state = {
    sidebar: false,
    editorSelectedValue: null,
    numOfX: 0,
    contextMapping: null,
    editorValue: null,
    infoCards: null,
  }
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

      if (node['data'].hasOwnProperty('text')) {
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

  componentDidMount() {
    this.fromClaimToContext()
    // console.log("componentDidMount")
    // console.log(this.claim2Context)
    // console.log(this.editorRef.current.codeForFun())
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
      // const nodeText = node.text.replace(/\[x\]/g, '').trim() // /\[x\]|\[x,*|,*x\]/g TODO: change to ONLY allow [x]
      // console.log('this.mapping[nodeText]  ' + nodeText)
      // console.log(this.mapping[nodeText])
      const toRecontextArray = node.text.match(/(.*?)(\[x\])+/g) //non-greedy match followed by [x] and its variant
      if (toRecontextArray != null && null != this.claim2Context) {
        for (var j = 0; j < toRecontextArray.length; j++) {
          const nodeText = toRecontextArray[j].replace(/\[x\]/g, '').trim()
          // console.log('nodeText this.mapping[nodetext]')
          // console.log(nodeText)
          // console.log(this.mapping[nodeText]) //TODO: current mapping is manual, later change to heuristic rules (character overlap, etc.)
          const mappingValue = this.mapping[nodeText]
          if (typeof mappingValue === 'string') {
            if (null != this.claim2Context[mappingValue]) {
              currentContextMapping.push({
                userInput: nodeText,
                similarClaim: mappingValue,
                contextStruct: this.claim2Context[mappingValue].data, //this.claim2Context[this.mapping[nodeText]].data.pdfDir.toString()
              })
            }
          } else if (Array.isArray(mappingValue)) {
            for (var k = 0; k < mappingValue.length; k++) {
              if (null != this.claim2Context[mappingValue[k]]) {
                currentContextMapping.push({
                  userInput: nodeText,
                  similarClaim: mappingValue[k],
                  contextStruct: this.claim2Context[mappingValue[k]].data, //this.claim2Context[this.mapping[nodeText]].data.pdfDir.toString()
                })
              }
            }
          }
        }
      }
    }

    // this.setState({ contextMapping: currentContextMapping })
    this.setState(this.updateContextMapping(currentContextMapping))
    // console.log('currentContextMapping')
    // console.log(this.state.contextMapping)

    // TODO: this is where to insert floating box hovering button
    if (null != this.editorRef && null != this.editorRef.current) {
      this.editorRef.current.codeForFun() //This will be invoked whenever the code is on change!!
    }
  }

  render() {
    const { sidebar } = this.state

    const infoCardHeight = this.state.numOfX * 700 + 'px'

    const listItems =
      this.state.contextMapping != null ? (
        this.state.contextMapping.map((item, index) => (
          <div
            key={
              'outerkk' +
              item.userInput.substring(0, 10) +
              item.similarClaim.substring(0, 10)
            }
          >
            <Display
              originalText={item.userInput}
              contextStruct={item.contextStruct}
              similarClaim={item.similarClaim}
              displayKey={item.userInput}
              key={item.userInput} //Must use a key value unique to the element from https://stackoverflow.com/questions/43642351/react-list-rendering-wrong-data-after-deleting-item.
            />
          </div>
          // <div>{item.userInput}</div>
        ))
      ) : (
        <div />
      )

    // console.log('listItems')
    // console.log(listItems)

    return (
      <Grommet full theme={deepMerge(grommet, customToggleTheme)}>
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
              Synthesis interface prototype
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
                // if (
                //   this.state.sidebar === false &&
                //   this.state.editorValue != null
                // ) {
                //   //to be changed to true
                //   {
                //     this.getContextMapping(this.state.editorValue)
                //   }
                // }
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
