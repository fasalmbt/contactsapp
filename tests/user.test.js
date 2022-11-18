const request = require('supertest')
const app = require('../app')

test("Stops accessing view contacts page without login", async()=>{
    const response = await request(app).get('/user/view-contact')
    expect(response.statusCode).toBe(302)
})

test("Stops accessing dashboard without login", async () => {
    const response = await request(app).get('/user/dashboard')
    expect(response.statusCode).toBe(302)
})

test("Stops from changing credentials without login", async()=>{
    const response = await request(app).get('/user/change-credentials/6368c1d4a3d7a2642d21b74c')
    expect(response.statusCode).toBe(302)
})

/*
test('should redirect to /user/login', async () => {
    const response = await request(app).post('/user/login').send({
        username: 'fasalmbt',
        password: 'test123'
    })
    expect(response.headers['Location']).toEqual('/user/dashboard');
})
*/