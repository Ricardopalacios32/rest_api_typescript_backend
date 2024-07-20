import { Router } from "express";
import {productcontroler} from "./handlers/product";
import { body, param } from "express-validator";

import { handleinputerrors } from "./middleware";

const routerproductos = Router()

/**
 * @swagger
 * components:
 *       schemas:
 *            Product:
 *                  type: object
 *                  properties:
 *                        id:
 *                           type: integer
 *                           description: product id
 *                           example: 1           
 *                        name:
 *                           type: string
 *                           description: product name
 *                           example: Poco x6 Pro
 *                        price:
 *                           type: number   
 *                           description: product price
 *                           example: 350
 *                        availability:
 *                           type: boolean
 *                           description: product availability
 *                           example: true
 * 
 */

/**
 * @swagger
 * /api/productos:
 *          get:
 *              summary: get a list of products
 *              tags: 
 *                  - Products
 *              description: Return a list of Products
 *              responses:
 *                      200:
 *                          description: successfull response
 *                          content: 
 *                                  application/json:
 *                                          schema:
 *                                              type: array
 *                                              items:
 *                                                  $ref: '#/components/schemas/Product'
 */

//obtener todos los productos
routerproductos.get('/', 
    productcontroler.getProducts
)

/**
* @swagger
* /api/productos:
*       post:
*           summary: creates a new product
*           tags:
*               - Products
*           description: Creates a new product
*           requestBody:
*                   required: true
*                   application/json:
*                       schema:
*                           type: object
*                           properties:
*                                   name:
*                                       type: string
*                                       example: Poco x6 prp
*                                   price:
*                                       type: number
*                                       example: 350
*           responses:
*               201:
*                   description: successfful response
*                   content: 
*                                  application/json:
*                                          schema:
*                                              type: array
*                                              items:
*                                                  $ref: '#/components/schemas/Product'
*               400:
*                   description: no valid input data
*/

//crear un producto
routerproductos.post('/',
    //validacion
    body('name')
        .notEmpty().withMessage('El nombre no puede estar vacio'),
    body('price')
        .notEmpty().withMessage('El precio no puede estar vacio')
        .isNumeric().withMessage('Precio tiene que ser un valor numerico')
        .custom((value) => value > 0).withMessage('El precio no puede ser negativo'),
    //ejecucion
    handleinputerrors,
    productcontroler.createProduct
)

/**
*@swagger
* /api/productos/{id}:
*          get:
*              summary: get a product by id
*              tags: 
*                  - Products
*              description: Return a Product by his id
*              parameters: 
*                  - in: path
*                    name: id
*                    description: The ID of the product to return
*                    required: true
*                    schema:
*                        type: integer
*              responses:
*                      200:
*                          description: successfull response
*                          content: 
*                                  application/json:
*                                          schema:
*                                              type: array
*                                              items:
*                                                  $ref: '#/components/schemas/Product'
*                      404:
*                          description: Object not found - invalid url
*                      400:
*                          description: Bad request
*/

//obtener 1 producto por id
routerproductos.get('/:id', 
    //validacion
    param('id')
        .notEmpty().withMessage('Debes proporciona un ID')
        .isNumeric().withMessage('El id debe ser un numero')
        .custom((value) => value > 0).withMessage('El id no puede ser negativo'),
    //ejecucion
    handleinputerrors,
    productcontroler.getProductbyid
)

/**
* @swagger 
* /api/productos/{id}:
*       put:
*           summary: Updates a product by his id
*           tags:
*               - Products
*           description: Updates a product
*           parameters: 
*                 - in: path
*                   name: id
*                   description: The ID of the product to update
*                   required: true
*                   schema:
*                       type: integer
*           requestBody:
*                   required: true
*                   content:
*                       application/json:
*                           schema:
*                               type: object
*                               properties:
*                                   name:
*                                       type: string
*                                       example: Poco x6 prp
*                                   price:
*                                       type: number
*                                       example: 350
*                                   availability:
*                                       type: boolean
*                                       example: true
*           responses:
*               201:
*                   description: successfful response
*               400:
*                   description: no valid input data - unvalid id
*               404:
*                   description: product not found
*/

//actualizar producto
//put reemplaza la fila especificada en la BD con lo que le mandes en el body, 
//osea si solo mandas price actualizara price y lo demas se borrara
routerproductos.put('/:id',
    param('id')
        .notEmpty().withMessage('Debes proporciona un ID')
        .isNumeric().withMessage('El id debe ser un numero')
        .custom((value) => value > 0).withMessage('El id no puede ser negativo'),
    body('name')
        .notEmpty().withMessage('El nombre no puede estar vacio'),
    body('price')
        .notEmpty().withMessage('El precio no puede estar vacio')
        .isNumeric().withMessage('Precio tiene que ser un valor numerico')
        .custom((value) => value > 0).withMessage('El precio no puede ser negativo'),
    body('availability')
        .isBoolean().withMessage('valor para disponibilidad no valido'),
    //ejecucion
    handleinputerrors,
    productcontroler.updateproductbyid
)

/**
* @swagger
* /api/productos/availability/{id}:
*   patch:
*       summary: updates a product availability by his id
*       tags:
*           - Products
*       description: update a product availability
*       parameters: 
*                 - in: path
*                   name: id
*                   description: The ID of the product to update
*                   required: true
*                   schema:
*                       type: integer
*       responses:
*           201:
*               description: successfull response
*           404: 
*               description: product not found 
*           400:
*               description: not valid url
*/

//actualizar disponibilidad
//patch a diferencia de put tiene la capacidad de actualizar un campo solo mandando ese parametro
//no borra el resto de columnas como put
routerproductos.patch('/availability/:id', 
    param('id')
        .notEmpty().withMessage('Debes proporciona un ID')
        .isNumeric().withMessage('El id debe ser un numero')
        .custom((value) => value > 0).withMessage('El id no puede ser negativo'),
    //ejecucion
    handleinputerrors,
    productcontroler.updateavailability
)

/**
* @swagger
* /api/productos/{id}:
*   delete:
*       summary: deletes a product by his id
*       tags:
*           - Products
*       description: deletes a product
*       parameters: 
*                 - in: path
*                   name: id
*                   description: The ID of the product to delete
*                   required: true
*                   schema:
*                       type: integer
*       responses:
*           200:
*               description: successfull response
*           404: 
*               description: product not found 
*           400:
*               description: not valid url
*/

routerproductos.delete('/:id', 
    //validacion
    param('id')
        .notEmpty().withMessage('Debes proporciona un ID')
        .isNumeric().withMessage('El id debe ser un numero')
        .custom((value) => value > 0).withMessage('El id no puede ser negativo'),
    //ejecucion
    handleinputerrors,
    productcontroler.deleteproductbyid
)


export default routerproductos