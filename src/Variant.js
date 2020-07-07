import React, {useState, useEffect} from 'react'
import {View, TouchableHighlight} from 'react-native'
import {Headline, Subheading, useTheme, Paragraph, Card, Button} from 'react-native-paper'
import {connect} from 'react-redux'
import {pushView} from './actions/view'
import Slider from '@react-native-community/slider'
import {readModelInfo, writeModelInfo} from './model-info'
import {setLoading} from './actions/loading'

const Variant = ({character, variant, code, pushView, setLoading}) => {
  const [homeScale, setHomeScale] = useState(),
        [modelInfo, setModelInfo] = useState(false),
        {colors} = useTheme()
  useEffect(() => {
      setLoading(true, {title: 'Loading model_info.json', message: 'Reading latest model_info.json data from your device.'})
      readModelInfo().then(m => {
        setModelInfo(m)
        setHomeScale(m[code + '_' + variant].home.scale)
      })
    }
  , [])
  if(modelInfo) setLoading(false)
  else return null
  const charModelInfo = modelInfo[code + '_' + variant]
  return (
    <View style={{padding: 20}}>
      <View style={{paddingBottom: 20, flex: 1, flexDirection: 'row'}}>
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
      <Headline style={{marginBottom: 20}}>
        {character.variants[variant].title} {character.name || '?'} ({code}_{variant})
      </Headline>
      <Card style={{marginBottom: 20}}>
        <Card.Title title={`Home Scale: ${homeScale}`} />
        <Card.Content style={{alignItems: 'center'}}>
          <Slider
            style={{width: 300, height: 20}}
            minimumValue={0}
            maximumValue={2}
            value={homeScale}
            step={0.01}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            onValueChange={setHomeScale}
          />
          {/* <Paragraph>{JSON.stringify(charModelInfo.home, null, 2)}</Paragraph> */}
        </Card.Content>
      </Card>
      <Button mode="contained" onPress={() => {
        modelInfo[code + '_' + variant].home.scale = homeScale
        writeModelInfo(modelInfo)
      }}>
        Save Changes
      </Button>
      <Paragraph>{JSON.stringify(charModelInfo, null, 2)}</Paragraph>
    </View>
  )
}

export default connect(
  ({modelInfo, characters, view: {data: {code, variant}}}) => ({
    character: characters[code] || {},
    variant,
    code,
    modelInfo,
    setLoading
  }),
  {pushView, setLoading}
)(Variant)