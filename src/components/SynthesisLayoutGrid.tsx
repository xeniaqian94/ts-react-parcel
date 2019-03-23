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

const checkboxCheckStyle = css`
  background-color: #e03a3e;
  border-color: #e03a3e;
`

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
        // console.log(node["data"]["text"])
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
    console.log(contextID2Context)
    console.log(claimID2ContextID)

    let claim2Context = Object()
    for (const claim in claim2ClaimID) {
      const claimID = claim2ClaimID[claim]
      const contextID = claimID2ContextID[claimID]
      const context = contextID2Context[contextID]
      claim2Context[claim] = context
    }
    this.claim2Context = claim2Context
    console.log('claim2Context')
    console.log(claim2Context)
  }

  componentDidMount() {
    this.fromClaimToContext()

    // console.log("componentDidMount")
    console.log(this.claim2Context)
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

  getContextMapping(value: any) {
    let currentContextMapping: Object[] = []
    for (var i = 0; i < value.document.nodes.size; i++) {
      const node: Block = value.document.nodes.get(i)
      const nodeText = node.text.replace(/\[x\]|\[x,*|,*x\]/g, '').trim()
      if (
        null != this.mapping[nodeText] &&
        null != this.claim2Context &&
        null != this.claim2Context[this.mapping[nodeText]]
      ) {
        currentContextMapping.push({
          userInput: nodeText,
          similarClaim: this.mapping[nodeText],
          contextStruct: this.claim2Context[this.mapping[nodeText]].data, //this.claim2Context[this.mapping[nodeText]].data.pdfDir.toString()
        })
      }
    }
    this.setState({ contextMapping: currentContextMapping })
  }

  render() {
    const { sidebar } = this.state

    // let someSolaris = []
    // for (var i = 0; i < this.state.numOfX; i++) {
    //   someSolaris.push(<Solaris vcolor="brand" size="large" />) //{i.toString()}
    // }

    let infoCards = [] //Carousal may not be the best option Information card slider instead!! https://doreentseng.github.io/a-cards-slider-with-reactjs/
    const currentContextMapping =
      this.state.contextMapping === null ? [] : this.state.contextMapping

    for (var i = 0; i < currentContextMapping.length; i++) {
      const gapKey = 'infocard-gap-' + i.toString()
      infoCards.push(<Box gap="medium" pad="medium" key={gapKey} />) //This is the gap
      const buttonKey = 'infocard-' + i.toString()
      // const Background =
      // 'https://images.pexels.com/photos/34153/pexels-photo.jpg'

      infoCards.push(
        <Display
          originalText={currentContextMapping[i].userInput}
          similarClaim={currentContextMapping[i].similarClaim}
          contextStruct={currentContextMapping[i].contextStruct}
        />
      )

      // const Background = require('./logo.png')
      // infoCards.push(
      //   <Box
      //     width="auto"
      //     animation={[
      //       { type: 'fadeIn', duration: 1000 },
      //       { type: 'slideLeft', size: 'xlarge', duration: 1000 },
      //     ]}
      //   >
      //     <Carousel>
      //       <Button key={buttonKey} href="#" hoverIndicator>
      //         <Box
      //           pad={{
      //             horizontal: 'medium',
      //             vertical: 'small',
      //           }}
      //           height="medium"
      //           background={{ color: '#E03A3E', opacity: 'weak' }}
      //           round="medium"
      //         >
      //           <Text weight="bold">Original text: </Text>
      //           <Text>{currentContextMapping[i].userInput}</Text>
      //           <Text weight="bold">Claim text: </Text>
      //           <Text>{currentContextMapping[i].similarClaim}</Text>
      //           <Text weight="bold">Context struct: </Text>
      //           <Text>{currentContextMapping[i].contextStruct}</Text>
      //         </Box>
      //       </Button>
      //       <div>
      //         <img src={require('./logo.png')} className="img-responsive" />
      //       </div>
      //       {/* <Button> */}
      //       <SimpleCollapsible open={true} />
      //       {/* </Button> */}
      //       <Box pad="xlarge" background="accent-1">
      //         <Attraction size="xlarge" href="#" />
      //       </Box>
      //     </Carousel>
      //   </Box>
      // )
    }
    // this.setState({infoCards:infoCards})

    const infoCardHeight = this.state.numOfX * 700 + 'px'
    return (
      <Grommet full theme={deepMerge(grommet, customToggleTheme)}>
        <Grid
          fill
          rows={['auto', 'full']}
          //   columns={['auto', 'flex']}
          columns={['3/4', '1/4']} // how many layout each column occupies
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
              Synthesis interface prototype (Add a logo?)
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
                if (
                  this.state.sidebar === false &&
                  this.state.editorValue != null
                ) {
                  //to be changed to true
                  {
                    this.getContextMapping(this.state.editorValue)
                  }
                }
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
              ref="thisEditor"
            />
            {/* updateSelectedValue={this.updateSelectedValue} */}
          </Box>

          {sidebar && (
            //   TODO: change the element css here and semantic too!!
            <Box gridArea="sidebar" pad="medium" height={infoCardHeight}>
              {/* Basically limitless height */}
              {infoCards}
              {/* <Box gap="medium" pad="medium" />
              <Box
                width="auto"
                animation={[
                  { type: 'fadeIn', duration: 1000 },
                  { type: 'slideLeft', size: 'xlarge', duration: 1000 },
                ]}
              >
                <Carousel>
                  <Button key={name} href="#" hoverIndicator>
                    <Box
                      pad={{
                        horizontal: 'medium',
                        vertical: 'small',
                      }}
                      height="small"
                      background={{ color: '#E03A3E', opacity: 'weak' }}
                      round="medium"
                    >
                      <Text>{this.state.editorSelectedValue}</Text>
                    </Box>
                  </Button>
                  <Button key="null-area-01" href="#" hoverIndicator>
                    <Box
                      pad={{
                        horizontal: 'medium',
                        vertical: 'small',
                      }}
                      height="small"
                      background={{ color: '#E03A3E', opacity: 'weak' }}
                      round="medium"
                    >
                      <Text>{this.state.editorSelectedValue}</Text>
                    </Box>
                  </Button>
                </Carousel>
              </Box>

              <Box gap="medium" pad="medium" />
              <Box
                width="auto"
                animation={[
                  { type: 'fadeIn', duration: 1000 },
                  { type: 'slideLeft', size: 'xlarge', duration: 1000 },
                ]}
              >
                <Carousel>
                  <Button key="null-area-10" href="#" hoverIndicator>
                    <Box
                      pad={{
                        horizontal: 'medium',
                        vertical: 'small',
                      }}
                      height="small"
                      background={{ color: '#E03A3E', opacity: 'weak' }}
                      round="medium"
                    >
                      <Text size="40px">
                        LOOK UP ↑ (logic incomplete, to be linked w/ State.json)
                      </Text>
                      <Text size="40px">LOOK DOWN ↓</Text>
                    </Box>
                  </Button>
                  <Button key="null-area-11" href="#" hoverIndicator>
                    <Box
                      pad={{
                        horizontal: 'medium',
                        vertical: 'small',
                      }}
                      height="small"
                      background={{ color: '#E03A3E', opacity: 'weak' }}
                      round="medium"
                    >
                      <Text>{name}</Text>
                    </Box>
                  </Button>
                </Carousel>
              </Box> */}
              <Box gap="medium" pad="medium" />
              <Box
                width="auto"
                animation={[
                  { type: 'fadeIn', duration: 1000 },
                  { type: 'slideLeft', size: 'xlarge', duration: 1000 },
                ]}
              >
                <Carousel>
                  <Button key="null-area-20" href="#" hoverIndicator>
                    <Box
                      pad={{
                        horizontal: 'medium',
                        vertical: 'small',
                      }}
                      height="small"
                      background={{ color: '#E03A3E', opacity: 'weak' }}
                      round="medium"
                      // animation={[
                      //   { type: 'fadeIn', duration: 300 },
                      //   { type: 'slideLeft', size: 'xlarge', duration: 150 },
                      // ]}
                    >
                      <Text size="40px">
                        Numbers of [x] in your editor: {this.state.numOfX}
                      </Text>
                    </Box>
                  </Button>
                  <Button key="null-area-21" href="#" hoverIndicator>
                    <Box
                      pad={{
                        horizontal: 'medium',
                        vertical: 'small',
                      }}
                      height="small"
                      background={{ color: '#E03A3E', opacity: 'weak' }}
                      round="medium"
                    >
                      <Text>{name}</Text>
                    </Box>
                  </Button>
                </Carousel>
                {/* It is associated w/ the last Carousal */}
                {/* <Solaris color="brand" size="large" /> */}
                {/* <Box direction="row-responsive" wrap={true}>
                  {someSolaris}
                </Box> */}
              </Box>
            </Box>
          )}
        </Grid>
      </Grommet>
    )
  }
}
