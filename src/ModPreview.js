import React from 'react'
import {connect} from 'react-redux'
import {TouchableHighlight, View} from 'react-native'
import ScaledImage from './ScaledImage'
import ModderCreditLink from './ModderCreditLink'
import {pushView} from './actions/view'
import {Card, Paragraph, useTheme, Text} from 'react-native-paper'

function ModPreview({mod: {code, variant, modder}, hash, pushView, character, view}) {
  const {colors} = useTheme()
  return (code && character)
    ? (
      <TouchableHighlight onPress={() => pushView('mod', {hash})} key={hash} style={{marginBottom: 20}}>
        <Card>
          <Card.Title title={`${character.variants[variant] ? character.variants[variant].title  || '' : ''} ${character.name || ''} (${code}_${variant})`} />
          <Card.Content style={{alignItems: 'center', paddingBottom: 20}}>
            <ScaledImage
              source={{uri: `https://phasmaexmachina.github.io/destiny-child-mods-archive/characters/${code}_${variant}/${hash}/static.png`}}
              height={300}
              />
          </Card.Content>
          <ModderCreditLink hash={hash} />
          {/* {modder &&
            <View style={{
              marginright: 10,
              alignSelf: 'flex-end'
            }}>
              <TouchableHighlight style={{paddingTop: 10, paddingBottom: 10, paddingRight: 20, paddingLeft: 20}} onPress={() => {
                if(view.data.modder != modder) pushView('modder', {modder})
              }}>
                <Paragraph>
                  by <Text style={{color: colors.primary}}>{modder}</Text>
                </Paragraph>
              </TouchableHighlight>
            </View>
          } */}
        </Card>
      </TouchableHighlight>
    )
  : null
}

export default connect(
  ({mods, characters, view}, {hash}) => ({
    mod: mods[hash] || {},
    character: mods[hash] && characters[mods[hash].code],
    hash,
    view
  }),
  ({pushView})
)(ModPreview)