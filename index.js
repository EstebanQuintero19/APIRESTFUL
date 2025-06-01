require('dotenv').config();


const exp = require('express');
const app = exp();

const logger = require('morgan');
app.use(logger('dev'));

app.use(exp.urlencoded({ extended: false }));
app.use(exp.json());

app.listen(process.env.PORT, () => {
    console.log('Server is running: 9090');
} );


const modeloCliente = require('./backend/models/cliente.model');
app.get('/clientes', async (req, res) => {
    let listaClientes = await modeloCliente.find();
    console.log(listaClientes);
});