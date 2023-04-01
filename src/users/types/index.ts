


export type UserBasic = {
  email: string
  fullName?: string
  genderId?: GenderId
  expertiseDescription?: string
}

type GenderId = 'ele' | 'ela' | 'elu'

export type User = UserBasic & { _id: string }

export interface IUserDB {
  getByEmail(email: string): Promise<User | undefined>
  create(user: UserBasic): Promise<User>
  update(user: User): Promise<Partial<User>>
  setupIndexes(): Promise<void>
}

export interface IUserService {
  create(user: UserBasic): Promise<UserBasic>
  get(token: string): Promise<User>
  update(token: string, update: Partial<User>): Promise<Partial<User>>
  verifyEmail(email: string): Promise<boolean>
}
