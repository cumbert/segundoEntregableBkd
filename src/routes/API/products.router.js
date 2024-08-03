import express from "express"
import fs from "fs"
import { fileURLToPath } from 'url';
import path from 'path';
import { socketServer } from "../../App.js"

// Convierte la URL del módulo actual a una ruta de archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFilePath = path.join(__dirname, '../../data/products.json')

const router = express.Router()

const readProducts = () => {
    if (!fs.existsSync(productsFilePath)) {
     return []
    }
   const data = fs.readFileSync(productsFilePath, 'utf-8')
   return JSON.parse(data)
 }

router.get('/products', (req, res) => {
    res.json(readProducts());
    
})


router.get("/products/:pid",(req,res) =>{    
    const pid = parseInt(req.params.pid) 
    const products =  readProducts() 
    const productoEncontrado = products.find( (product) => product.pid === pid )    
    if(productoEncontrado){
        res.json(productoEncontrado)
    }else {
        res.status(404).json({message: "Producto no encontrado"})
    }

})

router.post('/products', (req, res) => {    

    const { title, description, code, price, status , stock, category, thumbnail } = req.body
    const products = readProducts()
    const pid = products.length + 1
    const newProduct = { pid, title, description, code, price, status : true , stock, category, thumbnail }

    products.push(newProduct)
    writeProducts(products)

    res.json({ message: 'Producto agregado'})


    })    
    
    const writeProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2))
      
}

router.put('/products/:pid', (req, res) => {
    const pid = parseInt(req.params.pid)
    const updatedFields = req.body
    let products = readProducts()
    const productIndex = products.findIndex(p => p.pid == pid)

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' })
    }
     
   const updatedProduct = { ...products[productIndex], ...updatedFields }

    products[productIndex] = updatedProduct
    writeProducts(products)

    res.json({ message: 'Producto actualizado'})

})
    
router.delete('/products/:pid', (req, res) => {
    const { pid } = req.params
    let products = readProducts()
    const filteredProducts = products.filter(p => p.pid != pid)

    if (filteredProducts.length === products.length) {
        return res.status(404).json({ message: 'Producto no encontrado' })
    }

    writeProducts(filteredProducts)

    res.json({ message: 'Producto eliminado' })

})




export default router