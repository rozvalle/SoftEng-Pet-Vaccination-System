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
    const query = `
      SELECT 
        vh.history_id,
        vh.pet_id,
        p.pet_name,
        vh.vaccine_id,
        v.vaccine_name,
        vh.date_administered
      FROM tbl_vaccinehistory vh
      JOIN tbl_pets p ON vh.pet_id = p.pet_id
      JOIN tbl_vaccine v ON vh.vaccine_id = v.vaccine_id
      ORDER BY vh.history_id ASC
    `;
    const [result] = await db.query(query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      "SELECT * FROM tbl_vaccinehistory WHERE history_id = ?",
      [id]
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/pet/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      "SELECT * FROM tbl_vaccinehistory WHERE pet_id = ?",
      [id]
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { pet_id, vaccine_id, date_administered } = req.body;

  const checkQuery = `
      SELECT * FROM tbl_vaccinehistory
      WHERE pet_id = ? AND date_administered = ? AND vaccine_id = ?
    `;
  const [existing] = await db.query(checkQuery, [pet_id, date_administered, vaccine_id]);

  if (existing.length > 0) {
    return res.status(400).json({ error: "Vaccination already recorded for this pet on the same date" });
  }

  const query = `
    INSERT INTO tbl_vaccinehistory (pet_id, vaccine_id, date_administered)
    VALUES (?, ?, ?)
  `;

  try {
    await db.query(query, [pet_id, vaccine_id, date_administered]);
    res.status(201).json({ message: "Vaccine history added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM tbl_vaccinehistory WHERE history_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vaccine history not found" });
    }

    res.status(200).json({ message: "Vaccine history deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { pet_id, vaccine_id, date_administered } = req.body;

  const checkQuery = `
      SELECT * FROM tbl_vaccinehistory
      WHERE pet_id = ? AND date_administered = ? AND vaccine_id = ?
    `;
  const [existing] = await db.query(checkQuery, [pet_id, date_administered, vaccine_id]);

  if (existing.length > 0) {
    return res.status(400).json({ error: "Vaccination already recorded for this pet on the same date" });
  }

  const query = `
    UPDATE tbl_vaccinehistory
    SET pet_id = ?, vaccine_id = ?, date_administered = ?
    WHERE history_id = ?
  `;

  try {
    const [result] = await db.query(query, [pet_id, vaccine_id, date_administered, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vaccine history not found" });
    }

    res.status(200).json({ message: "Vaccine history updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
