export const LOADING_SET_LOADING = 'LOADING_SET_LOADING'

export const setLoading = (isLoading, {title = 'Loading', message = '', progress = 0, total = 0} = {}) => ({
  type: LOADING_SET_LOADING,
  isLoading, title, message, progress, total
})