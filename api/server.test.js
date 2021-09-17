const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server')
const jokes = require('./jokes/jokes-data')

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

describe('[POST] /api/auth/register', () => {
  it('returns a 201 OK status', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'test', password: '1234' })
    expect(res.status).toBe(201)
  })

  it('responds with a 422 if no username or password in payload', async () => {
    let res = await request(server)
      .post('/api/auth/register')
      .send({ username: '', password: '1234' })
    expect(res.status).toBe(422)
    res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'test1', password: '' })
    expect(res.status).toBe(422)
  })

  it('responds with the newly registered user', async () => {
    let res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'test2', password: '1234' })
    expect(res.body).toMatchObject({ id: 2, username: 'test2' })
  })
})

describe('[POST] /api/auth/login', () => {
  it('responds with a 200 OK status', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'test', password: '1234' })
    expect(res.status).toBe(200)
  })

  it('responds with a 422 if no username or password in payload', async () => {
    let res = await request(server)
      .post('/api/auth/login')
      .send({ username: '', password: '1234' })
    expect(res.status).toBe(422)
    res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'test3', password: '' })
    expect(res.status).toBe(422)
  })
})

describe('[GET] /api/jokes', () => {
  it('responds with dad jokes if given valid token', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'test', password: '1234' })
    const dadJokes = await request(server)
      .get('/api/jokes')
      .set({ authorization: res.body.token })
    expect(dadJokes.body).toMatchObject(jokes)
  })

  it('responds with a 407 if no token provided', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.status).toBe(407)
  })
})
