import React, {useState, useEffect} from 'react'
import {Text, Headline, TextInput, Subheading, Paragraph, Button} from 'react-native-paper'
import {connect} from 'react-redux'
import {View} from 'react-native'
import {readModelInfo, writeModelInfo} from './lib/model-info'
import Toast from 'react-native-simple-toast'

const ModelInfoEditor = () => {
  const [charCode, setCharCode] = useState(''),
        [homeScale, setHomeScale] = useState(0),
        [homeX, setHomeX] = useState(0),
        [homeY, setHomeY] = useState(0),
        [talkScale, setTalkScale] = useState(0),
        [talkX, setTalkX] = useState(0),
        [talkY, setTalkY] = useState(0),
        [allyScale, setAllyScale] = useState(0),
        [allyX, setAllyX] = useState(0),
        [allyY, setAllyY] = useState(0),
        [enemyScale, setEnemyScale] = useState(0),
        [enemyX, setEnemyX] = useState(0),
        [enemyY, setEnemyY] = useState(0),
        [talk_zoomScale, setTalk_zoomScale] = useState(0),
        [talk_zoomX, setTalk_zoomX] = useState(0),
        [talk_zoomY, setTalk_zoomY] = useState(0),
        [driveScale, setDriveScale] = useState(0),
        [driveX, setDriveX] = useState(0),
        [driveY, setDriveY] = useState(0),
        [modelInfo, setModelInfo] = useState(false),
        {home, talk, ally, enemy, talk_zoom, drive} = modelInfo[charCode] || {},
        loadCharCode = code => {
          setCharCode(code)
          if(modelInfo[code]) {
            setHomeScale(modelInfo[code].home.scale.toString())
            setHomeX(modelInfo[code].home.position.x.toString())
            setHomeY(modelInfo[code].home.position.y.toString())
            setTalkScale(modelInfo[code].talk.scale.toString())
            setTalkX(modelInfo[code].talk.position.x.toString())
            setTalkY(modelInfo[code].talk.position.y.toString())
            setAllyScale(modelInfo[code].ally.scale.toString())
            setAllyX(modelInfo[code].ally.position.x.toString())
            setAllyY(modelInfo[code].ally.position.y.toString())
            setEnemyScale(modelInfo[code].enemy.scale.toString())
            setEnemyX(modelInfo[code].enemy.position.x.toString())
            setEnemyY(modelInfo[code].enemy.position.y.toString())
            setTalk_zoomScale(modelInfo[code].talk_zoom.scale.toString())
            setTalk_zoomX(modelInfo[code].talk_zoom.position.x.toString())
            setTalk_zoomY(modelInfo[code].talk_zoom.position.y.toString())
            setDriveScale(modelInfo[code].drive.scale.toString())
            setDriveX(modelInfo[code].drive.position.x.toString())
            setDriveY(modelInfo[code].drive.position.y.toString())
          }
        },
        saveChanges = () => {
          if(modelInfo[charCode].home) {
            modelInfo[charCode].home.scale = parseFloat(homeScale)
            modelInfo[charCode].home.position.x = parseFloat(homeX)
            modelInfo[charCode].home.position.y = parseFloat(homeY)
          }
          if(modelInfo[charCode].talk) {
            modelInfo[charCode].talk.scale = parseFloat(talkScale)
            modelInfo[charCode].talk.position.x = parseFloat(talkX)
            modelInfo[charCode].talk.position.y = parseFloat(talkY)
          }
          if(modelInfo[charCode].ally) {
            modelInfo[charCode].ally.scale = parseFloat(allyScale)
            modelInfo[charCode].ally.position.x = parseFloat(allyX)
            modelInfo[charCode].ally.position.y = parseFloat(allyY)
          }
          if(modelInfo[charCode].enemy) {
            modelInfo[charCode].enemy.scale = parseFloat(enemyScale)
            modelInfo[charCode].enemy.position.x = parseFloat(enemyX)
            modelInfo[charCode].enemy.position.y = parseFloat(enemyY)
          }
          if(modelInfo[charCode].talk_zoom) {
            modelInfo[charCode].talk_zoom.scale = parseFloat(talk_zoomScale)
            modelInfo[charCode].talk_zoom.position.x = parseFloat(talk_zoomX)
            modelInfo[charCode].talk_zoom.position.y = parseFloat(talk_zoomY)
          }
          if(modelInfo[charCode].drive) {
            modelInfo[charCode].drive.scale = parseFloat(driveScale)
            modelInfo[charCode].drive.position.x = parseFloat(driveX)
            modelInfo[charCode].drive.position.y = parseFloat(driveY)
          }
          writeModelInfo(modelInfo).then(() => {
            console.log('saved')
            console.log('home', modelInfo[charCode].home)
            console.log('ally', modelInfo[charCode].ally)
            console.log('enemy', modelInfo[charCode].enemy)
            console.log('talk_zoom', modelInfo[charCode].talk_zoom)
            console.log('drive', modelInfo[charCode].drive)
            Toast.show('Saved model_info.json',  Toast.LONG)
          })
        }
  useEffect(() => {
    readModelInfo().then(setModelInfo)
  }, [])
  return (
    <View style={{padding: 20}}>
      <Headline style={{marginBottom: 20}}>
        model_info.json Editor
      </Headline>
      <TextInput
        label="Character Code (e.g. c167_01)  "
        value={charCode}
        style={{marginBottom: 20}}
        onChangeText={loadCharCode} />
      {home && <>
        <Subheading>Home</Subheading>
        <Paragraph>Applies to main screen, ally crit/slide pop-ups, enemy drive pop-up.</Paragraph>
        <TextInput
          label="Scale"
          disabled={!home || typeof home.scale == 'undefined'}
          value={homeScale}
          style={{marginBottom: 10, marginTop: 10}}
          onChangeText={setHomeScale} />
        <TextInput
          label="X position (negative for left, positive for right)"
          disabled={!home || typeof home.scale == 'undefined'}
          value={homeX}
          style={{marginBottom: 10, marginTop: 10}}
          onChangeText={setHomeX} />
        <TextInput
          label="Y position (negative for up, positive for down)"
          disabled={!home || typeof home.scale == 'undefined'}
          value={homeY}
          style={{marginBottom: 10, marginTop: 10}}
          onChangeText={setHomeY} />
      </>}
      {talk && <>
        <Subheading>Talk</Subheading>
        <Paragraph>Applies stories.</Paragraph>
        <TextInput
          label="Scale"
          disabled={!talk || typeof talk.scale == 'undefined'}
          value={talkScale}
          style={{marginBottom: 10, marginTop: 10}}
          onChangeText={setTalkScale} />
        <TextInput
          label="X position (negative for left, positive for right)"
          disabled={!talk || typeof talk.scale == 'undefined'}
          value={talkX}
          style={{marginBottom: 10, marginTop: 10}}
          onChangeText={setTalkX} />
        <TextInput
          label="Y position (negative for up, positive for down)"
          disabled={!talk || typeof talk.scale == 'undefined'}
          value={talkY}
          style={{marginBottom: 10, marginTop: 10}}
          onChangeText={setTalkY} />
      </>}
      {ally && <>
        <Subheading>Ally</Subheading>
        <Paragraph>Applies to tap skill</Paragraph>
        <TextInput
          label="Scale"
          disabled={!ally || typeof ally.scale == 'undefined'}
          value={allyScale}
          style={{marginBottom: 10, marginTop: 10}}
          onChangeText={setAllyScale} />
        <TextInput
          label="X position (negative for left, positive for right)"
          disabled={!ally || typeof ally.scale == 'undefined'}
          value={allyX}
          style={{marginBottom: 10, marginTop: 10}}
          onChangeText={setAllyX} />
        <TextInput
          label="Y position (negative for up, positive for down)"
          disabled={!ally || typeof ally.scale == 'undefined'}
          value={allyY}
          style={{marginBottom: 10, marginTop: 10}}
          onChangeText={setAllyY} />
      </>}
      {enemy && <>
        <Subheading>Enemy</Subheading>
        <Paragraph>Applies to enemy position</Paragraph>
        <TextInput
          label="Scale"
          disabled={!enemy || typeof enemy.scale == 'undefined'}
          value={enemyScale}
          style={{marginBottom: 10, marginTop: 10}}
          onChangeText={setEnemyScale} />
        <TextInput
          label="X position (negative for left, positive for right)"
          disabled={!enemy || typeof enemy.scale == 'undefined'}
          value={enemyX}
          style={{marginBottom: 10, marginTop: 10}}
          onChangeText={setEnemyX} />
        <TextInput
          label="Y position (negative for up, positive for down)"
          disabled={!enemy || typeof enemy.scale == 'undefined'}
          value={enemyY}
          style={{marginBottom: 10, marginTop: 10}}
          onChangeText={setEnemyY} />
      </>}
      {talk_zoom && <>
        <Subheading>Talk Zoom</Subheading>
        <Paragraph>Applies to ?</Paragraph>
        <TextInput
          label="Scale"
          disabled={!talk_zoom || typeof talk_zoom.scale == 'undefined'}
          value={talk_zoomScale}
          style={{marginBottom: 10, marginTop: 10}}
          onChangeText={setTalk_zoomScale} />
        <TextInput
          label="X position (negative for left, positive for right)"
          disabled={!talk_zoom || typeof talk_zoom.scale == 'undefined'}
          value={talk_zoomX}
          style={{marginBottom: 10, marginTop: 10}}
          onChangeText={setTalk_zoomX} />
        <TextInput
          label="Y position (negative for up, positive for down)"
          disabled={!talk_zoom || typeof talk_zoom.scale == 'undefined'}
          value={talk_zoomY}
          style={{marginBottom: 10, marginTop: 10}}
          onChangeText={setTalk_zoomY} />
      </>}
      {drive && <>
        <Subheading>Drive</Subheading>
        <Paragraph>Applies to drive skill</Paragraph>
        <TextInput
          label="Scale"
          disabled={!drive || typeof drive.scale == 'undefined'}
          value={driveScale}
          style={{marginBottom: 10, marginTop: 10}}
          onChangeText={setDriveScale} />
        <TextInput
          label="X position (negative for left, positive for right)"
          disabled={!drive || typeof drive.scale == 'undefined'}
          value={driveX}
          style={{marginBottom: 10, marginTop: 10}}
          onChangeText={setDriveX} />
        <TextInput
          label="Y position (negative for up, positive for down)"
          disabled={!drive || typeof drive.scale == 'undefined'}
          value={driveY}
          style={{marginBottom: 10, marginTop: 10}}
          onChangeText={setDriveY} />
      </>}
      <Button
        disabled={!modelInfo[charCode]}
        mode="contained"
        style={{marginTop: 20}}
        onPress={saveChanges}>
        Save Changes
      </Button>
      <Text style={{marginTop: 20}}>
        {modelInfo
          ? modelInfo[charCode]
            // ? JSON.stringify(modelInfo[charCode], null, 2)
            ? ''
            : 'model_info.json loaded. Enter a character code (e.g. c167_01)'
          : 'reading model_info.json ...'
        }
      </Text>
    </View>
  )
}

export default connect(

)(ModelInfoEditor)