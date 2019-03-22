import * as React from 'react'

import {
  Box,
  Button,
  Collapsible,
  Heading,
  Grommet,
  Text,
  Anchor,
} from 'grommet'
import { grommet } from 'grommet/themes'

export class SimpleCollapsible extends React.Component<any, any> {
  state = {
    open: false,
  }

  render() {
    const { open } = this.state
    const urlSrc =
      'https://cdn.pixabay.com/photo/2017/07/24/02/40/pink-roses-2533389__340.jpg'
    return (
      <Grommet theme={grommet}>
        <Box align="start" gap="small">
          <Button
            primary
            onClick={() => this.setState({ open: !open })}
            label="Toggle"
          />
          <Collapsible open={open} {...this.props}>
            <Box
              background="light-2"
              round="medium"
              pad="medium"
              align="center"
              justify="center"
            >
              <Text>
                <Anchor> This is </Anchor>This is a box inside a Collapsible
                component
              </Text>
              <img src={urlSrc} />
            </Box>
          </Collapsible>
          <Text>This is other content outside the Collapsible box</Text>
        </Box>
      </Grommet>
    )
  }
}
