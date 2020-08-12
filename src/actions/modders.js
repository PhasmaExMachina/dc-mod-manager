export const MODDERS_SET = 'MODDERS_SET'

export const fetchModders = () =>
  (dispatch) => fetch('https://raw.githubusercontent.com/PhasmaExMachina/destiny-child-mods-archive/master/docs/data/modders.json')
    .then(response => response.json())
    .then(data => dispatch(setModders(data)))
    .catch(e => console.log("ERROR LOADING MODDERS", e))

export const setModders = modders => ({type: MODDERS_SET, modders})