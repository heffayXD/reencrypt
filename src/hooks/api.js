import axios from 'axios'
import { useSelector } from 'react-redux'

export const useAPI = (path, method = 'get') => {
  const url = useSelector(state => state.config.url)

  return async (payload) => {
    try {
      const result = await axios[method](`${url}${path}`, payload)

      return [true, result.data]
    } catch (err) {
      return [false, err]
    }
  }
}

export const setToken = token => {
  axios.defaults.headers.common = token !== '' ? { Authorization: token } : ''
}
