import React from 'react'
import {Card, Paragraph} from 'react-native-paper'
import ScaledImage from './ScaledImage'
import {pushView} from './actions/view'
import {connect} from 'react-redux'

const CharacterPreview = ({character, pushView}) => {
  const variant = ['02', '01', '00', '89', '10'].reduce((acc, v) =>
    acc || (character.variants[v] ? v : false)
  , false)
  return (
    <Card style={{marginBottom: 20}} onPress={() => pushView('character', {code: character.code})}>
      <Card.Title title={`${character.name} (${character.code})`}/>
      <Card.Content style={{alignItems: 'center'}}>
          {character.variants[variant] &&
            <ScaledImage
              source={{uri: `https://phasmaexmachina.github.io/destiny-child-mods-archive/characters/${character.code}_${variant}/${character.variants[variant].mods[0]}/static.png`}}
              height={300}
              />
          }
      </Card.Content>
      {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
    </Card>
  )
}

export default connect(
  null,
  {pushView}
)(CharacterPreview)