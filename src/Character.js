import React from 'react'
import {connect} from 'react-redux'
import {View, TouchableHighlight} from 'react-native'
import {Text, useTheme} from 'react-native-paper'
import {pushView} from './actions/view'
import ModPreview from './ModPreview'

function Character({character, pushView, code}) {
  const {colors} = useTheme()
  return character
    ? (
      <View style={{padding: 20}}>
        <View style={{paddingBottom: 20, flex: 1, flexDirection: 'row'}}>
          <TouchableHighlight onPress={() => pushView('mods')}>
            <Text style={{color: colors.primary}}>Mods</Text>
          </TouchableHighlight>
          <Text style={{marginLeft: 10, marginRight: 10}}>&gt;</Text>
          <Text>{character.name || character.code}</Text>
        </View>
        {Object.keys(character.variants).sort().map(variant => (
          <>
            {character.variants[variant].mods.map(hash => (
              <ModPreview code={code} variant={variant} hash={hash} />
            ))}
          </>
        ))}
      </View>
    )
    : null
}

export default connect(
  ({characters, view}) => ({
    character: characters[view.data.code],
    code: view.data.code
  }),
  {pushView}
)(Character)