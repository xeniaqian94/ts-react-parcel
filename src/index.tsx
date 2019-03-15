import * as React from 'react'
import { render } from 'react-dom'
import './index.css'

import data = require('../data/metadataToHighlight-soylent.json')
import dataa = require('../data/soylent-uist2010/userSegments.json')
// console.log(dataa)
console.log(data)

import { Welcome } from './components/Welcome'
import { PageText } from './components/PageText'
import { Viewer } from './components/Viewer'

const word = data.note
const participantDetails = data.participantDetail

console.log(word)

render(
  // <Welcome note={word} participantDetail={participantDetails} />,

  <Viewer
    pathInfo={{ pdfRootDir: 'data', pdfDir: 'soylent-uist2010' }}
    pageNumbersToLoad={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
    viewBox={{
      left: 107.148 - 20,
      top: 490.84180000000083 - 20,
      width: '50vw',
      height: '100%',
      scale: 2,
    }}
    showLineBoxes={true}
  />,

  document.getElementById('example')
)
