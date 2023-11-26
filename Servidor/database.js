import express from "express";
import mysql from "mysql2";
import cors from "cors";


const app = express();
app.use(express.json(),cors());
//////////////
///////////
const conexion=mysql.createConnection({
    server:'localhost',
    user: 'root',
    password: '',
    database: 'Medicina'    
});
///////////
conexion.connect(function(error){
    if(error){
        console.log("Error al conectar la bd", error)
    }else{
        console.log("conexion realizada exitosamente")
    }
})

//Listar los tours de la BD
app.post('/crearUsuario',(request, response)=>{
    console.log(request.body)

    const sql=`INSERT INTO login(user,gmail,pass) VALUES('${request.body.name}', '${request.body.gmail}', '${request.body.pass}')`
    conexion.query(sql, (error,resultado)=>{
        if(error) return response.json({error: "error en la consulta",error})
        return response.json({usuarios: resultado});
    })
})


app.get('/obtenerUsuarios',(request, response)=>{
    const sql = `SELECT user, pass FROM login;`
    console.log(sql)
    conexion.query(sql, (error,resultado)=>{
        if(error) return response.json({error: "error en la consulta",error})
        return response.json({usuarios: resultado});
    })
})
///////////
app.get('/obtenerMedicina',(request,response)=>{
    const sql = `SELECT * FROM medicina`
    console.log(sql)
    conexion.query(sql,(error,result)=>{
        if(error) return response.json({error: "Error en la consulta", error})
        return response.json({medicina: result})
    })
})
///////////////
app.post('/registrarReceta',(request, response)=>{
    const sql = `INSERT INTO medicamentos (medicina_id, dosis, tiempo, fecha, comentarios) VALUES ( '${request.body.medicina_id}','${request.body.dosis}', '${request.body.tiempo}', '${request.body.fecha}', '${request.body.comentarios}')`;
    conexion.query(sql, (error,resultado)=>{
        if(error) return response.json({error: 'error en la consulta', error})
        return response.json({usuarios: resultado})
    })
})


////

app.get('/obtenerRecetas',(request,response)=>{
    const sql = `CALL ObtenerMedicamentos()`

    conexion.query(sql,(error, result)=>{
        if(error) return response.json({error: 'Error en la consulta', error})

        const listMedicamentos = result[0];
        const listadoMedicamentosFormateado = [];

        listMedicamentos.forEach(element => {
            const time = new Date(element.hora);

            console.log(time.getHours(), element.hora)

            let formattedTime;
            if (time.getHours() >= 0 && time.getHours() < 12) {
                formattedTime = 'Morning';
            } else if (time.getHours() === 12) {
                formattedTime = 'Noon';
            } else if (time.getHours() >= 12 && time.getHours() < 18) {
                formattedTime = 'Evening';
            } else if (time.getHours() >= 18 && time.getHours() < 24) {
                formattedTime = 'Night';
            } else {
                formattedTime = 'Only when i need it';
            }

            listadoMedicamentosFormateado.push({
                ...element,
                hora: formattedTime
            });
        });

        // Envía la respuesta al cliente después de completar el bucle
        return response.json({ Recetas: listadoMedicamentosFormateado });
    });
})

app.put('/actualizarHora', (request, response) => {
    const id_medicamento = request.body.id_medicamento;

    const sql = `UPDATE medicamentos SET hora = NOW() WHERE id_medicamento = ${id_medicamento};`

    console.log(sql)
    conexion.query(sql, (error, result) => {
        if (error) return response.json({ error: 'Error en la consulta' }, error)
        return response.json({ Hora: result })
    })
});



app.listen(8082,()=>{
    console.log("Servidor iniciado ...")
});