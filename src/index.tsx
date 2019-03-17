import * as React from 'react'
import { render } from 'react-dom'
import './index.css'

// TODO: qs why should we add css here??
import './components/RichEditorExample.css'
import { Grommet, Box, Grid, Button, Text } from 'grommet'
import data = require('../data/metadataToHighlight-soylent.json')
import dataa = require('../data/soylent-uist2010/userSegments.json')
// console.log(dataa)
console.log(data)

import { Welcome } from './components/Welcome'
import { PageText } from './components/PageText'
import { Viewer } from './components/Viewer'
import { MyEditor } from './components/MyEditor'
import { RichEditorExample } from './components/RichEditorExample'
import { SynthesisLayoutGrid } from './components/SynthesisLayoutGrid'
const word = data.note
const participantDetails = data.participantDetail

console.log(word)

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
  // This is the Grommet toy example
  // <Welcome note={word} participantDetail={participantDetails} />,

  // This is the PDF Canvas
  // <Viewer
  //   pathInfo={{ pdfRootDir: 'data', pdfDir: 'soylent-uist2010' }}
  //   pageNumbersToLoad={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
  //   viewBox={{
  //     left: 107.148 - 20,
  //     top: 490.84180000000083 - 20,
  //     width: '50vw',
  //     height: '100%',
  //     scale: 2,
  //   }}
  //   showLineBoxes={true}
  // />,

  // <MyEditor />,
  <Grommet theme={theme}>
    {/* <Grid columns="small" gap="small">
      <RichEditorExample />
      <Box pad="large" background="brand">
        Something as recontextualize info
      </Box>
    </Grid> */}
    <SynthesisLayoutGrid />
  </Grommet>,
  document.getElementById('example')
)
