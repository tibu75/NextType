// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from '../configs/auth'

// ** Types
import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType, UserDataType } from './types'
import toast from 'react-hot-toast'
import { styled, useTheme } from '@mui/material/styles'
import { dispatch } from 'react-hot-toast/dist/core/store'
import { handleSetUserData } from 'src/store/auth'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const theme = useTheme()
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [isInitialized, setIsInitialized] = useState<boolean>(defaultProvider.isInitialized)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setIsInitialized(true)
      const storedToken = window.sessionStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)
        await axios
          .get(authConfig.userEndpoint, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          })
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.userData })
          })
          .catch(() => {
            sessionStorage.removeItem('userData')
            sessionStorage.removeItem('refreshToken')
            sessionStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async res => {
        console.log('res', res)
        window.sessionStorage.setItem(authConfig.storageTokenKeyName, res.data.accessToken)
        axios
          .get(authConfig.userEndpoint, {
            headers: {
              Authorization: `Bearer ${window.sessionStorage.getItem(authConfig.storageTokenKeyName)!}`
            }
          })
          .then(async response => {
            /* const returnUrl = router.query.returnUrl */
            toast.success('Ingreso exitoso', {
              position: 'bottom-right',
              style: {
                padding: '16px',
                color: theme.palette.primary.main,
                border: `1px solid ${theme.palette.primary.main}`
              },
              iconTheme: {
                primary: theme.palette.primary.main,
                secondary: theme.palette.primary.contrastText
              },
              duration: 1500
            })
            const returnUrl = '/'


            setUser({ ...response.data.userData })
            await window.sessionStorage.setItem('userData', JSON.stringify(response.data.userData))

            const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

            router.replace(redirectURL as string)
          })
          .catch(err => {
            if (errorCallback) errorCallback(err)
            return err.response.data
          })
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
        return err.response.data
      })
  }

  const handleLogout = () => {
    setUser(null)
    setIsInitialized(false)
    window.sessionStorage.removeItem('userData')
    window.sessionStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ usuario: params.usuario, password: params.password })
        }
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
