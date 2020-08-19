import React from 'react'
import {View} from 'react-native'
import {Headline, Text, Button} from 'react-native-paper'
import {connect} from 'react-redux'
import InstalledPreview from './InstalledPreview'
import {pushView} from './actions/view'
import { detectInstalled } from './lib/installed'

const InstalledMods = ({installed, characters, pushView}) => {
  return (
    <View style={{margin: 20}}>
      <Headline style={{marginBottom:20}}>Installed Mods</Headline>
      {Object.keys(installed).length
        ? Object.keys(installed).sort().map(target =>
          <InstalledPreview hash={installed[target].hash} key={target} target={target} />
        )
        : <>
          <Text>It doesn't look like you have installed any mods with this app yet (or since install tracking was implemented). Installed mods should start showing up here once you install some.</Text>
          <Button mode="contained" style={{marginTop: 20, width: '100%'}} onPress={detectInstalled}>
            Detect Installed Mods
          </Button>
        </>
      }
    </View>
  )
}

export default connect(
  ({installed, characters}) => ({installed, characters}),
  {pushView}
)(InstalledMods)