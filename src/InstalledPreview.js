import React from 'react'
import {connect} from 'react-redux'
import {View, TouchableHighlight} from 'react-native'
import ScaledImage from './ScaledImage'
import {install} from './actions/mods'
import ModderCreditLink from './ModderCreditLink'
import {pushView} from './actions/view'
import {Button, Card, List, Text, TouchableRipple, IconButton, Paragraph} from 'react-native-paper'

function ModPreview({mod, hash, pushView, character, target, characters, removeFromList, installed, install, mods}) {
  const {code, variant} = mod,
        [targetCode, targetVariant] = target.split('_'),
        targetCharacter = characters[targetCode],
        targetHash = targetCharacter.variants[targetVariant].mods[0],
        isInstalled = installed[target] && hash == installed[target].hash,
        isDefaultInstalled = isInstalled && characters[targetCode].variants[targetVariant].mods.indexOf(hash) == 0,
        installedMod = installed[target] && installed[target].hash && Object.assign({}, mods[installed[target].hash], {hash: installed[target].hash})
        mod = Object.assign({}, mod, {hash})
  return (code && character)
    ? (
      <TouchableHighlight style={{marginBottom: 20}}>
        <Card>
          {/* <Card.Title title={`${character.variants[variant] ? character.variants[variant].title  || '' : ''} ${character.name || ''} (${code}_${variant})`} /> */}
          {/* <Button mode="contained" style={{marginBottom: 20}}>
            {targetCharacter.variants[targetVariant].title} {targetCharacter.name}
          </Button> */}
          <Card.Content style={{alignItems: 'center', paddingBottom: 20}}>
            {removeFromList &&
              <IconButton onPress={removeFromList} icon="delete-sweep-outline" style={{
                position: 'absolute',
                top: 5,
                right: 5
              }}/>
            }
            <View style={{flexDirection:'row', flexWrap:'wrap'}}>
              {targetHash &&
                  <View style={{alignItems: 'center', paddingTop: 10}}>
                    <TouchableRipple onPress={() => pushView('mod', {hash: targetHash})} style={{alignItems: 'center'}}>
                      <>
                        <ScaledImage
                          source={{uri: `https://phasmaexmachina.github.io/destiny-child-mods-archive/characters/${targetCode}_${targetVariant}/${targetHash}/static.png`}}
                          height={70}
                          style={{marginBottom: 10}}
                          />
                        <Text>{target}</Text>
                      </>
                  </TouchableRipple>
                  <List.Icon icon="arrow-right" />
                  {installedMod && installedMod.hash != hash &&
                    <TouchableRipple onPress={() => pushView('mod', {hash: installedMod.hash})} style={{alignItems: 'center'}}>
                        <>
                          <ScaledImage
                            source={{uri: `https://phasmaexmachina.github.io/destiny-child-mods-archive/characters/${installedMod.code}_${installedMod.variant}/${installedMod.hash}/static.png`}}
                            height={70}
                            style={{marginBottom: 10}}
                            />
                          <Text>currently</Text>
                          <Text>installed</Text>
                        </>
                    </TouchableRipple>
                  }
                </View>
              }
              <TouchableRipple onPress={() => pushView('mod', {hash})} style={{marginLeft: targetHash ? 20 : 0}}>
                <ScaledImage
                  source={{uri: `https://phasmaexmachina.github.io/destiny-child-mods-archive/characters/${code}_${variant}/${hash}/static.png`}}
                  height={250}
                  />
              </TouchableRipple>
            </View>
            <ModderCreditLink hash={hash} />
          </Card.Content>
          <Button
            icon={(isInstalled && !isDefaultInstalled) ? 'cellphone-erase' : 'cellphone-arrow-down'}
            mode={isInstalled ? 'outlined' : 'contained'}
            onPress={() => {
              const [targetCode, targetVariant] = target.split('_')
              install(
                isInstalled
                  ? {hash: characters[targetCode].variants[targetVariant].mods[0], code: targetCode, variant: targetVariant}
                  : mod,
                target
              )
            }}>
            {isDefaultInstalled
              ? 'Re-install to'
              : isInstalled
                ? 'Uninstall from'
                : 'Install to'
            } {target}
          </Button>
        </Card>
      </TouchableHighlight>
    )
  : null
}

export default connect(
  ({mods, installed, characters}, {hash}) => {
    const mod = mods[hash] || {}
    return {
      mod,
      character: mods[hash] && characters[mods[hash].code],
      hash,
      characters,
      installed,
      mods
    }
  },
  ({pushView, install})
)(ModPreview)