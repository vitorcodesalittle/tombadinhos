export interface IUserDB {
  create(user: Omit<UserBasic, '_id'>): Promise<UserBasic>
  update(user: Partial<UserRegistered>): Promise<Partial<UserRegistered>>
}

export interface IUserService {
  create(user: UserBasic): Promise<UserBasic>
  get(token: string): Promise<User>
}

export type User = UserRegistered | UserBasic


export type UserBasic = {
  email: string
  _id: string
}

type GenderId = 'ele' | 'ela' | 'elu'

export type UserRegistered = UserBasic & {
  fullName: string
  genderId: GenderId
  expertiseDescription: string
}

