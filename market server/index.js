const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

let connection;
mysql
  .createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "market",
  })
  .then((conn) => (connection = conn));

app.get("/products", async (req, res) => {
  try {
    const [results] =
      await connection.query(`SELECT products.productID, products.name, products.price, 
    IF (availability = 1,'Товар в наличии', 'Товар отсутствует на складе') as availability,categories.category FROM products
    INNER JOIN categories ON categories.categoryID = products.category;`);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving products from database" });
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [results] = await connection.query(
      `SELECT * FROM products WHERE productID = ?`,
      [id]
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving products from database" });
  }
});

app.get("/productSum", async (req, res) => {
  try {
    const [results] = await connection.query(
      `SELECT SUM(price) as sum FROM products`
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving products from database" });
  }
});

app.get("/productCategoriesSum", async (req, res) => {
  try {
    const [results] = await connection.query(
      `SELECT  ,SUM(price) as sum FROM products`
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving products from database" });
  }
});

app.get("/productMin", async (req, res) => {
  try {
    const [results] = await connection.query(
      `SELECT name FROM products WHERE price = (SELECT MIN(price) FROM products)`
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving products from database" });
  }
});

app.get("/productMax", async (req, res) => {
  try {
    const [results] = await connection.query(
      `SELECT name FROM products WHERE price = (SELECT MAX(price) FROM products)`
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving products from database" });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const [results] = await connection.query(
      `SELECT orderID, buyer, order_date, GROUP_CONCAT(product) as product, GROUP_CONCAT(count) as count FROM market.orders
    INNER JOIN order_details ON order_details.order = orders.orderID
    GROUP BY orderID, buyer, order_date`
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post("/addOrder", async (req, res) => {
  try {
    const { buyer, details } = req.body;
    console.log(req.body);

    await connection.beginTransaction();
    const [orderResult] = await connection.query(
      `INSERT INTO orders (buyer, order_date) VALUES (?, NOW())`,
      [buyer]
    );
    console.log(orderResult);

    const [maxOrderResult] = await connection.query(
      `SELECT MAX(orderID) AS maxOrderID FROM orders`
    );
    console.log(maxOrderResult);

    const orderID = maxOrderResult[0].maxOrderID;

    for (const item of details) {
      await connection.query(
        `INSERT INTO order_details (\`order\`, product, count) VALUES (?, ?, ?)`,
        [orderID, item.product, item.count]
      );
    }

    res.status(200).json({ success: true, orderID });
    await connection.commit();
    console.log("Transaction commit");
  } catch (error) {
    await connection.rollback();
    console.log("Transaction rollback");
    console.error(error);
    res.status(500).json({ error });
  }
});

app.get("/categories", async (req, res) => {
  try {
    const [results] = await connection.query("SELECT * FROM categories");
    res.status(200).json(results);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving categories from database" });
  }
});

app.get("/categoryGroup", async (req, res) => {
  try {
    const [results] = await connection.query(
      `SELECT categoryID, if(SUM(price) IS NULL, 0, SUM(price)) as sum, category FROM 
    (SELECT categories.categoryID, categories.category, products.price FROM products
    RIGHT OUTER JOIN categories ON categories.categoryID = products.category) as T
    GROUP BY categoryID, category`
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post("/addProduct", async (req, res) => {
  try {
    let { name, price, availability, category } = req.body;
    console.log(req.body);
    const [results] = await connection.query(
      `INSERT INTO products (name, price, availability, category) values (?, ?, ?, ?)`,
      [name, price, availability, category]
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post("/deleteProduct", async (req, res) => {
  try {
    let { productID } = req.body;
    console.log(req.body, productID);

    const [results] = await connection.query(
      `DELETE FROM products WHERE productID = ?`,
      [productID]
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post("/updateProduct", async (req, res) => {
  try {
    let { name, price, availability, category, productID } = req.body;
    console.log(req.body);

    const [results] = await connection.query(
      `UPDATE products SET name = ?,price = ?, availability = ?, category = ? WHERE productID = ?`,
      [name, price, availability, category, productID]
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
