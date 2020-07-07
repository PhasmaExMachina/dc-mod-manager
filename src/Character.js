import React from 'react'
import {connect} from 'react-redux'
import {View, TouchableHighlight} from 'react-native'
import {Subheading, useTheme, Headline} from 'react-native-paper'
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
            <Headline style={{marginBottom: 20, marginTop: 40}}>
              {/* {character.variants[variant].title} {character.name} ({character.code}_{variant}) */}
              {character.variants[variant].title} {character.name} - {
                code.match(/^s/)
                  ? 'Spa'
                  :  variant === '00'
                    ? 'Story'
                    : variant === '01'
                      ? !character.starLevel ? 'Story' : 'Rank A-E'
                      : variant === '02'
                        ? 'Rank S'
                        : variant.match(/^1[0-9]$/)
                          ? 'Costume'
                          : variant === '89'
                            ? 'Raid'
                            : '?'
              }
            </Headline>
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