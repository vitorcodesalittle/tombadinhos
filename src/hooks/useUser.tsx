import { User } from "@/users/types"
import axios from "axios"
import { ReactNode, createContext, useContext, useState } from "react"

type ApiResponse<T = undefined> = {
  data: T,
  message?: string
}
export interface IUserClientContext {
  user?: User
  fetchUser: (token: string) => Promise<void>
  verifyEmail: (email: string) => Promise<void>
}

const UserContext = createContext<IUserClientContext>({
  fetchUser(_token) {
    throw new Error('not implemented')
  },
  verifyEmail(email) {
    throw new Error('not implemented')
  },
})

const base = 'http://localhost:8080'
const api = axios.create({
  baseURL: `${base}/api`,
})
const getToken = () => localStorage.getItem('app-token')
const setToken = (token: string) => localStorage.setItem('app-token', token)
api.interceptors.request.use((req) => {
  req.headers.set('Authorization', `Bearer ${getToken()}`)
  return req
})
export const UserContextProvider = (props: { children: ReactNode }) => {
  const [ user, setUser ] = useState<User | undefined>()
  const fetchUser = async (token: string) => {
    return api.get<ApiResponse<User>>('/api/user')
      .then(res => {
        if (res.status === 200) {
          setUser(res.data.data)
        }
      })
      .catch(err => {
        // TODO: handle error feedback
        console.error(err)
      })
  }
  const verifyEmail = async (email: string, code: string) => {
    return api.post<ApiResponse<{token: string}>>('/api/login')
      .then(res => {
        if (res.status === 200) {
          setToken(res.data.data.token)
        }
      })
      .catch(err => {
        // TODO: handle error feedback
        console.error(err)
      })
  }
  return <UserContext.Provider value={{
    user,
    fetchUser,
    verifyEmail
  }}>
    {props.children}
  </UserContext.Provider>
}
export const useUser = () => {
  const value = useContext(UserContext)
  return value
}
