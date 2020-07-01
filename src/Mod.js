import React from 'react'
import {connect} from 'react-redux'
import {View, TouchableHighlight} from 'react-native'
import {Text, Button, useTheme} from 'react-native-paper'
import ModLive2DPreview from './ModLive2DPreview'
import installMod from './install-mod'
import {setView} from './actions/view'


function Mod({mod: {code, variant}, hash, character, setView}) {
  const {colors} = useTheme()
  return (
    <>
      <View style={{padding: 20, flex: 1, flexDirection: 'row'}}>
        <TouchableHighlight onPress={() => setView('mods')}>
          <Text style={{color: colors.primary}}>Mods</Text>
        </TouchableHighlight>
        <Text style={{marginLeft: 10, marginRight: 10}}>&gt;</Text>
        <TouchableHighlight onPress={() => setView('character', {code})}>
          <Text style={{color: colors.primary}}>{character.name}</Text>
        </TouchableHighlight>
        <Text style={{marginLeft: 10, marginRight: 10}}>&gt;</Text>
        <Text>{code}_{variant}</Text>
      </View>
      <ModLive2DPreview hash={hash} code={code} variant={variant} />
      <View style={{padding: 20}}>
        <Button icon="cloud-download" mode="contained" onPress={() => installMod({hash, code, variant}, code + '_' + variant)}>
          Install to {code}_{variant}.pck
        </Button>
        {/* {Object.keys(character.variants).sort().map(v => (
          <View style={{marginBottom: 10}}>
            <Button icon="cloud-download" mode="contained" onPress={() => installMod({hash, code, variant}, code + '_' + v)}>
              Install to {code}_{v}.pck
            </Button>
          </View>
        ))} */}
      </View>
    </>
  )
}

export default connect(
  ({characters, mods, view: {data: {hash}}}) => ({
    mod: mods[hash],
    character: mods[hash] && characters[mods[hash].code],
    hash
  }),
  {setView}
)(Mod)