import * as React from "react";
import {render} from 'react-dom';
import * as ReactDOM from 'react-dom';
export interface HelloProps { note: any; }


export interface Detail {
    text: string
    score: any
}

export interface MetadataToHighlight {
    note: any
    participantDetail: Array<Detail> // in reality just a JSON string containing serialized 
}

export class Welcome extends React.Component<MetadataToHighlight, {}> {
    console.log({this.props.note});
    console.log({this.props.participantDetail});

    render() {
        return <h5>{this.props.participantDetail[0].text}</h5>;
    }
}
