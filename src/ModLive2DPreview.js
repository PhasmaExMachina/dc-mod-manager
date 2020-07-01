import React from 'react'
import {WebView} from 'react-native-webview'
import {connect} from 'react-redux'
import {Dimensions} from 'react-native'

function ModLive2DPreview({hash, code, variant}) {
  const screenWidth = Math.round(Dimensions.get('window').width),
        INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0.5'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `

  return (
    <>
      <WebView
          bounces={true}
          javaScriptEnabled
          bounces={false}
          injectedJavaScript={INJECTEDJAVASCRIPT}
          style={{height: screenWidth * 1.3, width: screenWidth}}
          source={{uri: `https://phasmaexmachina.github.io/destiny-child-mods-archive/live2d-viewer.html?model=${code}_${variant}&modHash=${hash}&background=%23111&hideUI=true&scale=1.1` }}
          automaticallyAdjustContentInsets={false}
        />
    </>
  )
}

export default connect(
  ({mods}, {hash}) => {
    return mods[hash]
      ? {
        code: mods[hash].code,
        variant: mods[hash].variant
      }
      : {}
  }
)(ModLive2DPreview)