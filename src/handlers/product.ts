import { Request, Response } from "express"
import Product from "../models/Product.model"



export const productcontroler = {

    createProduct : async (req : Request, res : Response) =>{

        try {
            const product = await Product.create(req.body)
            res.status(201).json({data : product})
        } catch (error) {
            res.json(error)
        }
        
    },

    getProducts : async (req : Request, res : Response) =>{

        try {
            const products = await Product.findAll({
                //filtros
                order: [['price', 'DESC']],
                attributes: {exclude: ['createdAt', 'updatedAt']}
            })
            res.json({data : products})
        } catch (error) {
            res.json(error)
        }
        
    },

    getProductbyid : async (req : Request, res : Response) =>{

        try {
            const products = await Product.findByPk(req.params.id,{
                //filtros
                attributes: {exclude: ['createdAt', 'updatedAt']}
            })
            //comprueba que no sea null
            if(!products){
                res.status(404).json('El producto no existe')
            }else{
                res.json({data : products})
            }
        } catch (error) {
            res.json(error)
        }
        
    },

    deleteproductbyid : async (req : Request, res : Response) =>{
        try {
            //obtenemos el id
            const product = await Product.findByPk(req.params.id)
            //comprobamos que no sea null
            if(!product){
                res.status(404).json('El producto no existe')
            }else{
                //destruimos el objeto
                await product.destroy()
                res.json('Producto eliminado correctamente')
            }
        } catch (error) {
            res.json(error)
        }
    },

    updateproductbyid : async (req : Request, res : Response) =>{
        try {
            //obtenemos el id
            const product = await Product.findByPk(req.params.id)
            //comprobamos que no sea null
            if(!product){
                res.status(404).json('El producto no existe')
            }else{
                //modificamos el objeto
                await product.update(req.body)
                //guardamos el objeto
                await product.save()
                res.status(201).json('Producto actualizado correctamente')
            }
        } catch (error) {
            res.json(error)
        }

    },

    updateavailability : async (req : Request, res : Response) =>{
        try {
            //obtenemos el id
            const product = await Product.findByPk(req.params.id)
            //comprobamos que no sea null
            if(!product){
                res.status(404).json('El producto no existe')
            }else{
                //modificamos el valor, datavalue toma el valor availability de la fila obtenida 
                //y ! lo combierte al contrario
                product.availability = !product.dataValues.availability
                //guardamos el objeto
                await product.save()
                res.status(201).json('disponibilidad actualizada correctamente')
            }
        } catch (error) {
            res.json(error)
        }
    }


}



