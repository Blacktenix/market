const express = require('express');
const mysql = require('mysql');
const cors = require('cors')

const app = express();
app.use(cors())
const bodyParser = require('body-parser'); app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));  
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'market'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

// Route to fetch users
app.get('/products', (req, res) => {
    connection.query(`SELECT products.productID, products.name, products.price, 
    IF (availability = 1,'Товар в наличии', 'Товар отсутствует на складе') as availability,categories.category FROM products
    INNER JOIN categories ON categories.categoryID = products.category;`, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error retrieving products from database' });
            return;
        }
        res.json(results);
    });
});

app.get('/product/:id', function(req, res) {
    const id = req.params.id;
    connection.query(`SELECT * FROM products WHERE productID = ?`,[id], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error retrieving products from database' });
            return;
        }
        res.json(results); 
    });
});

app.get('/productSum', function(req, res) {
    connection.query(`SELECT SUM(price) as sum FROM products`, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error retrieving products from database' });
            return;
        }
        res.json(results); 
    });
});

app.get('/productCategoriesSum', function(req, res) {
    connection.query(`SELECT  ,SUM(price) as sum FROM products`, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error retrieving products from database' });
            return;
        }
        res.json(results); 
    });
});

app.get('/productMin', function(req, res) {
    connection.query(`SELECT name FROM products WHERE price = (SELECT MIN(price) FROM products)`, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error retrieving products from database' });
            return;
        }
        res.json(results); 
    });
});

app.get('/productMax', function(req, res) {
    connection.query(`SELECT name FROM products WHERE price = (SELECT MAX(price) FROM products)`, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error retrieving products from database' });
            return;
        }
        res.json(results); 
    });
});

app.get('/orders', (req, res) => {
    connection.query(`SELECT orderID, buyer, order_date, GROUP_CONCAT(product) as product, GROUP_CONCAT(count) as count FROM market.orders
    INNER JOIN order_details ON order_details.order = orders.orderID
    GROUP BY orderID, buyer, order_date`, (error, results) => {
        if (error) {
            res.status(500).json({ error });
            return;
        }
        res.json(results);
    });
});

app.post('/addOrder', (req, res) => {
    let {buyer, details} = req.body
    console.log(req.body)
    connection.query(`INSERT INTO orders (buyer, order_date) VALUES (?, NOW())`,[buyer], (error, results) => {
        if (error) {
            res.status(500).json({ error });
            return;
        }
        console.log(results);
        // res.json(results);
        connection.query(`SELECT MAX(orderID) FROM orders`, (error, results) => {
            if (error) {
                res.status(500).json({ error });
                return;
            }
            console.log(results);
            res.json(results);
            for (let i of details){
                connection.query(`INSERT INTO order_details (\`order\`, product, count) VALUES (?,?,?)`,[results[0]['MAX(orderID)'], i.product, i.count], (error, results) => {
                    if (error) {
                        res.status(500).json({ error });
                        return;
                    }
                    //res.json(results);
                });
            }
        });
    });
    
    
});

app.get('/categories', (req, res) => {
    connection.query('SELECT * FROM categories', (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error retrieving categories from database' });
            return;
        }
        res.json(results);
    });
});

app.get('/categoryGroup', (req, res) => {
    connection.query(`SELECT categoryID, if(SUM(price) IS NULL, 0, SUM(price)) as sum, category FROM 
    (SELECT categories.categoryID, categories.category, products.price FROM products
    RIGHT OUTER JOIN categories ON categories.categoryID = products.category) as T
    GROUP BY categoryID, category`, (error, results) => {
        if (error) {
            res.status(500).json({error});
            return;
        }
        res.json(results);
    });
});

app.post('/addProduct', (req, res) => {
    let { name, price , availability, category} = req.body;
    console.log(req.body)
    connection.query(`INSERT INTO products (name, price, availability, category) values (?, ?, ?, ?)`,[name, price,availability , category], (error, results) => {
        if (error) {
            res.status(500).json({ error });
            return;
        }
        res.json(results);
    });
})

app.post('/deleteProduct', (req, res) => {
    let { productID } = req.body;
    console.log(req.body,productID)
    // productID = parseInt(productID, 10)
    // console.log(req.body,productID)
    connection.query(`DELETE FROM products WHERE productID = ?`,[productID], (error, results) => {
        if (error) {
            res.status(500).json({ error });
            return;
        }
        res.json(results);
    });
})

app.post('/updateProduct', (req, res) => {
    let {  name, price, availability, category, productID } = req.body;
    console.log(req.body)
    connection.query(`UPDATE products SET name = ?,price = ?, availability = ?, category = ? WHERE productID = ?`,[name, price, availability , category, productID], (error, results) => {
        if (error) {
            res.status(500).json({ error });
            return;
        }
        res.json(results);
    });
})


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

