import React, {useState} from 'react'
import {connect} from 'react-redux'
import {View, TouchableHighlight} from 'react-native'
import {Text, Button, useTheme, Dialog, Portal, Paragraph, TextInput} from 'react-native-paper'
import ModLive2DPreview from './ModLive2DPreview'
import {setView} from './actions/view'
import {install} from './actions/mods'


function Mod({mod: {code, variant}, hash, character, setView, install}) {
  const {colors} = useTheme(),
        [installToOpen, setInstallToOpen] = useState(false),
        [swapCode, setSwapCode] = useState()
  return (
    <>
      <View style={{padding: 20, flex: 1, flexDirection: 'row'}}>
        <TouchableHighlight onPress={() => setView('mods')}>
          <Text style={{color: colors.primary}}>Mods</Text>
        </TouchableHighlight>
        <Text style={{marginLeft: 10, marginRight: 10}}>&gt;</Text>
        <TouchableHighlight onPress={() => setView('character', {code})}>
          <Text style={{color: colors.primary}}>{character.name || character.code}</Text>
        </TouchableHighlight>
        <Text style={{marginLeft: 10, marginRight: 10}}>&gt;</Text>
        <Text>{code}_{variant}</Text>
      </View>
      <ModLive2DPreview hash={hash} code={code} variant={variant} />
      <View style={{padding: 20}}>
        {Object.keys(character.variants).sort().map(v => (
          <View style={{marginBottom: 10}} key={v}>
            <Button icon={variant === v ? 'cloud-download' : 'swap-horizontal-bold'} mode="contained" onPress={() => install({hash, code, variant}, code + '_' + v)}>
              {variant === v ? 'Install to' : 'Swap into'} {code}_{v}.pck
            </Button>
          </View>
        ))}
        <Button icon="swap-horizontal-bold" mode="contained" onPress={() => setInstallToOpen(true)}>
          Install to ????_??.pck
        </Button>
      </View>
      <Portal>
        <Dialog visible={installToOpen} onDismiss={() => setInstallToOpen(false)}>
          <Dialog.Title>Install to Another Character</Dialog.Title>
          <Dialog.Content>
            <Paragraph>This will install {code}_{variant}.pck to another character. Please select the character and variant you want to replace.</Paragraph>
            <TextInput
              label="Character and variant code"
              onChangeText={setSwapCode} />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setInstallToOpen(false)}>Cancel</Button>
            <Button onPress={() => {
              install({hash, code, variant}, swapCode)
              setInstallToOpen(false)
            }}>Install</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  )
}

export default connect(
  ({characters, mods, view: {data: {hash}}}) => ({
    mod: mods[hash],
    character: mods[hash] && characters[mods[hash].code],
    hash
  }),
  {setView, install}
)(Mod)