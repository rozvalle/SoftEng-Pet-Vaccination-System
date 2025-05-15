const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();

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

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM tbl_vaccine WHERE vaccine_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vaccine not found" });
    }

    res.status(200).json({ message: "Vaccine deleted successfully" });
  } catch (error) {
    console.error("Error deleting vaccine:", error);

    if (error.errno === 1451) {
      return res.status(400).json({
        error: "Cannot delete this vaccine because it is assigned to a pet's vaccination history."
      });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { vaccine_name, vaccine_desc, vaccine_man, vaccine_img } = req.body;

  try {
    const [existingVaccine] = await db.query(
      "SELECT vaccine_id FROM tbl_vaccine WHERE vaccine_name = ? AND vaccine_id != ?",
      [vaccine_name, id]
    );

    if (existingVaccine.length > 0) {
      return res.status(400).json({ error: "Vaccine already exists" });
    }

    const query = `
        UPDATE tbl_vaccine 
        SET vaccine_name = ?, vaccine_desc = ?, vaccine_man = ?, vaccine_img = ?
        WHERE vaccine_id = ?
      `;
    const [result] = await db.query(query, [vaccine_name, vaccine_desc, vaccine_man, vaccine_img, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vaccine not found" });
    }

    res.status(200).json({ message: "Vaccine updated successfully" });
  } catch (error) {
    console.error("Error updating vaccine:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router; 