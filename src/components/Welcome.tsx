import * as React from 'react'
import { render } from 'react-dom'
export interface HelloProps {
  note: any
}
import { Grommet, Box } from 'grommet'
// return <h5>{this.props.participantDetail[0].text}</h5>;
// A good tutorial on property/state https://charleslbryant.gitbooks.io/hello-react-and-typescript/content/Samples/ComponentPropsAndState.html

import RichAccordion from './RichAccordion'

export interface Detail {
  // TypeScript types: https://www.tutorialspoint.com/typescript/typescript_types.htm
  text: string
  score: number
}

// https://medium.freecodecamp.org/requiring-modules-in-node-js-everything-you-need-to-know-e7fbd119be8

export interface MetadataToHighlight {
  note: string
  participantDetail: Detail[] // in reality just a JSON string containing serialized
}

export class Welcome extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      note: this.props.note,
      participantDetail: this.props.participantDetail,
    }
  }

  render() {
    var numDetails = this.state.participantDetail.length
    // loop to return a list of HTML elements  https://stackoverflow.com/questions/29149169/how-to-loop-and-render-elements-in-react-js-without-an-array-of-objects-to-map
    const theme = {
      global: {
        font: {
          family: 'Roboto',
          size: '14px',
          height: '20px',
        },
      },
    }
    console.log(process.env.NODE_ENV)
    return (
      <div>
        <Grommet>
          {/* Something{' '}
          <Box
            direction="row"
            border={{ color: 'brand', size: 'large' }}
            pad="medium"
          >
            <Box pad="small" background="dark-3">
              <Box pad="large" background="yellow">
                Something
              </Box>
              <Box pad="large" background="green" />
            </Box>
            <Box pad="medium" background="light-3" />
          </Box> */}
        </Grommet>
        <RichAccordion
          note={this.state.note}
          participantDetail={this.state.participantDetail}
        />
        {this.state.participantDetail.map((item: Detail, index: any) => (
          // good practice: always have a key -> https://stackoverflow.com/questions/28329382/understanding-unique-keys-for-array-children-in-react-js
          <h5 key={index}>
            {item.text} Confidence {item.score}
          </h5>
        ))}
      </div>
    )
    // return <h5>{this.state.participantDetail[1].text}</h5>;
  }
}
