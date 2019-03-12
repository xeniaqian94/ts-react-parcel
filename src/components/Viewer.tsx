import * as React from 'react'
import fs = require('fs')
// import fs from 'fs'
var text = fs.readFileSync('data/textToDisplay-page0010.json', 'utf8')
// console.log(text)
import jsonfile = require('jsonfile')
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
    // const seg = await jsonfile.readFile(
    //   // require(path.join(fullDirPath, 'userSegments.json'))
    //   path.join(fullDirPath, 'userSegments.json')
    // )
    const filePath = path.join(fullDirPath, 'userSegments.json')
    console.log(filePath)
    console.log(filePath === 'data/soylent-uist2010/userSegments.json')
    // var seg = fs.readFileSync('data/soylent-uist2010/userSegments.json', 'utf8')
    var seg = fs.readFileSync(filePath, 'utf8')

    console.log(seg)
    const pageNumbersToLoadFixed = checkGetPageNumsToLoad(
      seg.numberOfPages,
      pageNumbersToLoad
    )

    const [
      // pdfPages,
      linesOfText,
      textToDisplay,
      columnLefts,
      userSegments,
    ] = await Promise.all([
      // loadPdfPages(pdfPath, pageNumbersToLoad),
      //fs.readFile is not a function? https://github.com/parcel-bundler/parcel/issues/135
      //https://stackoverflow.com/questions/43048113/use-fs-in-typescript/43048371
      loadPageJson(fullDirPath, 'linesOfText', pageNumbersToLoad),
      loadPageJson(fullDirPath, 'textToDisplay', pageNumbersToLoad),
      jsonfile.readFile(path.join(fullDirPath, 'columnLefts.json')),
      loadPageJson(fullDirPath, 'userSegments', pageNumbersToLoad),
    ])

    let pages = [] as Page[]
    for (let i in linesOfText) {
      pages.push({
        linesOfText: linesOfText[i],
        // page: pdfPages[i],
        page: null,
        pageNumber: pageNumbersToLoadFixed[i],
        text: textToDisplay[i],
        viewport: null,
        // viewport: pdfPages[i].getViewport(this.state.scale),
      })
    }
    if (this.state.scale !== 1) {
      const scaledPages = this.scalePages(pages, 1, this.state.scale)
      this.setState({ pages: scaledPages, columnLefts })
    } else {
      this.setState({ pages, columnLefts })
    }
  }

  renderPages = () => {
    const { pages } = this.state
    const havePages = pages.length > 0
    if (!havePages) return null
    return pages.map((page, pageIx) => {
      const { width, height } = page.viewport
      return (
        <div
          key={page.pageNumber}
          style={{ width, height, position: 'relative' }}
        >
          <PageText
            key={'text-' + page.pageNumber}
            scale={this.state.scale}
            pageOfText={page.text}
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
        ref={this.scrollRef}
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
