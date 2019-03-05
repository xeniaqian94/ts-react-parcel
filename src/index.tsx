import * as React from 'react';
import {render} from 'react-dom';
import './index.css';
import * as data from '../data/metadataToHighlight-soylent.json';

import { Welcome } from "./components/Welcome";

const word = data.note;
const participantDetails=data.participantDetail;

console.log(word); 

render(<Welcome note={word}  participantDetail= {participantDetails} />, document.getElementById('example'));