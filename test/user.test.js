import supertest from "supertest"
import { web } from "../src/application/web.js"
import { logger } from "../src/application/logging.js"
import { createTestUser, getTestUser, removeTestUser } from "./test-util.js"
import bcyrpt from "bcrypt"

describe('POST /api/users', () => {
    afterEach(async () => [
        await removeTestUser()
    ])
    it('should can register new user', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: '123',
                name: 'test'
            })
        
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe("test");
        expect(result.body.data.password).toBeUndefined();
    })

    it('should reject if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: '',
                password: '',
                name: ''
            })
        
        logger.info(result.body)

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    })

    it('should be rejected if user already exist', async () => {
        let result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: '123',
                name: 'test'
            })
        
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe("test");
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: '123',
                name: 'test'
            })
        
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    })
})


describe("POST /api/users/login", () => {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser()
    })

    it('should can login', async () => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
            username: "test",
            password: '123'
        })

        logger.info(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.token).toBeDefined()
        expect(result.body.data.token).not.toBe("test")
    })

    it('should reject if request invalid', async () => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
            username: "",
            password: ''
        })

        logger.info(result.body)

        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })

    it('should reject if password wrong', async () => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
            username: "test",
            password: '122'
        })

        logger.info(result.body)

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })

    it('should reject if username wrong', async () => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
            username: "test1",
            password: '123'
        })

        logger.info(result.body)

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
})


describe("GET /api/users/current", () => {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser()
    })

    
    it('should can get current user', async () => {
        const result = await supertest(web)
        .get('/api/users/current')
        .set('Authorization', 'test')
        
        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe('test')
        expect(result.body.data.name).toBe('test')
    })
    logger.info()
    
    it('should reject if token invalid', async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'salah')
        
        expect(result.status).toBe(401)
    })
})


describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser()
    })

    it('should can update user', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set("Authorization", "test")
            .send({
                name: "ghozi",
                password: "123lagi"
            })
        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("test")
        expect(result.body.data.name).toBe("ghozi")

        const user = await getTestUser()
        expect(await bcyrpt.compare('123lagi', user.password)).toBe(true)
    })

    it('should can update name only', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set("Authorization", "test")
            .send({
                name: "ghozi",
            })
        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("test")
        expect(result.body.data.name).toBe("ghozi")

    })

    it('should can update password only', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set("Authorization", "test")
            .send({
                password: "123lagi"
            })
        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("test")
        expect(result.body.data.name).toBe("test")

        const user = await getTestUser()
        expect(await bcyrpt.compare('123lagi', user.password)).toBe(true)
    })
})


describe("DELETE api/users/logout", () => {
    
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser()
    })

    it('should can logout user', async() => {
        const result = await supertest(web)
            .delete("/api/users/logout")
            .set("Authorization", "test")

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("ok");

        const user = await getTestUser()
        expect(user.token).toBeNull();
    })

    it('reject logout if token is invalid', async() => {
        const result = await supertest(web)
            .delete("/api/users/logout")
            .set("Authorization", "salah")

        expect(result.status).toBe(401);
    })
})