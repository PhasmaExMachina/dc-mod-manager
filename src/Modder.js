import React from 'react'
import {connect} from 'react-redux'
import {View, TouchableHighlight} from 'react-native'
import {Subheading, useTheme, Headline, Text} from 'react-native-paper'
import {pushView} from './actions/view'
import ModPreview from './ModPreview'
import InstalledPreview from './InstalledPreview'

function Modder({modder, pushView, code, installed, mods}) {
  const {colors} = useTheme(),
        modderMods = Object.keys(mods).reduce((acc, hash) => {
          if(mods[hash].modder == modder) {
            acc.push(Object.assign({}, mods[hash], {hash}))
          }
          return acc
        }, [])
  return modder
    ? (
      <View style={{padding: 20}}>
        <View style={{paddingBottom: 20, flex: 1, flexDirection: 'row'}}>
          <TouchableHighlight onPress={() => pushView('modders')}>
            <Subheading style={{color: colors.primary}}>Modders</Subheading>
          </TouchableHighlight>
          <Subheading style={{marginLeft: 10, marginRight: 10}}>&gt;</Subheading>
          <Subheading>{modder}</Subheading>
        </View>
        <Headline style={{marginBottom: 20}}>
          {modder} - {modderMods.length} mods
        </Headline>
        {modderMods.map(({hash, code, variant}) =>
          <ModPreview code={code} variant={variant} hash={hash} />
        )}
      </View>
    )
    : null
}

export default connect(
  ({modder, mods, view}) => ({
    modder: view.data.modder,
    mods
  }),
  {pushView}
)(Modder)