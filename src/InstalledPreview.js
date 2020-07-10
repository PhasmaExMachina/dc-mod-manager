import React from 'react'
import {connect} from 'react-redux'
import {View, TouchableHighlight} from 'react-native'
import ScaledImage from './ScaledImage'
import {pushView} from './actions/view'
import {Card, List, Text, TouchableRipple} from 'react-native-paper'

function ModPreview({mod: {code, variant}, hash, pushView, character, target, characters}) {
  const [targetCode, targetVariant] = target.split('_'),
        targetCharacter = characters[targetCode],
        targetHash = targetCharacter.variants[targetVariant].mods[0]
  return (code && character)
    ? (
      <TouchableHighlight style={{marginBottom: 20}}>
        <Card>
          {/* <Card.Title title={`${character.variants[variant] ? character.variants[variant].title  || '' : ''} ${character.name || ''} (${code}_${variant})`} /> */}
          {/* <Button mode="contained" style={{marginBottom: 20}}>
            {targetCharacter.variants[targetVariant].title} {targetCharacter.name}
          </Button> */}
          <Card.Content style={{alignItems: 'center'}}>
            <View style={{flexDirection:'row', flexWrap:'wrap'}}>
              {targetHash &&
                <TouchableRipple onPress={() => pushView('mod', {hash: targetHash})}>
                  <View style={{alignItems: 'center', paddingTop: 10}}>
                    <ScaledImage
                      source={{uri: `https://phasmaexmachina.github.io/destiny-child-mods-archive/characters/${targetCode}_${targetVariant}/${targetHash}/static.png`}}
                      height={70}
                      style={{marginBottom: 10}}
                      />
                    <Text>{target}</Text>
                    <List.Icon icon="arrow-right" />
                  </View>
                </TouchableRipple>
              }
              <TouchableRipple onPress={() => pushView('mod', {hash})} style={{marginLeft: targetHash ? 20 : 0}}>
                <ScaledImage
                  source={{uri: `https://phasmaexmachina.github.io/destiny-child-mods-archive/characters/${code}_${variant}/${hash}/static.png`}}
                  height={250}
                  />
              </TouchableRipple>
            </View>
          </Card.Content>
        </Card>
      </TouchableHighlight>
    )
  : null
}

export default connect(
  ({mods, characters}, {hash}) => {
    const mod = mods[hash] || {}
    return {
      mod,
      character: mods[hash] && characters[mods[hash].code],
      hash,
      characters
    }
  },
  ({pushView})
)(ModPreview)