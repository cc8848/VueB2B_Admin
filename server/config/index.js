export default {
  admin: {
    role: 'superAdmin',
    username: 'b2badmin',
    password: '123456',
    nickname: 'b2bconsole admin',
    avatar: 'avatar.png'
  },
  user: {
    role: 'user',
    username: 'b2buser',
    password: 'user001',
    email: 'test_test@gmail.com',
    nickname: 'b2bconsole',
    motto: 'Never too old to learn',
    avatar: 'avatar.png'
  },
  jwt: {
    secret: 'b2bconsole',
    expiresIn: '2h'
  },
  mongodb: {
    host: '127.0.0.1',
    database: 'b2bconsole',
    port: 27017,
    username: '',
    password: ''
  },
  production: {
    host: '',
    domain: ''
    // domain: 'http://127.0.0.1:3000'
  },
  app: {
    host: '127.0.0.1',
    port: 80,
    routerBaseApi: '/api'
  }
}
