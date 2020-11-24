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
            <RadioButton.Item label="Characters" value="characters" />
          </RadioButton.Group>
        </Card.Content>
      </Card>
      <Card style={{marginBottom: 20}}>
        <Card.Title title="Default Mods View Default Sort Order" />
        <Card.Content>
          <RadioButton.Group onValueChange={value => setConfig({defaultModsSortOrder: value})} value={config.defaultModsSortOrder}>
            <RadioButton.Item label="Sort by code" value="code" />
            <RadioButton.Item label="Sort by name" value="name" />
            <RadioButton.Item label="Sort by recently added" value="recently added" />
            <RadioButton.Item label="Sort by oldest" value="oldest" />
          </RadioButton.Group>
        </Card.Content>
      </Card>
      <Card style={{marginBottom: 20}}>
        <Card.Title title="Default Characters Default Sort Order" />
        <Card.Content>
          <RadioButton.Group onValueChange={value => setConfig({defaultCharacterSortOrder: value})} value={config.defaultCharacterSortOrder}>
            <RadioButton.Item label="Sort by code" value="code" />
            <RadioButton.Item label="Sort by code descending" value="code-desc" />
            <RadioButton.Item label="Sort by name" value="name" />
            <RadioButton.Item label="Sort by name descending" value="name-desc" />
          </RadioButton.Group>
        </Card.Content>
      </Card>
      <Card style={{marginBottom: 20}}>
        <Card.Title title="Default Characters View Default Show" />
        <Card.Content>
          <RadioButton.Group onValueChange={value => setConfig({defaultCharacterShow: value})} value={config.defaultCharacterShow}>
            <RadioButton.Item label="Show all" value="all" />
            <RadioButton.Item label="Show childs" value="childs" />
            <RadioButton.Item label="Show spa childs" value="spa childs" />
            <RadioButton.Item label="Show monsters" value="monsters" />
            <RadioButton.Item label="Show spa monsters" value="spa monsters" />
            <RadioButton.Item label="Show other" value="other" />
          </RadioButton.Group>
        </Card.Content>
      </Card>
      <Card style={{marginBottom: 20}}>
        <Card.Title title="Game Region" />
        <Card.Content>
          <RadioButton.Group onValueChange={value => setConfig({region: value})} value={config.region}>
            <RadioButton.Item
              label={'Global  (Taptap) - com.linegames.dcglobal.xsolla' + (config.installedRegions.indexOf('global_tap') < 0 ? ' (not installed)' : '')}
              value="global_tap"
              disabled={config.installedRegions.indexOf('global_tap') < 0} />
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