import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { socketServer } from "../App.js"

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const productsFilePath = path.join(__dirname, '../data/products.json')

const readProducts = () => {
    if (!fs.existsSync(productsFilePath)) {
     return []
    }
   
    const data = fs.readFileSync(productsFilePath, 'utf-8')
    return JSON.parse(data)

}

router.get('/',(req,res) => {
    res.render('index')    
})

router.get('/home', (req, res) => {
    const products = readProducts()    
    res.render('home', { products })
})

router.get('/realtimeproducts', (req, res) => {
    const products = readProducts(); // Obtener los productos actuales
    res.render('realTimeProducts', { products })

    // Después de agregar, actualizar o eliminar un producto
    socketServer.emit('productUpdate', readProducts())
})



export default router