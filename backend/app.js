const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

app.use(cors());
app.use(bodyParser.json());
const bcrypt = require("bcrypt");

const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "appdb",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

app.post("/api/createproduct", (req, res) => {
  const { productname, productprice } = req.body;
  const query =
    "INSERT INTO products (productname, productprice) VALUES (?, ?)";
  db.query(query, [productname, productprice], (err, result) => {
    if (err) {
      console.error("Error creating a product:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res
        .status(201)
        .json({
          message: "Product created successfully",
          productId: result.insertId,
        });
    }
  });
});

// Get a list of all products
app.get("/api/products", (req, res) => {
  const { page, limit } = req.query;
  const offset = (page - 1) * limit; // Calculate the offset

  const query = "SELECT * FROM products LIMIT ? OFFSET ?";
  db.query(query, [parseInt(limit), offset], (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json(results);
    }
  });
});

///

app.put("/api/createproduct/:id", (req, res) => {
  const productId = req.params.id;
  const { productname, productprice, idproducts } = req.body;
  console.log(
    productId + "  " + productname + "  " + productprice + "  " + idproducts
  );
  const query =
    "UPDATE products SET productname = ?, productprice = ? WHERE idproducts = ?";
  db.query(query, [productname, productprice, productId], (err) => {
    if (err) {
      console.error("Error updating product by ID:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Product updated successfully" });
    }
  });
});

app.delete("/api/deleteproduct/:id", (req, res) => {
  const productId = req.params.id;
  const query = "DELETE FROM products WHERE idproducts = ?";
  db.query(query, [productId], (err) => {
    if (err) {
      console.error("Error deleting product by ID:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(204).send();
    }
  });
});

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "0487d5815d0821",
    pass: "b20b45aead1ab0",
  },
});

app.post("/api/register", async (req, res) => {
  try {
    // Get user input
    const { username, email, password } = req.body;
    //   const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && username)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, result) => {
      if (err) {
        console.error("Error retrieving user:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      if (result.length > 0) {
        res.status(409).json({ error: "User already exists" });
        return;
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            console.error("Error hashing password:", err);
            res.status(500).json({ error: "Internal server error" });
            return;
          }

          // Store the user data in the database
          const sql =
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
          db.query(sql, [username, email, hash], (err, result) => {
            if (err) {
              console.error("Error registering user:", err);
              res.status(500).json({ error: "Internal server error" });
              return;
            }
            console.log(JSON.stringify(username));
            const token = jwt.sign({ userId: username }, "your_secret_key", {
              expiresIn: "1h", // Token expiration time
            });

            /////////////////////
            const to = email;
            const subject = "Registration";
            const text = "HIii Pratik";
            console.log("TO:" + to);
            console.log("SUBJECT:" + subject);
            console.log("TEXT:" + text);

            const mailOptions = {
              from: "pratik@gmail.com",
              to,
              subject,
              text,
            };

            transport.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error("Error sending email: ", error);
                res.status(500).json({ message: "Error sending email" });
              } else {
                console.log("Email sent: " + info.response);
                res.status(200).json({ message: "Email sent successfully" });
              }
            });
            //////////////////////
            // res.status(200).json({ token });
          });
        });
      }

      // Compare the provided password with the stored hash
    });

    // Hash the password before storing it in the database
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/login", (req, res) => {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send("All input is required");
    }
    // Check if the user exists in the database
    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, result) => {
      if (err) {
        console.error("Error retrieving user:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      if (result.length === 0) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      // Compare the provided password with the stored hash
      bcrypt.compare(password, result[0].password, (err, isMatch) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }

        if (!isMatch) {
          res.status(401).json({ error: "Invalid email or password" });
          return;
        }
        const token = jwt.sign({ userId: username }, "your_secret_key", {
          expiresIn: "1h", // Token expiration time
        });
        res.status(200).json({ token });

        // res.status(200).json({ message: 'Login successful' });
      });
    });
  } catch (err) {
    console.log(err);
  }

  //////////////////////////New End
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
