import React, {useState} from 'react'
import {connect} from 'react-redux'
import {View, TouchableHighlight, TouchableOpacity, ScrollView} from 'react-native'
import {Subheading, Button, useTheme, Dialog, Portal, Paragraph, TextInput, Menu} from 'react-native-paper'
import ModLive2DPreview from './ModLive2DPreview'
import {pushView} from './actions/view'
import {install} from './actions/mods'

function Mod({mod: {code, variant}, hash, character, pushView, install, characters}) {
  const {colors} = useTheme(),
        [installToOpen, setInstallToOpen] = useState(false),
        [swapCode, setSwapCode] = useState(),
        [autocompleteVisible, setAutocompleteVisible] = useState(false),
        [swapName, setSwapName] = useState(''),
        characterNames = swapName.length > 2 && installToOpen && autocompleteVisible
          ? Object.keys(characters)
            .reduce((acc, code) => {
              acc = acc.concat(Object.keys(characters[code].variants).map(variant =>
                (characters[code].variants[variant].title || '') + ' ' + (characters[code].name || '?') + ' (' + code + '_' + variant + ')'
              ))
              return acc
            }
            , [])
            .filter(name => name.toLowerCase().indexOf(swapName.toLowerCase()) > -1).slice(0, 10)
          : []
  return (
    <>
      <View style={{padding: 20, flex: 1, flexDirection: 'row'}}>
        <TouchableHighlight onPress={() => pushView('characters')}>
          <Subheading style={{color: colors.primary}}>Characters</Subheading>
        </TouchableHighlight>
        <Subheading style={{marginLeft: 10, marginRight: 10}}>&gt;</Subheading>
        <TouchableHighlight onPress={() => pushView('character', {code})}>
          <Subheading style={{color: colors.primary}}>{character.name || character.code}</Subheading>
        </TouchableHighlight>
        <Subheading style={{marginLeft: 10, marginRight: 10}}>&gt;</Subheading>
        <Subheading>{code}_{variant}</Subheading>
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
          Swap into another character
        </Button>
      </View>
      <Portal>
        <Dialog visible={installToOpen} onDismiss={() => {
          setInstallToOpen(false)
          setAutocompleteVisible(false)
        }}>
          <Dialog.Title>Swap into Another Character</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={{marginBottom: 20}}>This will install {code}_{variant}.pck to another character. Please select the character and variant you want to replace.</Paragraph>
            {swapCode
              ? <Button onPress={() => {
                setSwapCode('')
                setSwapName('')
              }} mode="text">{swapName}</Button>
              : <>
                <TextInput
                  label="Character and variant code"
                  onChangeText={setSwapName}
                  value={swapName}
                  onFocus={() => setAutocompleteVisible(true)} />
                <ScrollView>
                  {characterNames.map(name =>
                    <Button mode="outlined" key={name} style={{marginTop: 10}}
                      onPress={() => {
                        setSwapName(name)
                        setSwapCode(name.match(/[a-z][a-z]?\d\d\d_\d\d/)[0])
                      }}
                    >
                      {name}
                    </Button>
                  )}
                </ScrollView>
              </>
            }
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {
              setInstallToOpen(false)
              setAutocompleteVisible(false)
            }}>Cancel</Button>
            <Button disabled={!swapCode}
              onPress={() => {
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
    hash,
    characters
  }),
  {pushView, install}
)(Mod)