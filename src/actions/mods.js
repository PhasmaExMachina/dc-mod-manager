export const MODS_SET = 'MODS_SET'

export const fetchMods = () =>
  (dispatch) => fetch('https://phasmaexmachina.github.io/destiny-child-mods-archive/data/mods.json')
    .then(response => response.json())
    .then(data => dispatch(setMods(data)));

export const setMods = mods => ({type: MODS_SET, mods})