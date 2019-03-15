import * as React from 'react'
import fs = require('fs')

// Disabling most file system reading exercise

// import fs from 'fs'
// var text = fs.readFileSync('data/textToDisplay-page0010.json', 'utf8')
// console.log(text)
// import jsonfile = require('jsonfile')

import path = require('path')
import { PageText } from './PageText'
import { oc } from 'ts-optchain'

import {
  loadPdfPages,
  loadPageJson,
  PageOfText,
  checkGetPageNumsToLoad,
} from './io'

export interface LineOfText {
  id: string
  // pageId: number;
  lineIndex: number
  columnIndex: number
  left: number
  top: number
  width: number
  height: number
  text: string
  textIds: string[]
}

export interface Image {
  x: string
  y: string
  width: string
  height: string
  'xlink:href': string
  transform: string
  gTransform: string
}

interface Page {
  pageNumber: number
  viewport: any // pdfjs.PDFPageViewport;
  text: PageOfText
  page: any // pdfjs.PDFPageProxy;
  linesOfText: LineOfText[]
  // images: Image[];
  metadataToHighlight: PageOfText
}

import styled from 'styled-components'
import {
  NodeBase,
  PdfSegmentViewbox,
  makePdfSegmentViewbox,
  makeLink,
  aNode,
} from './creators'

const PdfViewerDefaults = {
  props: {
    pageNumbersToLoad: [] as number[],
    pathInfo: { pdfDir: '', pdfRootDir: '' },
    viewBox: {
      top: 110,
      left: 110,
      width: '100%' as number | string | undefined,
      height: '100%' as number | string | undefined,
      scale: 1,
    },
    showLineBoxes: false,
  },
  state: {
    scale: 2, // todo scale
    pages: [] as Page[],
    columnLefts: [] as number[],
    height2color: {} as any,
    fontNames2color: {} as any,
    meta: {} as {
      info: any
      metadata: any
    },
    outline: [] as any[],
    viewboxes: [] as PdfSegmentViewbox[],
    patches: [],
  },
}

export class Viewer extends React.Component<
  typeof PdfViewerDefaults.props,
  typeof PdfViewerDefaults.state
> {
  static defaultProps = PdfViewerDefaults.props
  state = { ...PdfViewerDefaults.state, scale: oc(this.props.viewBox).scale(1) }
  scrollRef = React.createRef<HTMLDivElement>()

  async componentDidMount() {
    await this.loadFiles()
    const { left, top } = this.props.viewBox
    this.scrollRef.current.scrollTo(left, top)
  }

  scale = (obj, keyNames: string[], prevScale, scale) => {
    const scaled = keyNames.reduce((all, keyName, ix) => {
      if (!obj.hasOwnProperty(keyName)) return all
      return { ...all, [keyName]: (obj[keyName] / prevScale) * scale }
    }, {})

    return scaled
  }

  scalePages = (pages: Page[], prevScale: number = 1, scale: number = 1) => {
    let keysToScale = ['height', 'left', 'top', 'width']

    let scaledPages = [] as Page[]
    for (let [ix, page] of pages.entries()) {
      const linesOfText = page.linesOfText.map(lot => {
        return {
          ...lot,
          ...this.scale(lot, keysToScale, prevScale, scale),
        }
      })
      const text = page.text.text.map(t => {
        return {
          ...t,
          ...this.scale(t, keysToScale, prevScale, scale),
        }
      })
      const viewport = page.page.getViewport(scale)
      scaledPages.push({ ...page, linesOfText, viewport })
    }
    return scaledPages
  }

  loadFiles = async () => {
    this.setState({ pages: [] })
    const {
      pageNumbersToLoad,
      pathInfo: { pdfDir, pdfRootDir },
    } = this.props

    // const dataa = require('../data/soylent-uist2010/userSegments.json')
    // console.log(dataa)
    const fullDirPath = path.join(pdfRootDir, pdfDir)
    const pdfPath = path.join(fullDirPath, pdfDir + '.pdf')

    // var seg = fs.readFileSync('data/soylent-uist2010/userSegments.json', 'utf8')
    const seg = JSON.parse(
      fs.readFileSync('data/soylent-uist2010/userSegments.json', 'utf8')
    )

    console.log(seg.numberOfPages)
    const pageNumbersToLoadFixed = checkGetPageNumsToLoad(
      seg.numberOfPages,
      pageNumbersToLoad
    )

    const [
      // pdfPages,
      linesOfText,
      textToDisplay,
      metadataToHighlight,
      columnLefts,
      // userSegments,
    ] = await Promise.all([
      // Xin refactored loadPageJson to have many magic numbers, to be changed soon!!
      loadPageJson('data/soylent-uist2010/', 'linesOfText', pageNumbersToLoad),
      loadPageJson(
        'data/soylent-uist2010/',
        'textToDisplay',
        pageNumbersToLoad
      ),
      loadPageJson(
        'data/soylent-uist2010/',
        'metadataToHighlight',
        pageNumbersToLoad
      ),
      JSON.parse(
        fs.readFileSync('data/soylent-uist2010/columnLefts.json', 'utf8')
      ),
      // loadPageJson('data/soylent-uist2010/', 'userSegments', pageNumbersToLoad),
    ])
    console.log(linesOfText)
    // console.log('pageNumbersToLoadFixed[i]' + pageNumbersToLoadFixed[0])

    let pages = [] as Page[]
    for (let i in linesOfText) {
      pages.push({
        linesOfText: linesOfText[i],
        page: null, //relies on pdf.js
        pageNumber: pageNumbersToLoadFixed[i],
        text: textToDisplay[i],
        viewport: null, // relies on pdf.js
        metadataToHighlight: metadataToHighlight[i],
      })
    }

    // if (this.state.scale !== 1) {
    //   const scaledPages = this.scalePages(pages, 1, this.state.scale)
    //   this.setState({ pages: scaledPages, columnLefts })
    // } else {
    //   this.setState({ pages, columnLefts })
    // }

    // TODO: scaledPage relies on viewPoint of pdf.js comment for now
    this.setState({ pages, columnLefts })
  }

  renderPages = () => {
    const { pages } = this.state //single or multiple pages
    const havePages = pages.length > 0
    if (!havePages) return null
    return pages.map((page, pageIx) => {
      // const { width, height } = { 612: any, 792: any } //page.viewport

      const width = 1024
      const height = 1500 // these are not screen size, but the PDF letter-size

      // const width = 612
      // const height = 792 // 2k screen size?

      return (
        <div
          key={page.pageNumber}
          style={{ width, height, position: 'relative' }}
        >
          <PageText // PageText is a set of text spans
            key={'text-' + page.pageNumber}
            scale={this.state.scale}
            pageOfText={page.text}
            linesOfText={page.linesOfText}
            metadataToHighlight={page.metadataToHighlight}
            // height={height}
          />
        </div>
      )
    })
  }

  render() {
    const { width, height } = this.props.viewBox
    // todo: set height and width and then scrollto
    return (
      <div
        ref={this.scrollRef} //this is where scroll functionality is enabled
        style={{
          maxWidth: width,
          maxHeight: height,
          boxSizing: 'border-box',
          overflow: 'scroll',
        }}
      >
        {this.renderPages()}
      </div>
    )
  }
}
