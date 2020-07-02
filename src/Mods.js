import React, {useState} from 'react'
import {connect} from 'react-redux'
import {
  View,
  Button
} from 'react-native'
import {TextInput, Menu, DataTable} from 'react-native-paper'
import ScaledImage from './ScaledImage'
import ModPreview from './ModPreview'
import {scrollToTop} from './ScrollTop'

function Mods({mods, characters}) {
  const [filter, setFilter] = useState(''),
        [sortMenuVisible, setSortMenuVisible] = useState(false),
        [sort, setSort] = useState('recently added'),
        [page, setPageVal] = useState(0),
        setPage = p => {
          setPageVal(p)
          scrollToTop()
        }
        setSortAndClose = val => {
          setSort(val)
          setSortMenuVisible(false)
        },
        itemsPerPage = 10,
        from = page * itemsPerPage,
        to = (page + 1) * itemsPerPage
  let filtered = Object.keys(mods).reduce((acc, hash) => {
    const {code, variant} = mods[hash]
    if(!filter || ((characters[code] ? (characters[code].name || '') : '') + code + '_' + variant).toLowerCase().match(filter.toLowerCase())) {
      acc.push({...mods[hash], hash})
    }
    return acc
  }, [])
  if(sort == 'recently added') {
    filtered = filtered.sort((a, b) => a.created > b.created ? -1 : b.created > a.created ? 1 : 0)
  }
  if(sort == 'oldest') {
    filtered = filtered.sort((a, b) => a.created < b.created ? -1 : b.created < a.created ? 1 : 0)
  }
  if(sort == 'name') {
    filtered = filtered.sort((a, b) => {
      a = characters[mods[a.hash].code].name
      b = characters[mods[b.hash].code].name
      return a < b ? -1 : b < a ? 1 : 0
    })
  }
  if(sort == 'code') {
    filtered = filtered.sort((a, b) => {
      a = mods[a.hash].code
      b = mods[b.hash].code
      return a < b ? -1 : b < a ? 1 : 0
    })
  }
  return (
    <View style={{padding: 20}}>
      <View style={{paddingBottom: 20}}>
        <TextInput label="Filter" onChangeText={text => setFilter(text)}/>
      </View>
      <View style={{marginBottom: 20}}>
        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={<Button title={'Sorted by ' + sort} onPress={() => setSortMenuVisible(true)} />}>
          <Menu.Item onPress={() => setSortAndClose('code')} title="Sort by code" />
          <Menu.Item onPress={() => setSortAndClose('name')} title="Sort by name" />
          <Menu.Item onPress={() => setSortAndClose('recently added')} title="Sort by recently added" />
          <Menu.Item onPress={() => setSortAndClose('oldest')} title="Sort by oldest" />
        </Menu>
      </View>
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.floor(filtered.length / itemsPerPage)}
        onPageChange={page => setPage(page)}
        label={`${from + 1}-${to} of ${filtered.length}`}
      />
      {filtered.slice(from, to).map(({hash}) =>
        <ModPreview key={hash} hash={hash} />
      )}
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.floor(filtered.length / itemsPerPage)}
        onPageChange={page => setPage(page)}
        label={`${from + 1}-${to} of ${filtered.length}`}
      />
    </View>
  )
}

export default connect(
  ({mods, characters}) => ({mods, characters})
)(Mods)