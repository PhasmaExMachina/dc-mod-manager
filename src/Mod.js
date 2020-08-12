import React, {useState} from 'react'
import {connect} from 'react-redux'
import {View, ScrollView, TouchableHighlight} from 'react-native'
import {Subheading, Button, useTheme, Dialog, Text, Portal, Paragraph, TextInput, Menu, TouchableRipple} from 'react-native-paper'
import ModderCreditLink from './ModderCreditLink'
import ModLive2DPreview from './ModLive2DPreview'
import {pushView} from './actions/view'
import {install} from './actions/mods'
import {addModToList} from './actions/lists'

function Mod({mod, hash, character, pushView, install, characters, activeList, addModToList, modder, mods}) {
  console.log(hash, mod)
  const {code, variant} = mod,
        {colors} = useTheme(),
        [installToOpen, setInstallToOpen] = useState(false),
        [swapCode, setSwapCode] = useState(),
        [autocompleteVisible, setAutocompleteVisible] = useState(false),
        [swapName, setSwapName] = useState(''),
        installOrAddToList = (mod, swapCode) => {
          if(activeList) addModToList(mod, swapCode)
          else install(mod, swapCode)
        },
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
      <View style={{padding: 20, flex: 1, flexDirection: 'row', marginBottom: -20}}>
        <TouchableRipple onPress={() => pushView('characters')}>
          <Subheading style={{color: colors.primary}}>Characters</Subheading>
        </TouchableRipple>
        <Subheading style={{marginLeft: 10, marginRight: 10}}>&gt;</Subheading>
        <TouchableRipple onPress={() => pushView('character', {code})}>
          <Subheading style={{color: colors.primary}}>{character.name || character.code}</Subheading>
        </TouchableRipple>
        <Subheading style={{marginLeft: 10, marginRight: 10}}>&gt;</Subheading>
        <Subheading>{code}_{variant}</Subheading>
      </View>
      <ModLive2DPreview hash={hash} code={code} variant={variant} />
      <ModderCreditLink hash={hash} />
      {modder &&
        <View style={{
          marginright: 10,
          alignSelf: 'flex-end'
        }}>
          <TouchableHighlight style={{paddingTop: 10, paddingBottom: 10, paddingRight: 20, paddingLeft: 20}} onPress={() => {
            if(modder != mod.modder) pushView('modder', {modder})
          }}>
            <Paragraph>
              by <Text style={{color: colors.primary}}>{modder}</Text>
            </Paragraph>
          </TouchableHighlight>
        </View>
      }
      <View style={{padding: 20}}>
        {Object.keys(character.variants).sort().map(v => (
          <View style={{marginBottom: 10}} key={v}>
            <Button icon={
              activeList
                ? 'playlist-plus'
                : variant === v
                  ? 'cloud-download'
                  : 'swap-horizontal-bold'
              } mode="contained" onPress={() => installOrAddToList({hash, code, variant}, code + '_' + v)}>
              {variant === v ? 'Install to' : 'Swap into'} {code}_{v}.pck
            </Button>
          </View>
        ))}
        <Button icon={activeList ? 'playlist-plus' : 'swap-horizontal-bold'} mode="contained" onPress={() => setInstallToOpen(true)}>
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
              installOrAddToList({hash, code, variant}, swapCode)
              setInstallToOpen(false)
            }}>Install</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  )
}

export default connect(
  ({lists, installed, characters, mods, view}) => ({
    mod: mods[view.data.hash],
    character: mods[view.data.hash] && characters[mods[view.data.hash].code],
    hash: view.data.hash,
    characters,
    installed,
    activeList: lists.active,
    view,
    mods
  }),
  {pushView, install, addModToList}
)(Mod)