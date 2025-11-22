import IntranetLoader from '@/Components/Utils/IntranetLoader'

import { getCurrentUserInfo } from '@/api/modules/users'

import { createContext, useContext, useEffect, useState } from 'react'

// Création du contexte
const AuthAttributesContext = createContext(null)

export const AuthAttributesProvider = ({ children }) => {
  const [userAttributes, setUserAttributes] = useState(null)
  const [isLoading, setIsLoading] = useState(true) // Initialisé à true !
  const [hasError, setHasError] = useState(false)

  const FetchUserAttributes = async () => {
    setHasError(false)
    setIsLoading(true)
    try {
      const response = await getCurrentUserInfo()
      setUserAttributes(response)
    } catch (err) {
      console.error("Erreur lors de la récupération des attributs:", err)
      setUserAttributes(null)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    FetchUserAttributes()
  }, [])


  if (isLoading) {
    return <IntranetLoader />
  }

  return (
    <AuthAttributesContext.Provider
      value={{ userAttributes, FetchUserAttributes, hasError, isLoading }}
    >
      {children}
    </AuthAttributesContext.Provider>
  )
}

export const useAuthAttributes = () => useContext(AuthAttributesContext)