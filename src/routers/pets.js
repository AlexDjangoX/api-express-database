const express = require("express");
const router = express.Router();
const db = require("../../db");
const microChipValue = ["true", "false"];

router.get("/", async (req, res) => {
  let query = `SELECT * FROM "pets"`;
  const micro = req.query.microchip;
  const type = req.query.type;

  if (micro && !microChipValue.includes(micro)) {
    return res.status(400).json({ error: "microchip value invalid" });
  }

  if (type) {
    query += ` WHERE type='${type}'`;
    console.log(query);
  }
  if (micro) {
    query += ` AND microchip='${micro}'`;
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

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const data = { ...req.body };
  const { name, age, type, breed, microchip } = data;
  const values = [name, age, type, breed, microchip];
  const sqlQueryString = `UPDATE pets SET name=$1, age=$2, 
  type=$3, breed=$4, microchip=$5 WHERE id=${id} returning *`;

  try {
    const result = await db.query(sqlQueryString, values);
    return res.status(200).json({ pet: result.rows[0] });
  } catch (e) {
    return res.status(400).json({ error: "Failed to update pet" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const values = [id];
  const sqlQueryString = `DELETE FROM pets WHERE id=$1 returning *`;
  console.log(values);
  console.log(sqlQueryString);
  try {
    const result = await db.query(sqlQueryString, values);
    return res.status(200).json({ pet: result.rows[0] });
  } catch (e) {
    return res.status(400).json({ error: "Failed to delete pet" });
  }
});

module.exports = router;
