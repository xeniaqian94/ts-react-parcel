import * as React from 'react'
import { render } from 'react-dom'
import './index.css'


/*
For the below code block, I am trying to load in pdf.js
*/


// TODO: qs why should we add css here??
import './components/RichEditorExample.css'
import { Grommet, Box, Grid, Button, Text } from 'grommet'


// import * as _pdfjs from "pdfjs-dist"
var pdfjsLib = require('pdfjs-dist');
console.log(pdfjsLib)

pdfjsLib.workerSrc='pdfjs-dist/build/pdf.worker.js'
pdfjsLib.GlobalWorkerOptions.workerSrc='pdfjs-dist/build/pdf.worker.js'

// pdfjsLib.workerSrc=require('pdfjs-dist/build/pdf.worker') //"./node_modules/pdfjs-dist/build/pdf.worker.entry.js"
// pdfjsLib.workerSrc= '//mozilla.github.io/pdf.js/build/pdf.worker.js';

// pdfjsLib.setState({workerSrc:'pdfjs-dist/build/pdf.worker'})
console.log(pdfjsLib.workerSrc)


var loadingTask = pdfjsLib.getDocument("./data/soylent-uist2010.pdf");
// console.log(pdfjsLib.GlobalWorkerOptions.workerSrc)

var PdfjsWorker = require("pdfjs-dist/lib/pdf.worker.js");
if (typeof window !== "undefined" && "Worker" in window) {
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = PdfjsWorker //new PdfjsWorker();
}

console.log(PdfjsWorker)

// pdfjsLib.workerSrc="./node_modules/pdfjs-dist/build/pdf.worker.entry.js"




// import data = require('../data/metadataToHighlight-soylent.json')
// import dataa = require('../data/soylent-uist2010/userSegments.json')
// console.log(dataa)
// console.log(data)

import { Welcome } from './components/Welcome'
import { PageText } from './components/PageText'
import { Viewer } from './components/Viewer'
import { MyEditor } from './components/MyEditor'
import { RichEditorExample } from './components/RichEditorExample'
import { SynthesisLayoutGrid } from './components/SynthesisLayoutGrid'
// const word = data.note
// const participantDetails = data.participantDetail
// console.log(word)

// ReactDOM.render(<MyEditor />, document.getElementById('container'))
const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px',
    },
  },
}

render(

  // <MyEditor />,
  <Grommet theme={theme}>
    <SynthesisLayoutGrid />
  </Grommet>,

  document.getElementById('example')
)
