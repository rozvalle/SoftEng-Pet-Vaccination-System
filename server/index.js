const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const usersRoutes = require("./routes/users");
const vaccinesRoutes = require("./routes/vaccines");
const petsRoutes = require("./routes/pets");
const vaccinationsRoutes = require("./routes/vaccinations");



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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use("/users", usersRoutes);
app.use("/vaccines", vaccinesRoutes);
app.use("/pets", petsRoutes);
app.use("/vaccinations", vaccinationsRoutes);

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

app.get('/dashboard/counts', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM tbl_users) AS user_count,
        (SELECT COUNT(*) FROM tbl_pets) AS pet_count,
        (SELECT COUNT(*) FROM tbl_vaccinehistory) AS vaccinehistory_count;
    `);
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get("/details/vaccinations", async (_, res) => {
  try {
    const query = `
      SELECT 
        H.history_id,
        P.pet_name,
        V.vaccine_name,
        H.date_administered
      FROM TBL_VACCINEHISTORY AS H
      JOIN TBL_PETS AS P 
        ON H.PET_ID = P.PET_ID
      JOIN TBL_VACCINE AS V 
      ON H.VACCINE_ID = V.VACCINE_ID
      ORDER BY H.HISTORY_ID ASC
    `;
    const [result] = await db.query(query);
    console.log(result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
