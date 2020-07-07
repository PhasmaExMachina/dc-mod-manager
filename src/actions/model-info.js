export const MODEL_INFO_SET = 'MODEL_INFO_SET'

export const fetchModelInfo = () =>
  (dispatch) => {
    fetch('https://raw.githubusercontent.com/PhasmaExMachina/destiny-child-mods-archive/master/docs/data/model_info.merged.json')
      .then(response => response.json())
      .then(data => {
        dispatch(setModelInfo(data))
      })
  }

export const setModelInfo = modelInfo => {
  return {type: MODEL_INFO_SET, modelInfo}
}