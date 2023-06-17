const express = require('express');
const app = express();
const path = require('path');
const PORT = 8080;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// app.get('/api/stockprice/:code', (req, res) => {
//   const { code } = req.params;
//   const stockPrice = getStockPrice(code); 

//   if (stockPrice) {
//     res.json(stockPrice);
//   } else {
//     res.status(404).json({ error: 'Producto no encontrado' });
//   }
// });

// function getStockPrice(code) {
//   // const product = stockPrices[code];
  
//   // if (product) {
//   //   return {
//   //     stock: product.stock,
//   //     price: product.price
//   //   };
//   // } else {
//   //   return null;
//   // }
// }

// app.get('/:idNombreCerveza', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'product-details.html'));
// });

app.get('/:idNombreCerveza', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'product-details.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento: puerto ${PORT}`);
});
