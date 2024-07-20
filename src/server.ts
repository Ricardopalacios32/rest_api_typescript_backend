import  Express from "express";
import  Colors  from "colors";
import cors, {CorsOptions} from "cors"
import morgan from 'morgan'
import swaggerUi, { serve } from 'swagger-ui-express'
import swaggerSpec, {swaggerUiOptions} from "./config/swagger";
import routerproductos from "./router";
import db from "./config/db";

async function conectdb() {
    
    try {
        await db.authenticate()
        db.sync()
        //console.log(Colors.magenta.bold('conexion exitosa'))
        
    } catch (error) {
        console.log(Colors.red.bold('error :'+ error))
    }
    
}

conectdb()

//instancia de express
const server = Express()

//permitir cors

const corsOptions : CorsOptions = {
    origin: function(origin, callback) {
        if(origin === process.env.FRONTEND_URL){
            callback(null,true)
        }else{
            callback(new Error('error de cors'))
        }
    }
}

server.use(cors(corsOptions))


//leer datos
server.use(Express.json())

//morgan

server.use(morgan('dev'))

//routing

server.use('/api/productos', routerproductos)

//docs

server.use('/docs',swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

server.get('/api', (req, res)=>{
    res.json({msg : 'desde api'})
})

export default server