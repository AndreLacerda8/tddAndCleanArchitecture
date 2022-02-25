module.exports = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost/clean-node-api',
  tokenSecret: process.env.TOKEN_SECRET || 'secret',
  port: process.env.PORT || 8080
}
