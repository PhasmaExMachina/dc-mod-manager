import React from 'react'
import {Text, Title, Paragraph, Headline, Subheading, RadioButton, Card} from 'react-native-paper'
import {connect} from 'react-redux'
import {View} from 'react-native'
import {setConfig} from './actions/config'

const Settings = ({config, setConfig}) => {
  return (
    <View style={{margin: 20}}>
      <Headline style={{marginBottom: 20}}>Settings</Headline>
      <Card style={{marginBottom: 20}}>
        <Card.Title title="Default View" />
        <Card.Content>
          <RadioButton.Group onValueChange={value => setConfig({defaultView: value})} value={config.defaultView}>
            <RadioButton.Item label="Mods" value="mods" />
          </RadioButton.Group>
        </Card.Content>
      </Card>
      <Card style={{marginBottom: 20}}>
        <Card.Title title="Game Region" />
        <Card.Content>
          <RadioButton.Group onValueChange={value => setConfig({region: value})} value={config.region}>
            <RadioButton.Item
              label={'Global - com.linegames.dcglobal' + (config.installedRegions.indexOf('global') < 0 ? ' (not installed)' : '')}
              value="global"
              disabled={config.installedRegions.indexOf('global') < 0} />
            <RadioButton.Item
              label={'Korea - com.NextFloor.DestinyChild' + (config.installedRegions.indexOf('kr') < 0 ? ' (not installed)' : '')}
              value="kr"
              disabled={config.installedRegions.indexOf('kr') < 0}/>
            <RadioButton.Item
              label={'Japan - com.stairs.destinychild' + (config.installedRegions.indexOf('jp') < 0 ? ' (not installed)' : '')}
              value="jp"
              disabled={config.installedRegions.indexOf('jp') < 0}/>
          </RadioButton.Group>
        </Card.Content>
      </Card>
    </View>
  )
}

export default connect(
  ({config}) => ({config}),
  {setConfig}
)(Settings)