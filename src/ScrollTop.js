import React from 'react'
import {ScrollView, View} from 'react-native';

let ref

function MainScrollView({children}) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" ref={v => ref = v}>
      <View style={{marginBottom: 70}}>
        {children}
      </View>
    </ScrollView>
  )
}

export default MainScrollView

export const scrollToTop = () => {
  ref.scrollTo({y: 0})
  setTimeout(() => {
    ref.scrollTo({y: 0})
  }, 100)
}