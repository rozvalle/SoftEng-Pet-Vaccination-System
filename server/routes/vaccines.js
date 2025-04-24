const express = require("express");
const mysql = require("mysql2/promise");
const router =  express.Router();

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "db_pet",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

router.get("/", async (req, res) => {
    try {
      const [result] = await db.query("SELECT * FROM tbl_vaccine");
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await db.query("SELECT * FROM tbl_vaccine WHERE vaccine_id = ?", [id]);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/", async (req, res) => {
    const { vaccine_name, vaccine_desc, vaccine_man, vaccine_img } = req.body;
  
    const [existingVaccine] = await db.query(
      "SELECT vaccine_id FROM tbl_vaccine WHERE vaccine_name = ?",
      [vaccine_name]
    );
  
    if (existingVaccine.length > 0) {
      return res.status(400).json({ error: "Vaccine already exists" });
    }
  
    const query = `
      INSERT INTO tbl_vaccine (vaccine_name, vaccine_desc, vaccine_man, vaccine_img) 
      VALUES (?, ?, ?, ?)
    `;
  
    try {
      await db.query(query, [vaccine_name, vaccine_desc, vaccine_man, vaccine_img]);
      res.status(201).json({ message: "Vaccine added successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router; 