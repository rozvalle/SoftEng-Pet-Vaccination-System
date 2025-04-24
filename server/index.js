const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const usersRoutes = require("./routes/users");
const vaccinesRoutes = require("./routes/vaccines");
const petsRoutes = require("./routes/pets");



const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "db_pet",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(express.json());
app.use("/users", usersRoutes);
app.use("/vaccines", vaccinesRoutes);
app.use("/pets", petsRoutes);

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM tbl_users WHERE user_name = ?", [username]);

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const user = rows[0];

    if (user.user_password !== password) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    res.status(200).json({ message: "Login successful", token: "sample-token-123" }); 
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
