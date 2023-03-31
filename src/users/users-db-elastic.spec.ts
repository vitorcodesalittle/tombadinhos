import { getEsConfig } from "@/places/places-db-elastic"
import { UserDbElastic } from "./users-db-elastic"
import { config } from "@/config"
import { deleteAll } from "../../test/utils"
describe('UserDbElastic', () => {
  let userDb: UserDbElastic

  beforeAll(async() => {
    userDb = new UserDbElastic(getEsConfig(config))
    await userDb.setupIndexes()
    await deleteAll('users')
  })
    

  describe('create', () => {
    it('should create a user', async () => {
      const email = 'user@domain.com'
      const user = {
        email
      }
      const createdUser = await userDb.create(user)
      expect(createdUser.email).toBe(email)
      expect(createdUser._id).toBeTruthy()

      const gotUser = await userDb.getByEmail(user.email)
      expect(gotUser).toEqual(createdUser)
    })
  })

  describe('update', () => {
    it ('should update a user', async () => {
      const mockedUser = await userDb.create({
        email: 'user@domain.com'
      })
      const fullName = 'ijasijd';
      const updatedUser = await userDb.update({
        _id: mockedUser._id,
        email: mockedUser.email,
        fullName,
        genderId: 'elu'
      })
      expect(updatedUser.fullName).toBe(fullName)
      expect(updatedUser.genderId).toBe('elu')
    })
  })
})
