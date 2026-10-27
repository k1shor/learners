import { useState } from 'react'
import { adminStorageKey, initialAdminData } from './adminData'

const readAdminData = () => {
  try {
    const stored = window.localStorage.getItem(adminStorageKey)
    return stored ? { ...initialAdminData, ...JSON.parse(stored) } : initialAdminData
  } catch {
    return initialAdminData
  }
}

const useAdminData = () => {
  const [data, setData] = useState(readAdminData)

  const updateData = (nextData) => {
    setData((currentData) => {
      const updatedData = typeof nextData === 'function' ? nextData(currentData) : nextData
      window.localStorage.setItem(adminStorageKey, JSON.stringify(updatedData))
      return updatedData
    })
  }

  return [data, updateData]
}

export default useAdminData
