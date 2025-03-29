const express = require("express");
const mysql = require("mysql2/promise"); // Use promise-based MySQL2
const cors = require("cors");



const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // ✅ Allow requests from frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Database connection (Use a pool for better performance)
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "db_pet",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Fetch all users
app.get("/users", async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM tbl_users");
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new user
app.post("/users", async (req, res) => {
  const { user_fn, user_ln, user_mn, username, password } = req.body;

  const [existingUsers] = await db.query(
    "SELECT user_id FROM tbl_users WHERE user_name = ?",
    [username]
  );

  if (existingUsers.length > 0) {
    return res.status(400).json({ error: "Username already taken" });
  }

  const query = `
    INSERT INTO tbl_users (user_fn, user_ln, user_mn, user_name, user_password) 
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    await db.query(query, [user_fn, user_ln, user_mn, username, password]);
    res.status(201).json({ message: "User added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Deleting user with ID:", id);

  try {
    const [result] = await db.query("DELETE FROM tbl_users WHERE user_id = ?", [id]);

    console.log("Delete result:", result); // Debugging: See what MySQL returns

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { user_fn, user_ln, user_mn, username, password } = req.body;

  try {
    const [existingUsers] = await db.query(
      "SELECT user_id FROM tbl_users WHERE user_name = ? AND user_id != ?",
      [username, id]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const query = `
      UPDATE tbl_users 
      SET user_fn = ?, user_ln = ?, user_mn = ?, user_name = ?, user_password = ? 
      WHERE user_id = ?
    `;
    const [result] = await db.query(query, [user_fn, user_ln, user_mn, username, password, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
