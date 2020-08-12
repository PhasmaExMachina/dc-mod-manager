import React, {useState} from 'react'
import {connect} from 'react-redux'
import {TouchableHighlight, View, Linking} from 'react-native'
import {Portal, Dialog, Button, Paragraph, Text, useTheme} from 'react-native-paper'
import {pushView} from './actions/view'

const ModderCreditLink = ({view, mod, pushView, characters, hash}) => {
  const {code, variant, modder, usingAssetsBy} = mod,
        {colors} = useTheme(),
        {name, variants} = characters[mod.code],
        [infoDialogIsOpen, setInfoDialogIsOpen] = useState(false),
        modderCreditTicketTemplate = `
Use this form to sumbmit modder author/creator information for a given mod so they get credit for their work. I'll update the information in the archive as soon as I can and will close this ticket when it's done. ~Phasma

Modder:

If this mod uses assets by any other modders please list them here:

Mod link (do not change this):
https://phasmaexmachina.github.io/destiny-child-mods-archive/live2d-viewer.html?model=${code}_${variant}&modHash=${hash}&background=%23111

Mod hash (do not change this): ${hash}`

  return variants[mod.variant].mods[0] != hash && (
    <View style={{
      marginright: 10,
      alignSelf: 'flex-end',
      flexDirection:'row', flexWrap:'wrap'
    }}>
      <TouchableHighlight style={{paddingTop: 10, paddingBottom: 10, paddingRight: 20, paddingLeft: 20}} onPress={() => {
        if(!modder) setInfoDialogIsOpen(true)
        else if(view.data.modder != modder) pushView('modder', {modder})
      }}>
        <Text>
          by <Text style={{color: colors.primary}}>{modder || '?'}</Text>
        </Text>
      </TouchableHighlight>
      {usingAssetsBy && <TouchableHighlight style={{paddingTop: 10, paddingBottom: 10, paddingRight: 20}} onPress={() => {
        if(view.data.modder != usingAssetsBy) pushView('modder', {modder: usingAssetsBy})
      }}>
        <Text>
          {' '}using assets by <Text style={{color: colors.primary}}>{usingAssetsBy}</Text>
        </Text>
      </TouchableHighlight>
      }
      <Portal>
        <Dialog visible={infoDialogIsOpen} onDismiss={() => setInfoDialogIsOpen(false)}>
          <Dialog.Title>Submit a modder?</Dialog.Title>
          <Dialog.Content>
            <Paragraph>We don't know who made this mod. Would you like to dubmit a modder? You will need a GitHub account.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setInfoDialogIsOpen(false)}>Cancel</Button>
            <Button onPress={() => {
              Linking.openURL('http://github.com/PhasmaExMachina/destiny-child-mods-archive/issues/new?labels=modder&title=' +
              'Modder credit ' + (name ? 'for ' + variants[variant].title + ' ' + name : '') +
              '&body=' + encodeURIComponent(modderCreditTicketTemplate))
              setInfoDialogIsOpen(false)
            }}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
}

export default connect(
  ({mods, view, characters}, {hash}) => {
    const mod = mods[hash] || {}
    return {
      mod,
      hash,
      mods,
      view,
      characters
    }
  },
  ({pushView})
)(ModderCreditLink)