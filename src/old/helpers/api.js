import axios from 'axios'

export const setToken = token => {
  axios.defaults.headers.common = { Authorization: token }
}

export const removeToken = () => {
  axios.defaults.headers.common = {}
}

export const signIn = async (url, credentials) => {
  try {
    const result = await axios.post(`${url}/user/sign-in`, credentials)
    return result.data
  } catch (err) {
    return err
  }
}

export const indexFiles = async (url) => {
  try {
    const result = await axios.get(`${url}/file`)
    return [true, result.data]
  } catch (err) {
    return [false, err]
  }
}

export const createFile = async (url, name, data) => {
  try {
    const result = await axios.post(`${url}/file`, { name, data })
    return [true, result.data]
  } catch (err) {
    return [false, err]
  }
}

export const getFile = async (url, file) => {
  try {
    const result = await axios.get(`${url}/file/${file}`)
    return [true, result.data]
  } catch (err) {
    return [false, err]
  }
}

export const updateFile = async (url, file, payload) => {
  try {
    const result = await axios.put(`${url}/file/${file}`, payload)
    return [true, result.data]
  } catch (err) {
    return [false, err]
  }
}

export const deleteFile = async (url, file) => {
  try {
    const result = await axios.delete(`${url}/file/${file}`)
    return [true, result.data]
  } catch (err) {
    return [false, err]
  }
}
