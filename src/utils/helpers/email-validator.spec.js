jest.mock('validator', () => ({
  isEmailValid: true,

  isEmail (email) {
    this.email = email
    return this.isEmailValid
  }
}
))

const validator = require('validator')
const EmailValidator = require('./email-validator')
const MissingParamError = require('../errors/missing-param-error')

const makeSut = () => {
  return new EmailValidator()
}

describe('Email Validator', () => {
  it('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_email@mail.com')
    expect(isEmailValid).toBe(true)
  })

  it('Should return false if validator returns false', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isEmailValid = sut.isValid('invalid_email@mail.com')
    expect(isEmailValid).toBe(false)
  })

  it('Should call validator with correct email', () => {
    const sut = makeSut()
    sut.isValid('any_email@mail.com')
    expect(validator.email).toBe('any_email@mail.com')
  })

  it('should throw if no email is provided', async () => {
    const sut = makeSut()
    expect(() => { sut.isValid() }).toThrow(new MissingParamError('email'))
  })
})
