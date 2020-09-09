import axios from 'axios'
import { useSelector } from 'react-redux'

/**
 * Token functions
 * @return {array}
 */
export const useToken = () => {
  const setToken = token => {
    axios.defaults.headers.common = { Authorization: token }
  }

  const removeToken = () => {
    axios.defaults.headers.common = {}
  }

  return [setToken, removeToken]
}

/**
 * Sign In functions
 * @return {array}
 */
export const useSignIn = () => {
  const url = useSelector(state => state.config.url)

  const signIn = async credentials => {
    try {
      const result = await axios.post(`${url}/user/sign-in`, credentials)
      return result.data
    } catch (err) {
      return err
    }
  }

  return [signIn]
}

/**
 * Uses File REST routes
 * @param {string} type
 * @return {function}
 */
export const useFileREST = type => {
  const url = useSelector(state => state.config.url)

  const indexFiles = async () => {
    try {
      const result = await axios.get(`${url}/file`)
      return [true, result.data]
    } catch (err) {
      return [false, err]
    }
  }

  const createFile = async (name, data) => {
    try {
      const result = await axios.post(`${url}/file`, { name, data })
      return [true, result.data]
    } catch (err) {
      return [false, err]
    }
  }

  const getFile = async file => {
    try {
      const result = await axios.get(`${url}/file/${file}`)
      return [true, result.data]
    } catch (err) {
      return [false, err]
    }
  }

  const updateFile = async (file, payload) => {
    try {
      const result = await axios.put(`${url}/file/${file}`, payload)
      return [true, result.data]
    } catch (err) {
      return [false, err]
    }
  }

  const destroyFile = async file => {
    try {
      const result = await axios.delete(`${url}/file/${file}`)
      return [true, result.data]
    } catch (err) {
      return [false, err]
    }
  }

  switch (type) {
    case 'index':
      return indexFiles
    case 'create':
      return createFile
    case 'get':
      return getFile
    case 'update':
      return updateFile
    case 'destroy':
      return destroyFile
  }
}
