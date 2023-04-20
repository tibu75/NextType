export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  user: string
  password: string
}
export type TokenDataType = {
  value: string
  expire: string
}

export type RegisterParams = {
  email: string
  user: string
  password: string
}
type MenuItemType = {
  icon: string
  title: string
  path: string
  subject?: string
  action?: string
  children?: MenuItemType[]
}


export type UserDataType = {
  _id: string
  role: string[]
  email: string
  surname: string
  state: boolean
  name: string
  menu: MenuItemType[]
  user: string
  avatar?: string | null
  avatarColor?: string | null
  area: string | null
  org: string | null
  password: string | null
  phone: string | null
  lastLogin: string | null
}

export type AuthValuesType = {
  loading: boolean
  setLoading: (value: boolean) => void
  logout: () => void
  isInitialized: boolean
  user: UserDataType | null
  setUser: (value: UserDataType | null) => void
  setIsInitialized: (value: boolean) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
}
