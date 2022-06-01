const express = require("express");
const { json } = require("express/lib/response");
const router = express.Router();
const db = require("../../db");

router.get("/", async (req, res) => {
  const type = req.query.type;
  const values = [];
  let sqlQueryString = "SELECT * FROM books";

  if (type) {
    sqlQueryString += ` WHERE type=$1`;
    values.push(type);
  }
  try {
    const result = await db.query(sqlQueryString, values);
    return res.status(200).json({ books: result.rows });
  } catch (e) {
    return res.status(400).json({ error: "Failed to fetch books" });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const sqlQuery = `SELECT * FROM books WHERE id=$1`;
  const values = [id];
  try {
    const result = await db.query(sqlQuery, values);
    return res.status(200).json({ books: result.rows[0] });
  } catch (e) {
    return res.status(400).json({ error: "Failed to fetch" });
  }
});

router.post("/", async (req, res) => {
  const book = { ...req.body.book };
  const { title, type, author, topic, publicationDate, pages } = book;

  const sqlQuery = `INSERT INTO books (title, type, author, topic, publicationDate, pages)
  VALUES ('${title}','${type}','${author}','${topic}',
  '${publicationDate}','${pages}' ) returning *`;

  try {
    const result = await db.query(sqlQuery);
    return res.status(200).json({ books: result.rows[0] });
  } catch (e) {
    res.status(400).json({ error: "Failed to post new book" });
  }

  res.json({ books: book });
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { title, type, author, topic, publicationdate, pages } = {
    ...req.body,
  };
  const values = [title, type, author, topic, publicationdate, pages];

  const sqlQuery = `UPDATE books SET title=$1, type=$2, author=$3, topic=$4,
   publicationdate=$5, pages=$6 WHERE id=${id} returning *`;

  try {
    const result = await db.query(sqlQuery, values);
    return res.status(200).json({ books: result.rows[0] });
  } catch (e) {
    return res.status(400).json({ error: "Unable to update book" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const values = [id];
  const sqlQuery = `DELETE FROM books WHERE id=$1 returning *`;

  try {
    const result = await db.query(sqlQuery, values);
    return res.status(200).json({ books: result.rows[0] });
  } catch (e) {
    return res.status(400).json({ error: "Unable to delete" });
  }
});

module.exports = router;

// await db.query(
//   `INSERT INTO books (title, type, author, topic, publicationDate, pages) VALUES (${Object.values(
//     req.body
//   )
//     .map((value) => `'${value}'`)
//     .join(",")})`
// );
