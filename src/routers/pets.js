const express = require("express");
const router = express.Router();
const db = require("../../db");

// router.get("/", async (req, res) => {
//   const result = await db.query('SELECT * FROM "pets";');
//   res.json({ pets: result.rows });
// });

router.get("/", async (req, res) => {
  let query = `SELECT * FROM "pets"`;
  const micro = req.query.microchip;
  const type = req.query.type;

  if (type) {
    query = query + ` WHERE type = '${type}'`;
    console.log(query);
  }
  if (micro) {
    query = query + ` AND microchip = ${micro}`;
    console.log(query);
  }

  const result = await db.query(query);
  res.json({ pets: result.rows });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db.query(`SELECT * FROM "pets" WHERE id = ${id}`);
  const pet = result.rows[0];
  res.json({ pets: pet });
});

router.post("/", async (req, res) => {
  const pet = { ...req.body.pet };
  const { name, age, type, breed, microchip } = pet;

  let query = `INSERT INTO pets (name, age, type, breed, microchip)
    VALUES('${name}', ${age}, '${type}', '${breed}', ${microchip}) returning *`;
  try {
    const result = await db.query(query);
    return res.status(200).json({ pets: result.rows });
  } catch (e) {
    return res.status(400).json({ error: "Failed to propagate pet" });
  }
});

module.exports = router;
