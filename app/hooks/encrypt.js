import 'regenerator-runtime'
import crypto from 'crypto'
import aesjs from 'aes-js'

export const useHashPassword = () => {
  const hashPassword = password => {
    return new Promise((resolve, reject) => {
      try {
        const keySize = 32
        crypto.scrypt(password, '', keySize, (err, result) => {
          if (err) throw err

          resolve(result)
        })
      } catch (err) {
        reject(err.message)
      }
    })
  }

  return async (password) => {
    try {
      const hash = await hashPassword(password)

      return [true, hash]
    } catch (err) {
      return [false, err.message]
    }
  }
}

export const useEncryptCredentials = () => {
  const prepareJson = object => {
    try {
      const prepared = object.map(val => {
        return [val.title, val.username, val.password]
      })

      const subject = JSON.stringify(prepared)
      const result = subject.substring(0, subject.length - 3).substring(3)

      return [true, result]
    } catch (err) {
      return [false, err]
    }
  }

  return async (payload, key) => {
    try {
      const [success, prepared] = prepareJson(payload)

      if (!success) throw new Error('Failed preparation')

      const data = aesjs.utils.utf8.toBytes(prepared)
      const counter = new aesjs.ModeOfOperation.ctr(key) // eslint-disable-line

      const encrypted = counter.encrypt(data)
      const hex = aesjs.utils.hex.fromBytes(encrypted)

      return [true, hex]
    } catch (err) {
      return [false, err.message]
    }
  }
}

export const useDecryptCredentials = () => {
  const fixObject = string => {
    try {
      const prepared = JSON.parse(`[["${string}"]]`)

      const result = prepared.map((val, index) => {
        return {
          id: index,
          title: val[0],
          username: val[1],
          password: val[2]
        }
      })

      return [true, result]
    } catch (err) {
      return [false, err.message]
    }
  }

  return async (payload, key) => {
    try {
      const encrypted = aesjs.utils.hex.toBytes(payload)
      const counter = new aesjs.ModeOfOperation.ctr(key) // eslint-disable-line

      const decrypted = counter.decrypt(encrypted)
      const data = aesjs.utils.utf8.fromBytes(decrypted)

      const [success, fixed] = fixObject(data)

      if (!success) throw new Error('Parsing failed')

      return [true, fixed]
    } catch (err) {
      return [false, err.message]
    }
  }
}
