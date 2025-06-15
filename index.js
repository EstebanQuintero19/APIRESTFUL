require('dotenv').config();

const express = require('express');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Modelos
const modeloCliente = require('./backend/models/cliente.model');
const modeloProducto = require('./backend/models/producto.model');

// Rutas
app.get('/clientes', async (req, res) => {
    const listaClientes = await modeloCliente.find();
    res.json(listaClientes);
});

app.post('/clientes', async (req, res) => {
    const nuevoCliente = new modeloCliente({
        documento: req.body.documento,
        nombreCompleto: req.body.nombreCompleto,
        fechaNacimiento: req.body.fechaNacimiento,
    });

    try {
        const clienteGuardado = await nuevoCliente.save();
        res.status(201).json({ "mensaje": "Cliente creado exitosamente", cliente: clienteGuardado });
    } catch (err) {
        console.error("Error al guardar el cliente:", err);
        res.status(400).json({ "mensaje": "Error al crear el cliente", error: err.message });
    }
});


//PRODUCTOS
//producto--GET
app.get('/productos', async (req, res) => {
    try {
        const productos = await modeloProducto.find();
        res.status(200).json(productos);
    } catch (err) {
        console.error("Error al obtener los productos:", err);
        res.status(500).json({ "mensaje": "Error al obtener los productos" });
    }
});

//producto--byId
app.get('/productos/:ref', async (req, res) => {
    let productoEncontrado = await modeloProducto.findOne({ referencia: req.params.ref });
    if (productoEncontrado) {
        res.status(200).json(productoEncontrado);
    } else {
        res.status(404).json({ "error": 'No se encontró el producto' });
    }
});

//producto--POST
app.post('/productos', async (req, res) => {
    try {
        const nuevoProducto = {
            referencia: req.body.referenciaProducto,
            nombre: req.body.nombreProducto,
            descripcion: req.body.descripcionProducto,
            precio: req.body.precioProducto,
            stock: req.body.stockProducto,
            imagen: req.body.imagenProducto,
            habilitado: true
        };

        const insercion = await modeloProducto.create(nuevoProducto);

        res.status(201).json(insercion);

    } catch (err) {
        console.error('Error al crear el producto:', err.message);
        res.status(400).json({ mensaje: 'Error al crear el producto', error: err.message });
    }
});


//producto--PUT
app.put('/productos/:ref', async (req, res) => {
    const productoEditado = {
        referencia: req.params.ref,
        nombre: req.body.nombreProducto,
        descripcion: req.body.descripcionProducto,
        precio: req.body.precioProducto,
        stock: req.body.stockProducto,
        imagen: req.body.imagenProducto,
        habilitado: true,
    };

    try {
        const actualizacion = await modeloProducto.findOneAndUpdate(
            { referencia: req.params.ref },
            productoEditado,
            { new: true }
        );

        if (actualizacion) {
            res.status(200).json({ "mensaje": "Actualización exitosa", producto: actualizacion });
        } else {
            res.status(404).json({ "mensaje": "Producto no encontrado" });
        }
    } catch (err) {
        console.error("Error al actualizar el producto:", err);
        res.status(400).json({ "mensaje": "Error al actualizar el producto" });
    }
});

//producto--DELETE
app.delete('/productos/:ref', async (req, res) => {
    const eliminacion = await modeloProducto.findOneAndDelete({ referencia: req.params.ref });
    if (eliminacion) {
        res.status(200).json({ "mensaje": "Producto eliminado exitosamente" });
    } else {
        res.status(404).json({ "mensaje": "Producto no encontrado" });
    }
});


// Servidor
app.listen(process.env.PORT || 9090, () => {
    console.log(`Servidor corriendo en el puerto: ${process.env.PORT || 9090}`);
});
