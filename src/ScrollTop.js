import React from 'react'
import {ScrollView} from 'react-native';

let ref

function MainScrollView({children}) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" ref={v => ref = v}>
      {children}
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