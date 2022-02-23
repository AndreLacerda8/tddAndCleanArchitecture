module.exports = {
  isValid: true,
  value: '',
  hahs: '',

  async compare (value, hash) {
    this.value = value
    this.hash = hash
    return this.isValid
  }
}
