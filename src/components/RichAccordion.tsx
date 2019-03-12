import * as React from 'react'
import { render } from 'react-dom'

export interface Detail {
  // TypeScript types: https://www.tutorialspoint.com/typescript/typescript_types.htm
  text: string
  score: number
}

import {
  Bookmark,
  CircleInformation,
  FormSubtract,
  FormAdd,
  User,
} from 'grommet-icons'

import {
  Accordion,
  AccordionPanel,
  Box,
  Grommet,
  Heading,
  Text,
  TextInput,
  ThemeContext,
} from 'grommet'

import { grommet } from 'grommet/themes'

const spinning = (
  <svg
    version="1.1"
    viewBox="0 0 32 32"
    width="32px"
    height="32px"
    fill="#333333"
  >
    <path
      opacity=".25"
      d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4"
    />
    <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z">
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 16 16"
        to="360 16 16"
        dur="0.8s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
)

const loading = (
  <Box align="center" justify="center" style={{ height: '100px' }}>
    {spinning}
  </Box>
)

const richAccordionTheme = {
  accordion: {
    icons: {
      collapse: FormSubtract,
      expand: FormAdd,
    },
  },
}

class RichPanel extends React.Component<any, any> {
  state = {
    hovering: false,
  }

  renderPanelTitle = () => {
    const { icon, label } = this.props
    const { hovering } = this.state
    return (
      <Box
        direction="row"
        align="center"
        gap="small"
        pad={{ horizontal: 'small' }}
      >
        {icon}
        <Heading level={'4'} color={hovering ? 'dark-1' : 'dark-3'}>
          {label}
        </Heading>
      </Box>
    )
  }

  render() {
    const { children } = this.props
    return (
      <AccordionPanel
        label={this.renderPanelTitle()}
        onMouseOver={() => this.setState({ hovering: true })}
        onMouseOut={() => this.setState({ hovering: false })}
        onFocus={() => this.setState({ hovering: true })}
        onBlur={() => this.setState({ hovering: false })}
      >
        {children}
      </AccordionPanel>
    )
  }
}

export default class RichAccordion extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      note: this.props.note,
      participantDetail: this.props.participantDetail,
      highlightLoaded: false,
    }
    // concatenate strings https://stackoverflow.com/questions/27565056/es6-template-literals-vs-concatenated-strings
    // console.log('note: this.props.note,' + this.state.note)
  }

  render() {
    const { highlightLoaded } = this.state
    return (
      <Grommet full theme={grommet}>
        <Box fill direction="row">
          <Box basis="medium" border="all">
            <Box
              flex={false}
              border="bottom"
              background="light-2"
              as="header"
              pad={{ horizontal: 'small' }}
            >
              <Heading level={'3'}>
                <strong># Metadata Panel</strong>
              </Heading>
            </Box>
            <ThemeContext.Extend value={richAccordionTheme}>
              <Accordion
                multiple
                onActive={activeIndexes => {
                  if (activeIndexes.includes(1)) {
                    // give sometime to emulate an async call
                    setTimeout(() => {
                      this.setState({ highlightLoaded: true })
                    }, 1000)
                  }
                }}
              >
                <RichPanel icon={<CircleInformation />} label="Evaluation Metrics">
                  <Box
                    pad={{
                      bottom: 'medium',
                      horizontal: 'small',
                      top: 'small',
                    }}
                    gap="medium"
                  >
                    <Box gap="xsmall">
                      {/* <Text color="dark-3">
                        <strong>Purpose</strong>
                      </Text> */}
                      <Text>
                        Unimplemented
                      </Text>
                    </Box>
                  </Box>
                </RichPanel>
                <RichPanel
                  icon={<Bookmark color="accent-1" />}
                  label="Participant Details"
                >
                  {highlightLoaded ? (
                    <Box
                      pad={{
                        bottom: 'medium',
                        horizontal: 'small',
                        top: 'small',
                      }}
                      gap="medium"
                      overflow="auto"
                      style={{ maxHeight: '400px' }}
                    >
                      {this.state.participantDetail.map(
                        (item: Detail, index: any) => (
                          // good practice: always have a key -> https://stackoverflow.com/questions/28329382/understanding-unique-keys-for-array-children-in-react-js
                          // <Box>
                            <text size="xsmall" color="dark-3" key='RichAccordion'{index}>
                              {index+1}: {item.text} (Confidence <strong>{item.score.toFixed(2)}</strong>)
                            </text>
                          // </Box>
                        )
                      )}
                    </Box>
                  ) : (
                    loading
                  )}
                </RichPanel>
                <RichPanel
                  icon={<User color="accent-2" />}
                  label="Parameter Settings"
                >
                  <Box
                    pad={{
                      bottom: 'medium',
                      horizontal: 'small',
                      top: 'small',
                    }}
                    gap="medium"
                  >
                    Yeah believe me, this model has 2,000 nodes.
                  </Box>
                </RichPanel>
              </Accordion>
            </ThemeContext.Extend>
          </Box>
        </Box>
      </Grommet>
    )
  }
}
