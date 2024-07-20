import server from "./server"
import Colors from 'colors'

const port = process.env.PORT || 3000

server.listen(port, () =>{
    console.log(Colors.cyan(`REST API en el puerto ${port}`))
    
})


