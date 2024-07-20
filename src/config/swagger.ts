
import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options : swaggerJSDoc.Options = {

    swaggerDefinition:{
        openapi : '3.0.2',
        tags: [{
            name: "Products",
            description: 'API operations related to product'
        }],
        info:{
            title:'Rest API Node.JS/Express/Typescript',
            version: '1.0.0',
            description: 'Api docs for Products'
        },

        
    },
    apis: ['./src/router.ts']
}

const swaggerSpec = swaggerJSDoc(options)
//copiar ojo
const swaggerUiOptions: SwaggerUiOptions = {
    customCss : `
        .topbar-wrapper .link{
            content: url('');
            height: 80px;
            width: 20px;
        }
    `,
    customSiteTitle: 'Documentacion REST API Express/Jest/Typescript'
}
export default swaggerSpec

export {swaggerUiOptions}