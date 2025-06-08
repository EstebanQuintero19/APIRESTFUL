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

app.get('/productos/:ref', async (req, res) => {
    const productoEncontrado = await modeloProducto.findOne({ referencia: req.params.ref });
    if (productoEncontrado) {
        res.status(200).json(productoEncontrado);
    } else {
        res.status(404).json({ error: 'No se encontró el producto' });
    }
});

app.post('/productos', async (req, res) => {
    const nuevoProducto = {
        referencia: req.body.referencia,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        stock: req.body.stock,
        imagen: req.body.imagen,
        habilitado: req.body.habilitado,
    };
    
    const productoGuardado = await modeloProducto.create(nuevoProducto);
    res.status(201).json({ mensaje: "Registro exitoso", producto: productoGuardado });
});

app.put('/productos/:ref', async (req, res) => {
    const productoEditado = {
        nombre: req.body.nombreProducto,
        descripcion: req.body.descripcionProducto,
        precio: req.body.precioProducto,
        stock: req.body.stockProducto,
        imagen: req.body.imagenProducto,
        habilitado: true,
    };
    
    const actualizacion = await modeloProducto.findOneAndUpdate(
        { referencia: req.params.ref },
        productoEditado,
        { new: true }
    );
    
    if (actualizacion) {
        res.status(200).json({ mensaje: "Actualización exitosa", producto: actualizacion });
    } else {
        res.status(404).json({ mensaje: "Producto no encontrado" });
    }
});

app.delete('/productos/:ref', async (req, res) => {
    const eliminacion = await modeloProducto.findOneAndDelete({ referencia: req.params.ref });
    if (eliminacion) {
        res.status(200).json({ mensaje: "Producto eliminado exitosamente" });
    } else {
        res.status(404).json({ mensaje: "Producto no encontrado" });
    }
});

// Servidor
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});
