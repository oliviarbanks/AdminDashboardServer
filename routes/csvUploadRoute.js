const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const router = express.Router();
const knex = require("knex")(require("../knexfile"));
const { parse } = require('date-fns');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/csv', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileBuffer = req.file.buffer;

  const results = [];
  csv({ headers: true, separator: '\t' })
    .on('data', (data) => {
      data.date = parse(data.date, 'M/d/yy', new Date());
      results.push(data);
    })
    .on('end', () => {
      if (results.length === 0) {
        return res.status(400).json({ message: 'CSV file is empty' });
      }

      const insertPromises = results.map((row) =>
        knex('earnings').insert({
          name: row.name,
          date: row.date,
          amount: row.amount,
          paid: row.paid,
        })
      );

      Promise.all(insertPromises)
        .then(() => {
          console.log(`Inserted ${results.length} rows successfully`);
          res.status(200).json({ message: 'CSV file uploaded and processed successfully' });
        })
        .catch((error) => {
          console.error('Error inserting rows:', error);
          res.status(500).json({ message: 'Internal server error during insertion' });
        });
    })
    .on('error', (error) => {
      console.error('Error parsing CSV:', error);
      res.status(400).json({ message: 'Error parsing CSV file' });
    });
});

module.exports = router;