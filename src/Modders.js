import React from 'react'
import {connect} from 'react-redux'
import {View, TouchableHighlight} from 'react-native'
import {Subheading, useTheme, Headline, Text, Button} from 'react-native-paper'
import {pushView} from './actions/view'
import ModPreview from './ModPreview'
import InstalledPreview from './InstalledPreview'

const Modders = ({modders, pushView}) => {
  console.log(Object.keys(modders))
  return modders ? (
    <View style={{padding: 20}}>
      <Headline style={{marginBottom: 20}}>
      Modders
      </Headline>
      {Object.keys(modders).sort().map(modder =>
        <Button onPress={() => pushView('modder', {modder})} style={{marginBottom: 10}}>
          {modder} - {modders[modder].mods.length} mods
        </Button>
      )}
    </View>
  ) : <Text style={{margin: 20}}>Loading modders ...</Text>
}

export default connect(
  ({modders}) => ({modders}),
  {pushView}
)(Modders)