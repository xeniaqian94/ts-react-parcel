import * as React from 'react'
import styled from 'styled-components'
import { TextItemToDisplay, PageOfText } from './io'
import { LineOfText } from './Viewer'
import { Page } from 'csstype'

const PageTextContainer = styled('div')<{ height: number; width: number }>`
  position: absolute;
  height: ${props => props.height + 'px'};
  width: ${props => props.width + 'px'};
`

class AutoScaledText extends React.Component<{
  textItem: TextItemToDisplay
  scale: number
}> {
  divRef = React.createRef<HTMLDivElement>()
  state = {
    scaleX: 1,
    offsetY: 0,
    opacity: 1.0,
  }

  computeStyle = (
    textItem: TextItemToDisplay,
    scale: number,
    scaleX: number
  ): React.CSSProperties => {
    return {
      height: '1em',
      fontFamily: `${textItem.fontName}, ${textItem.fallbackFontName}}`,
      fontSize: `${textItem.fontHeight * scale}px`,
      position: 'absolute',
      top: textItem.top * scale + 1 + Math.round(textItem.style.ascent * scale),
      left: textItem.left * scale,
      transform: `scaleX(${scaleX})`,
      transformOrigin: 'left bottom',
      whiteSpace: 'pre',
      color: 'grey',
      // userSelect: "none",
      outline: '1px solid grey',
    }
  }

  componentDidMount() {
    // domWidth will be a bit off on the first go, so we scale based on how big
    // the canvas text fragment is. This lines up the divText+canvas.
    const domWidth = this.divRef.current.getBoundingClientRect()['width']
    const scaleX = (this.props.textItem.width * this.props.scale) / domWidth
    if (scaleX !== Infinity) this.setState({ scaleX })
  }

  render() {
    const { textItem, scale } = this.props

    return (
      <div
        ref={this.divRef}
        style={this.computeStyle(textItem, scale, this.state.scaleX)}
      >
        {this.props.children}
      </div>
    )
  }
}

class HighlightedBoundingBox extends React.Component<{
  textItem: TextItemToDisplay
  scale: number
}> {
  divRef = React.createRef<HTMLDivElement>()
  state = {
    scaleX: 1,
    offsetY: 0,
    opacity: 1.0,
  }

  computeStyle = (
    textItem: TextItemToDisplay,
    scale: number,
    scaleX: number
  ): React.CSSProperties => {
    return {
      height: '1em',
      fontFamily: `${textItem.fontName}, ${textItem.fallbackFontName}}`,
      fontSize: `${textItem.fontHeight * scale}px`,
      position: 'absolute',
      top: textItem.top * scale + 1 + Math.round(textItem.style.ascent * scale),
      left: textItem.left * scale,
      transform: `scaleX(${scaleX})`,
      transformOrigin: 'left bottom',
      whiteSpace: 'pre',
      color: 'transparent',
      // userSelect: "none",
      background: 'green',
      outline: '1px solid grey',
      opacity: 0.5,
    }
  }

  componentDidMount() {
    // domWidth will be a bit off on the first go, so we scale based on how big
    // the canvas text fragment is. This lines up the divText+canvas.
    const domWidth = this.divRef.current.getBoundingClientRect()['width']
    const scaleX = (this.props.textItem.width * this.props.scale) / domWidth
    if (scaleX !== Infinity) this.setState({ scaleX })
  }

  render() {
    const { textItem, scale } = this.props

    return (
      <div
        ref={this.divRef}
        style={this.computeStyle(textItem, scale, this.state.scaleX)}
      >
        {this.props.children}
      </div>
    )
  }
}

const PageTextDefaults = {
  props: {
    pageOfText: {} as PageOfText,
    // width: 0,
    // height: 0,
    scale: 1,
    linesOfText: [],
    metadataToHighlight: {} as PageOfText,
  },
  state: {},
}

// todo: solent superscript and text out of order even with highlight select
export class PageText extends React.Component<
  typeof PageTextDefaults.props,
  typeof PageTextDefaults.state
> {
  static defaultProps = PageTextDefaults.props
  state = PageTextDefaults.state

  render() {
    const { width, height } = this.props.pageOfText.viewportFlat
    // const width = 612
    // const height = 792

    const { scale } = this.props
    return (
      <PageTextContainer width={width * scale} height={height * scale}>
        {/* Below are original text box  */}
        {this.props.pageOfText.text.map((textItem, i) => {
          return (
            <AutoScaledText
              key={i}
              textItem={textItem}
              scale={this.props.scale}
            >
              {textItem.str}
            </AutoScaledText>
          )
        })}

        {/* Below are metadataToHighlight */}
        {this.props.metadataToHighlight.text.map((textItem, i) => {
          return (
            <HighlightedBoundingBox
              key={i}
              textItem={textItem}
              scale={this.props.scale}
            >
              {textItem.str}{' '}
            </HighlightedBoundingBox>
          )
        })}

        {/* TODO: this is an exercise to render bounding box based on linesOfText */}
        {/* {this.props.linesOfText.map((textItem: LineOfText, i) => {
          if (i % 10 === 0) {
            const fakeTextItem: TextItemToDisplay = {
              str: textItem.text,
              dir: 'ltr',
              width: textItem.width,
              transform: [
                10.02,
                0,
                0,
                10.02,
                125.39249999999994,
                531.3499199999999,
              ],
              fontName: 'g_d3_f34',
              id: '0004-0024' + { i },
              top: textItem.top,
              left: textItem.left,
              fontHeight: 10.02,
              fontWidth: 10.02,
              scaleX: 1,
              fallbackFontName: 'sans-serif',
              style: {
                fontFamily: 'serif',
                ascent: 0.89111328125,
                descent: -0.21630859375,
              },
            }
            return (
              <HighlightedBoundingBox
                key={i}
                textItem={fakeTextItem}
                scale={this.props.scale}
              >
                {textItem.text}
              </HighlightedBoundingBox>
            )
          }
        })} */}
      </PageTextContainer>
    )
  }
}
