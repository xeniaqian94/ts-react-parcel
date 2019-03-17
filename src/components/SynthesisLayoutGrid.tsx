import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { RichEditorExample } from './RichEditorExample'

import { Grommet, Box, Button, Grid, Text } from 'grommet'
import { grommet } from 'grommet/themes'

export class SynthesisLayoutGrid extends React.Component<any, any> {
  state = { sidebar: true }

  render() {
    const { sidebar } = this.state
    return (
      <Grommet full theme={grommet}>
        <Grid
          fill
          rows={['auto', 'flex']}
          //   columns={['auto', 'flex']}
          columns={['3/4', '1/4']} // how many layout each column occupies
          areas={[
            { name: 'header', start: [0, 0], end: [1, 0] },

            { name: 'main', start: [0, 1], end: [0, 1] },
            { name: 'sidebar', start: [1, 1], end: [1, 1] },
          ]}
        >
          <Box
            gridArea="header"
            direction="row"
            align="center"
            justify="between"
            pad={{ horizontal: 'medium', vertical: 'small' }}
            background="dark-2"
          >
            <Text>Synthesis interface prototype</Text>
            <Button onClick={() => this.setState({ sidebar: !sidebar })}>
              <Text size="large">Re-contextualize/De-contextualize</Text>
            </Button>
          </Box>
          <Box gridArea="main" justify="center" align="center">
            <Text>main</Text>
            <RichEditorExample />
          </Box>
          {sidebar && (
            //   TODO: change the element css here and semantic too!!

            <Box
              gridArea="sidebar"
              background="dark-3"
              width="auto"
              animation={[
                { type: 'fadeIn', duration: 300 },
                { type: 'slideLeft', size: 'xlarge', duration: 150 },
              ]}
            >
              {[
                'First contextualize items',
                'Second contextualize items',
                'Third contextualize items',
              ].map(name => (
                <Button key={name} href="#" hoverIndicator>
                  <Box
                    pad={{
                      horizontal: 'medium',
                      vertical: 'small',
                    }}
                    height="small"
                  >
                    <Text>{name}</Text>
                  </Box>
                </Button>
              ))}
            </Box>
          )}
        </Grid>
      </Grommet>
    )
  }
}
