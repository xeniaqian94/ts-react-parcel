import fs = require('fs')
console.log(fs)
var text = fs.readFileSync('src/components/creators.ts', 'utf8')
// console.log(text)
import os = require('os')
import path = require('path')
import glob = require('glob')
import uuidv1 = require('uuid/v1')
import jsonfile = require('jsonfile')
export type TextItemToDisplay = {
  str: string // the text
  dir: string // text direction
  width: number
  transform: number[] // [fontheight, rotation?, rotation?, fontwidth, x, y ]
  id: string // we made this
  top: number
  left: number
  fallbackFontName: string
  style: { fontFamily: string; ascent: number; descent: number }
  fontHeight: number
  fontWidth: number
  fontName: string
  scaleX: number
}

export type PageOfText = {
  pageNumber: number
  text: TextItemToDisplay[]
  viewportFlat: {
    width: number
    height: number
    xMin: number
    yMin: number
    xMax: number
    yMax: number
  }
}

export const checkGetPageNumsToLoad = (
  numPages,
  pageNumbersToLoad: number[]
) => {
  // Compiler option downLevelIteration? https://github.com/Microsoft/TypeScript/issues/18247
  const allPageNumbers = [...Array(numPages).keys()].map(x => x + 1)
  const willLoadAllPages = pageNumbersToLoad.length === 0
  const pageNumPropsOk =
    !willLoadAllPages &&
    Math.min(...pageNumbersToLoad) >= 0 &&
    Math.max(...pageNumbersToLoad) <= Math.max(...allPageNumbers)

  let pageNumbers
  if (willLoadAllPages) {
    pageNumbers = allPageNumbers
  } else {
    pageNumbers = pageNumPropsOk ? pageNumbersToLoad : allPageNumbers
  }

  return pageNumbers
}

// export const loadPdfPages = async (
//   path: string,
//   pageNumbersToLoad: number[] = [],
//   scale = 1
// ) => {
//   const pdf = await pdfjs.getDocument(path)
//   // const allPageNumbers = [...Array(pdf.numPages).keys()].map(x => x + 1);
//   // const willLoadAllPages = pageNumbersToLoad.length === 0;
//   // const pageNumPropsOk =
//   //   !willLoadAllPages &&
//   //   Math.min(...pageNumbersToLoad) >= 0 &&
//   //   Math.max(...pageNumbersToLoad) <= Math.max(...allPageNumbers);

//   // let pageNumbers;
//   // if (willLoadAllPages) {
//   //   pageNumbers = allPageNumbers;
//   // } else {
//   //   pageNumbers = pageNumPropsOk ? pageNumbersToLoad : allPageNumbers;
//   // }
//   const pageNumbers = checkGetPageNumsToLoad(pdf.numPages, pageNumbersToLoad)
//   let pages = [] as _pdfjs.PDFPageProxy[]
//   for (const pageNumber of pageNumbers) {
//     const page = await pdf.getPage(pageNumber)
//     pages.push(page)
//   }
//   return pages
// }

export const existsElseMake = async (
  path: string,
  promise: _pdfjs.PDFPromise<any> | Promise<any> | {},
  overwrite = false
) => {
  const fileExists = await fs.pathExists(path)

  if (!fileExists || overwrite) {
    console.log('making ', path)
    const data = await promise
    await jsonfile.writeFile(path, data)
    return true
  } else {
    return false
  }
}

// export const loadPageJson = async (
//   dir: string,
//   filePrefix: 'textToDisplay' | 'linesOfText' | 'userSegments',
//   pageNumbersToLoad: number[] = []
// ) => {
//   // todo: make sure filePrefix + ".json" gets made when all pages are done
//   // await existsElseMake(
//   //   path.join(dir, filePrefix + '.json'),
//   //   preprocessPdfs([dir])
//   // )

//   //fs.readFile is not a function? https://github.com/parcel-bundler/parcel/issues/135
//   //https://stackoverflow.com/questions/43048113/use-fs-in-typescript/43048371
//   const finalFile = await jsonfile.readFileSync(
//     path.join(dir, filePrefix + '.json')
//   )
//   const numberOfPages = finalFile.numberOfPages
//   const pageNumbers = checkGetPageNumsToLoad(numberOfPages, pageNumbersToLoad)

//   let pages = []
//   for (let pageNum of pageNumbers) {
//     const pageId = zeroPad(pageNum, 4)
//     const page = await jsonfile.readFile(
//       `${dir}/${filePrefix}-page${pageId}.json`
//     ) //todo PageToDisplay type
//     pages.push(page)
//   }
//   return pages // sorted by page number
// }

export const zeroPad = (aNumber: number, nDigits: number) => {
  const str = String(aNumber)
  const nZeros = nDigits - str.length
  if (nZeros <= 0) {
    return str
  } else {
    return (
      Array(nZeros)
        .fill(0)
        .join('') + str
    )
  }
}

export const loadPageJson = async (
  dir: string,
  filePrefix:
    | 'textToDisplay'
    | 'linesOfText'
    | 'userSegments'
    | 'metadataToHighlight',
  pageNumbersToLoad: number[] = []
) => {
  let pages = []
  if (filePrefix === 'textToDisplay') {
    let page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/textToDisplay-page0001.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/textToDisplay-page0002.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/textToDisplay-page0003.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/textToDisplay-page0004.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/textToDisplay-page0005.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/textToDisplay-page0006.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/textToDisplay-page0007.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/textToDisplay-page0008.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/textToDisplay-page0009.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/textToDisplay-page0010.json',
        'utf8'
      )
    )
    pages.push(page)
  } else if (filePrefix === 'linesOfText') {
    let page = JSON.parse(
      fs.readFileSync('data/soylent-uist2010/linesOfText-page0001.json', 'utf8')
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync('data/soylent-uist2010/linesOfText-page0002.json', 'utf8')
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync('data/soylent-uist2010/linesOfText-page0003.json', 'utf8')
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync('data/soylent-uist2010/linesOfText-page0004.json', 'utf8')
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync('data/soylent-uist2010/linesOfText-page0005.json', 'utf8')
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync('data/soylent-uist2010/linesOfText-page0006.json', 'utf8')
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync('data/soylent-uist2010/linesOfText-page0007.json', 'utf8')
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync('data/soylent-uist2010/linesOfText-page0008.json', 'utf8')
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync('data/soylent-uist2010/linesOfText-page0009.json', 'utf8')
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync('data/soylent-uist2010/linesOfText-page0010.json', 'utf8')
    )
    pages.push(page)
  } else if (filePrefix === 'userSegments') {
    let page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/userSegments-page0001.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/userSegments-page0002.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/userSegments-page0003.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/userSegments-page0004.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/userSegments-page0005.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/userSegments-page0006.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/userSegments-page0007.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/userSegments-page0008.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/userSegments-page0009.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/userSegments-page0010.json',
        'utf8'
      )
    )
    pages.push(page)
  } else if (filePrefix === 'metadataToHighlight') {
    let page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/metadataToHighlight-page0001.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/metadataToHighlight-page0002.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/metadataToHighlight-page0003.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/metadataToHighlight-page0004.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/metadataToHighlight-page0005.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/metadataToHighlight-page0006.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/metadataToHighlight-page0007.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/metadataToHighlight-page0008.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/metadataToHighlight-page0009.json',
        'utf8'
      )
    )
    pages.push(page)

    page = JSON.parse(
      fs.readFileSync(
        'data/soylent-uist2010/metadataToHighlight-page0010.json',
        'utf8'
      )
    )
    pages.push(page)
  }

  return pages // sorted by page number
}
