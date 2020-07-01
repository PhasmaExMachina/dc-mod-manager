import React, {useEffect, useState} from 'react'
import {Image} from 'react-native'
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource'

function ScaledImage(props) {
  const [width, setWidth] = useState(props.width || 0),
        [height, setHeight] = useState(props.height || 0)
  const setImageSize = (width, height) =>{
		if(props.width && !props.height) {
			setHeight(height * (props.width / width))
		} else if (!props.width && props.height) {
			setWidth(width * (props.height / height))
		}
	}
  useEffect(() => {
    if(props.source.uri) {
      Image.getSize(props.source.uri, (width, height) => setImageSize(width, height))
    } else {
      let {width, height} = resolveAssetSource(props.source)
      setImageSize(width, height)
    }
  }, [])

	const getStyles = () => {
		let styles = [{height, width}]
		if (props.style) styles.push(props.style)
		return styles
  }
  return (width && height)
    ? <Image source={props.source} style={getStyles()} onPress={props.onPress} />
    : null
}

export default ScaledImage