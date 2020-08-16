import React from 'react'
import {View} from 'react-native'
import {Text, Headline, Card, Button} from 'react-native-paper'
import {connect} from 'react-redux'
import {setLoading} from './actions/loading'
import {writeModelInfo, readModelInfo} from './lib/model-info'
import {pushView} from './actions/view'

const Tools = ({setLoading, installed, modelInfo, mods, pushView}) => {
  const reApplyModelInfo = () => {
    setLoading(true, {title: 'Re-applying mod positions', message: `Processing ${Object.keys(installed).length} installed mods ...`})
    readModelInfo().then(localModelInfo => {
      Object.keys(installed).forEach(target => {
        const {code, variant} = mods[installed[target].hash] || {}
        if(code && variant && modelInfo[code + '_' + variant]) {
          localModelInfo[target] = modelInfo[code + '_' + variant]
        }
      })
      writeModelInfo(localModelInfo).then(() => setLoading(false))
    })
  }
  return (
    <View style={{margin: 20}}>
      <Headline style={{marginBottom: 20}}>Tools</Headline>
      <Card>
          <Card.Title title="model_info.json" />
          <Card.Content style={{alignItems: 'center'}}>
            <Button mode="contained" style={{marginBottom: 20, marginTop: 10, width: '100%'}} onPress={reApplyModelInfo}>
              Re-apply installed mod positions
            </Button>
            <Text>
              This will re-apply all edits to model_info.json that have been made while installing mods. This is most useful after an update where model_info.json gets restored to the game's default and character positions and scal can get messed up for swaps.
            </Text>
            <Button mode="contained" style={{marginBottom: 20, marginTop: 20, width: '100%'}} onPress={() => pushView('modelInfoEditor')}>
              Edit model_info.json
            </Button>
            <Text>
              Edit position or scale details.
            </Text>
          </Card.Content>
        </Card>
    </View>
  )
}

export default connect(
  ({installed, modelInfo, mods}) => ({installed, modelInfo, mods}),
  {setLoading, pushView}
)(Tools)