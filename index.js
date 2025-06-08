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
    try {
        const listaClientes = await modeloCliente.find();
        res.json(listaClientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
});

app.get('/productos/:ref', async (req, res) => {
    try {
        const productoEncontrado = await modeloProducto.findOne({ referencia: req.params.ref });
        if (productoEncontrado) {
            res.status(200).json(productoEncontrado);
        } else {
            res.status(404).json({ error: 'No se encontró el producto' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el producto' });
    }
});

app.post('/productos', async (req, res) => {
    try {
        const nuevoProducto = {
            referencia: req.body.referenciaProducto,
            nombre: req.body.nombreProducto,
            descripcion: req.body.descripcionProducto,
            precio: req.body.precioProducto,
            stock: req.body.stockProducto,
            imagen: req.body.imagenProducto,
            habilitado: true,
        };
        
        const productoGuardado = await modeloProducto.create(nuevoProducto);
        res.status(201).json({ mensaje: "Registro exitoso", producto: productoGuardado });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

app.put('/productos/:ref', async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

app.delete('/productos/:ref', async (req, res) => {
    try {
        const eliminacion = await modeloProducto.findOneAndDelete({ referencia: req.params.ref });
        if (eliminacion) {
            res.status(200).json({ mensaje: "Producto eliminado exitosamente" });
        } else {
            res.status(404).json({ mensaje: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

// Servidor
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});