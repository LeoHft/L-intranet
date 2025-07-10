import BreezyLoader from '@/Components/Utils/BreezyLoader'

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
      console.log("Attributs de l'utilisateur récupérés:", response)
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
    return <BreezyLoader />
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