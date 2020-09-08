export const CHARACTERS_SET = 'CHARACTERS_SET'

export const fetchCharacters = () =>
  (dispatch) => fetch('https://phasmaexmachina.github.io/destiny-child-mods-archive/data/characters.json')
    .then(response => response.json())
    .then(data => {dispatch(setCharacters(data))})
    .catch(e => console.log('Error fetching characters.json'))

export const setCharacters = characters => ({type: CHARACTERS_SET, characters})