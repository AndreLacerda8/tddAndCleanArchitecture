const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
// const { MissingParamError } = require('../../utils/errors')

let userModel

const makeSut = () => {
  return new LoadUserByEmailRepository()
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('should return null if no user is found', async () => {
    const sut = makeSut()
    const user = await sut.load('invalid_email@mail.com')
    expect(user).toBeNull()
  })

  it('should return an user if user is found', async () => {
    const sut = makeSut()
    const response = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 20,
      state: 'any_state',
      password: 'hashed_password'
    })
    const fakeUser = await userModel.findOne(response._id)
    const user = await sut.load('valid_email@mail.com')
    expect(user).toEqual({
      _id: fakeUser._id,
      password: fakeUser.password
    })
  })

  it('should throw if no userModel is provided', async () => {
    const sut = new LoadUserByEmailRepository()
    const promise = sut.load('any_email@mail.com')
    expect(promise).rejects.toThrow()
  })

  // it('Should throw if no email is provided', async () => {
  //   const sut = makeSut()
  //   const promise = sut.load()
  //   expect(promise).rejects.toThrow(new MissingParamError('email'))
  // })
})
