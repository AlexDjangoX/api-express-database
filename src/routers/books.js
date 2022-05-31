const express = require("express");
const router = express.Router();
const db = require("../../db");

router.get("/", async (req, res) => {
  let type = req.query.type;
  console.log(type);
  if (type.includes(" ")) {
    type = type.replaceAll(" ", "-");
  }
  let sqlString = 'SELECT * FROM "books"';
  if (type) {
    sqlString += ` WHERE type = '${type}';`;
    console.log(sqlString);
  }
  const result = await db.query(sqlString);

  res.json({ books: result.rows });
});

router.get("/:id", async (req, res) => {
  const id_ = req.params.id;
  const result = await db.query(`SELECT * FROM books WHERE id = ${id_}`);
  const book = result.rows[0];
  res.json({ books: book });
});

router.post("/", async (req, res) => {
  const book = { ...req.body.book };
  const { title, type, author, topic, publicationDate, pages } = book;
  await db.query(
    `INSERT INTO books (title, type, author, topic, publicationDate, pages)
        VALUES ('${title}','${type}','${author}','${topic}',
        '${publicationDate}',${pages});`
  );
  res.json({ books: book });
});

// await db.query(
//   `INSERT INTO books (title, type, author, topic, publicationDate, pages) VALUES (${Object.values(
//     req.body
//   )
//     .map((value) => `'${value}'`)
//     .join(",")})`
// );

module.exports = router;
