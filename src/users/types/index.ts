


export type UserBasic = {
  email: string
  _id: string
}

type GenderId = 'ele' | 'ela' | 'elu'

export type UserRegistered = UserBasic & Partial<{
  fullName: string
  genderId: GenderId
  expertiseDescription: string
}>

export type User = UserRegistered | UserBasic

export interface IUserDB {
  getByEmail(email: string): Promise<User | undefined>
  create(user: Omit<UserBasic, '_id'>): Promise<UserBasic>
  update(user: Partial<UserRegistered>): Promise<User>
  setupIndexes(): Promise<void>
}

export interface IUserService {
  create(user: UserBasic): Promise<UserBasic>
  get(token: string): Promise<User>
  update(token: string, update: Partial<UserRegistered>): Promise<User>
  verifyEmail(email: string): Promise<boolean>
}
