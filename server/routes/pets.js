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

// Get all pets
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        p.pet_id, 
        p.pet_name, 
        p.pet_sex, 
        p.pet_species, 
        p.pet_img, 
        p.owner_id, 
        CONCAT(u.user_fn, ' ', u.user_ln) AS owner_name
      FROM tbl_pets p
      JOIN tbl_users u ON p.owner_id = u.user_id
      ORDER BY p.pet_id ASC
    `;
    const [result] = await db.query(query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a pet by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        p.pet_id, 
        p.pet_name, 
        p.pet_sex, 
        p.pet_species, 
        p.pet_img, 
        p.owner_id, 
        CONCAT(u.user_fn, ' ', u.user_ln) AS owner_name
      FROM tbl_pets p
      JOIN tbl_users u ON p.owner_id = u.user_id
      WHERE p.pet_id = ?
    `;
    const [result] = await db.query(query, [id]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a pet by Owner_ID
router.get("/owner/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("SELECT * FROM tbl_pets WHERE owner_id = ?", [id]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Create a new pet
router.post("/", async (req, res) => {
  const { owner_id, pet_name, pet_sex, pet_species, pet_img } = req.body;

  const [existingPet] = await db.query(
    "SELECT pet_id FROM tbl_pets WHERE pet_name = ? AND owner_id = ?",
    [pet_name, owner_id]
  );

  if (existingPet.length > 0) {
    return res.status(400).json({ error: "Pet with the same name already exists for this owner" });
  }
  
  const query = `
    INSERT INTO tbl_pets (owner_id, pet_name, pet_sex, pet_species, pet_img)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    await db.query(query, [owner_id, pet_name, pet_sex, pet_species, pet_img]);
    res.status(201).json({ message: "Pet added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a pet
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM tbl_pets WHERE pet_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a pet
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { owner_id, pet_name, pet_sex, pet_img, pet_species } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT pet_id FROM tbl_pets WHERE pet_name = ? AND owner_id = ? AND pet_id != ?",
      [pet_name, owner_id, id]
    );

    if (rows.length > 0) {
      return res.status(400).json({ error: "Pet with the same name already exists for this owner" });
    }

    const query = `
      UPDATE tbl_pets
      SET owner_id = ?, pet_name = ?, pet_sex = ?, pet_img = ?, pet_species = ?
      WHERE pet_id = ?
    `;
    const [result] = await db.query(query, [owner_id, pet_name, pet_sex, pet_img, pet_species, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.status(200).json({ message: "Pet updated successfully" });
  } catch (error) {
    console.error(error);  // Log the error
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
