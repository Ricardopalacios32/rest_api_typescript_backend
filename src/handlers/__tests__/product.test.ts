import  request  from "supertest";
import server from "../../server";
import { response } from "express";

describe('POST api/products',()=>{
    test('should display validation errors', async ()=>{
        const res = await request(server).post('/api/productos').send({})

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(4)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toBe(2)
    })

    test('should validate that the price is greater than 0', async ()=>{
        const res = await request(server).post('/api/productos').send({
            name : "poco x3 pro test",
            price : 0
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toBe(2)
    })

    test('should create a new product', async ()=>{

        const res = await request(server).post('/api/productos').send({
            name : "poco a13 test",
            price : 150
        })

        expect(res.status).toEqual(201)
        expect(res.body).toHaveProperty('data')

        expect(res.status).not.toBe(404)
        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('error')
    })
})

describe('GET api/products', ()=>{

    test('url should exist', async ()=>{
        const res = await request(server).get('/api/productos/:id')
        expect(res.status).not.toBe(404)
    })

    test('should check that api/products api exist', async ()=>{
        const res = await request(server).get('/api/productos')
        expect(res.status).not.toBe(404)
    })

    test('Get a json response with products', async ()=>{
        const res = await request(server).get('/api/productos')

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')
        expect(res.headers['content-type']).toMatch(/json/)

        expect(res.status).not.toBe(404)
        expect(res.body).not.toHaveProperty('error')
    })
})

describe('GET api/productos/:id', ()=>{
    
    test('url should exist', async ()=>{
        const res = await request(server).get('/api/productos/:id')
        expect(res.status).not.toBe(404)
    })

    test('should return 404 if the product doesnt exist', async()=>{
        
        const res = await request(server).get('/api/productos/100000000')
        expect(res.status).toBe(404)
        expect(res.body).toBe('El producto no existe')
    })

    test('should check a valid ID in the url', async ()=>{
        const res = await request(server).get('/api/productos/notvalidurl')
        
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors[0].msg).toBe('El id debe ser un numero')
    })

    test('Gets a Json response', async ()=>{
        const res = await request(server).get('/api/productos/1')
        
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')
        
    })
})

describe('PUT api/productos/:id', ()=>{

    test('should check a valid ID in the url', async ()=>{
        const res = await request(server).put('/api/productos/notvalidurl').send({
            name : "poco",
            price: 20,
            availability: true
        })
        
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(2)
        expect(res.body.errors[0].msg).toBe('El id debe ser un numero')
    })

    test('should return 404 if the product doesnt exist', async()=>{
        
        const res = await request(server).put('/api/productos/100000000').send({
            name : "poco",
            price: 20,
            availability: true
        })
        expect(res.status).toBe(404)
        expect(res.body).toBe('El producto no existe')
        
        expect(res.body).not.toHaveProperty('data');
    })

    test('should display validation error messages', async ()=>{
        const res = await request(server).put('/api/productos/1').send({})

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toBeTruthy();
        expect(res.body.errors).toHaveLength(5);
        
        expect(res.body).not.toHaveProperty('data');

    })

    test('should update an existing product with valid data', async()=>{
        
        const res = await request(server).put('/api/productos/1').send({
            name : "poco x6 pro",
            price: 350,
            availability: true
        })
        expect(res.status).toBe(201)
        expect(res.body).toBe('Producto actualizado correctamente')
        
        expect(res.body).not.toHaveProperty('errors');
    })

    test('should validate that price is grater than 0', async ()=>{
        const res = await request(server).put('/api/productos/1').send({
            
            name : "poco",
            price: -20,
            availability: true
            
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toBeTruthy();
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors[0].msg).toBe('El precio no puede ser negativo')
        
        expect(res.status).not.toHaveProperty('data');

    },)
})

describe('patch api/productos/availability/:id', ()=>{
    test('should return 404 if the product doesnt exist', async()=>{
        
        const res = await request(server).patch('/api/productos/availability/100000000')
        expect(res.status).toBe(404)
        expect(res.body).toBe('El producto no existe')
        
        expect(res.body).not.toHaveProperty('data');
        expect(response.status).not.toBe(200)
    })

    test('should update availability', async()=>{
        
        const res = await request(server).patch('/api/productos/availability/1')
        expect(res.status).toBe(200)
        expect(res.body).toBe('disponibilidad actualizada correctamente')
        
        expect(res.body).not.toHaveProperty('errors');
        expect(response.status).not.toBe(404)
    })
})

describe('DELETE api/productos/:id', ()=>{
    test('should check a valid id', async ()=>{
        const res = await request(server).delete('/api/productos/notvalid')
        
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(2)
        expect(res.body.errors[0].msg).toBe('El id debe ser un numero')
    })

    test('should return a 404 response for an nonexistent product', async ()=>{
        const res = await request(server).delete('/api/productos/2000000')

        expect(res.status).toBe(404)
        expect(res.body).toBe('El producto no existe')

        expect(res.body).not.toHaveProperty('data')
        expect(res.status).not.toBe(200)
        
    })

    test('should delete a product', async()=>{
        const res = await request(server).delete('/api/productos/1')

        expect(res.status).toBe(200)
        expect(res.body).toBe('Producto eliminado correctamente')

        expect(res.status).not.toBe(400)
        expect(res.status).not.toBe(404)
    })

})