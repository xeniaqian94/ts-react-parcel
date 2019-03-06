import * as React from 'react'
import { render } from 'react-dom'
import './index.css'

import data = require('../data/metadataToHighlight-soylent.json')
console.log(data)

import { Welcome } from './components/Welcome'

const word = data.note
const participantDetails = data.participantDetail

console.log(word)

render(
  <Welcome note={word} participantDetail={participantDetails} />,
  document.getElementById('example')
)
