import React from 'react'
import {connect} from 'react-redux'
import {View, TouchableHighlight} from 'react-native'
import {Subheading, useTheme} from 'react-native-paper'
import {pushView} from './actions/view'
import ModPreview from './ModPreview'

function Character({character, pushView, code}) {
  const {colors} = useTheme()
  return character
    ? (
      <View style={{padding: 20}}>
        <View style={{paddingBottom: 20, flex: 1, flexDirection: 'row'}}>
          <TouchableHighlight onPress={() => pushView('characters')}>
            <Subheading style={{color: colors.primary}}>Characters</Subheading>
          </TouchableHighlight>
          <Subheading style={{marginLeft: 10, marginRight: 10}}>&gt;</Subheading>
          <Subheading>{character.name || character.code}</Subheading>
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