import React from 'react'
import {connect} from 'react-redux'
import {TouchableHighlight} from 'react-native'
import ScaledImage from './ScaledImage'
import {pushView} from './actions/view'
import {Card} from 'react-native-paper'

function ModPreview({mod: {code, variant}, hash, pushView, character}) {
  return (code && character)
    ? (
      <TouchableHighlight onPress={() => pushView('mod', {hash})} key={hash} style={{marginBottom: 20}}>
        <Card>
          <Card.Title title={`${character.variants[variant] ? character.variants[variant].title  || '' : ''} ${character.name || ''} (${code}_${variant})`} />
          <Card.Content style={{alignItems: 'center'}}>
            <ScaledImage
              source={{uri: `https://phasmaexmachina.github.io/destiny-child-mods-archive/characters/${code}_${variant}/${hash}/static.png`}}
              height={300}
              />
          </Card.Content>
        </Card>
      </TouchableHighlight>
    )
  : null
}

export default connect(
  ({mods, characters}, {hash}) => ({
    mod: mods[hash] || {},
    character: mods[hash] && characters[mods[hash].code],
    hash
  }),
  ({pushView})
)(ModPreview)