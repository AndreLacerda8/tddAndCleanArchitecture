const MongoHelper = require('../helpers/mongo-helper')
const { MissingParamError } = require('../../utils/errors')

let db

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    if (!userId) {
      throw new MissingParamError('userId')
    }
    if (!accessToken) {
      throw new MissingParamError('accessToken')
    }
    await this.userModel.updateOne({
      _id: userId
    }, {
      $set: {
        accessToken
      }
    })
  }
}

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepository(userModel)
  return {
    userModel,
    sut
  }
}

describe('UpdateAccessToken Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = MongoHelper.db
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('should update the user with the given accessToken', async () => {
    const { sut, userModel } = makeSut()
    const response = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 20,
      state: 'any_state',
      password: 'hashed_password'
    })
    const fakeUser = await userModel.findOne(response._id)
    await sut.update(fakeUser._id, 'valid_token')
    const updatedFakeUser = await userModel.findOne(fakeUser._id)
    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  it('should throw if no userModel is provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const userModel = db.collection('users')
    const response = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 20,
      state: 'any_state',
      password: 'hashed_password'
    })
    const fakeUser = await userModel.findOne(response._id)
    const promise = sut.update(fakeUser._id, 'valid_token')
    expect(promise).rejects.toThrow()
  })

  it('should throw if no params are provided', async () => {
    const { sut, userModel } = makeSut()
    const response = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 20,
      state: 'any_state',
      password: 'hashed_password'
    })
    const fakeUser = await userModel.findOne(response._id)
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(fakeUser._id)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
