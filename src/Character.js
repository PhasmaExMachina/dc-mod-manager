import React from 'react'
import {connect} from 'react-redux'
import {View, TouchableHighlight} from 'react-native'
import {Subheading, useTheme, Headline, Text} from 'react-native-paper'
import {pushView} from './actions/view'
import ModPreview from './ModPreview'
import InstalledPreview from './InstalledPreview'

function Character({character, pushView, code, installed}) {
  const {colors} = useTheme(),
        installedVariants = character && Object.keys(character.variants)
          .reduce((acc, variant) => {
            const target = character.code + '_' + variant
            if(installed[target]) {
              acc[target] = installed[target]
            }
            return acc
          }, {})
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
        <Headline style={{marginBottom: 20}}>
          Installed {character.name || character.code} Mods
        </Headline>
        {Object.keys(installedVariants).length
          ? Object.keys(installedVariants).sort().map(target =>
              <InstalledPreview hash={installedVariants[target].hash} target={target} />
            )
          : <Text>It doesn't look like you've installed any mods for {character.name || character.code} yet.</Text>
        }
        {Object.keys(character.variants).sort().map(variant => (
          <View key={variant}>
            <TouchableHighlight onPress={() =>
            {} //  pushView('variant', {code, variant})
            }>
              <Headline style={{marginBottom: 20, marginTop: 40}}>
                {/* {character.variants[variant].title} {character.name} ({character.code}_{variant}) */}
                {character.code}_{variant} {character.variants[variant].title} {character.name || '?'} Mods
              </Headline>
            </TouchableHighlight>
            {character.variants[variant].mods.map(hash => (
              <ModPreview code={code} variant={variant} hash={hash} key={hash} />
            ))}
          </View>
        ))}
      </View>
    )
    : null
}

export default connect(
  ({characters, installed, view}) => ({
    character: characters[view.data.code],
    code: view.data.code,
    installed
  }),
  {pushView}
)(Character)