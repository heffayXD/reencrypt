import axios from 'axios'
import { useSelector } from 'react-redux'

export const useAPI = (path, method = 'get') => {
  const url = useSelector(state => state.config.url)

  return async (payload, params = {}) => {
    try {
      let address = `${url}${path}`

      // Looping over params to append to URL
      for (const [key, value] of Object.entries(params)) {
        address = address.replace(`:${key}`, value)
      }

      const result = await axios[method](address, payload)

      return [true, result.data]
    } catch (err) {
      return [false, err]
    }
  }
}

export const setToken = token => {
  axios.defaults.headers.common = token !== '' ? { Authorization: token } : ''
}
