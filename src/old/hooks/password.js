import { useSelector } from 'react-redux'

/**
 * Hook for password generation
 * @return {function}
 */
export const useGenerate = () => {
  const params = useSelector(state => {
    return {
      pattern: state.options.passwordPattern,
      length: state.options.passwordLength
    }
  })

  /**
   * Verifies a string is valid regex
   * @param {string} regex
   * @return {mixed}
   */
  const isValidRegex = regex => {
    try {
      const value = new RegExp(regex)

      return value
    } catch (err) {
      return false
    }
  }

  /**
   * Retrieves a random byte
   * @return {int}
   */
  const getRandomByte = () => {
    if (window.crypto && window.crypto.getRandomValues) {
      const result = new Uint8Array(1)
      window.crypto.getRandomValues(result)
      return result[0]
    } else {
      return Math.floor(Math.random() * 256)
    }
  }

  /**
   * Generates the password
   * @return {string}
   */
  const generatePassword = () => {
    return Array.apply(null, { length: params.length }).map(() => {
      const regex = isValidRegex(params.pattern)
      if (!regex) return ''

      while (true) {
        const result = String.fromCharCode(getRandomByte())
        if (new RegExp(params.pattern).test(result)) {
          return result
        }
      }
    }).join('')
  }

  return generatePassword
}

/**
 * Hook for using the Regex Builder
 * @return {function}
 */
export const useRegexBuilder = () => {
  return params => {
    const result = [
      params.useLower ? 'a-z' : '',
      params.useUpper ? 'A-Z' : '',
      params.useNumbers ? '0-9' : '',
      params.useSymbols ? '@#$%+?!&*|' : '',
      params.useSpecial ? '<>{}[\\]()/\\\'"`~,;:.<>\\-_^' : ''
    ]

    return `[${result.join('')}]`
  }
}
