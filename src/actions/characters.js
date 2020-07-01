export const CHARACTERS_SET = 'CHARACTERS_SET'

export const fetchCharacters = () =>
  (dispatch) => fetch('https://phasmaexmachina.github.io/destiny-child-mods-archive/data/characters.json')
    .then(response => response.json())
    .then(data => {dispatch(setCharacters(data))});

export const setCharacters = characters => ({type: CHARACTERS_SET, characters})