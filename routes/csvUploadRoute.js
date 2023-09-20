const express = require('express');
const multer = require('multer');
const router = express.Router();
const fastcsv = require('fast-csv');
const bodyParser = require('body-parser');
const knex = require("knex")(require("../knexfile"));
const { v4: uuidv4 } = require('uuid'); // Import uuid
const { parse, isValid } = require('date-fns');

// Use body-parser middleware for parsing JSON and URL-encoded data
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/csv', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    console.log('No file uploaded.');
    return res.status(400).send('No file uploaded.');
  }

  console.log('Received CSV file:', req.file.originalname);

  const fileBuffer = req.file.buffer;
  const results = [];

  fastcsv.parseString(fileBuffer.toString(), {
    headers: true,
    delimiter: ',',
  })
    .on('data', (data) => {
      console.log('Parsed CSV row:', data);

      // Parse the date
      const parsedDate = parse(data.Date, 'yyyy-MM-dd', new Date());

      if (!isValid(parsedDate)) {
        console.error('Invalid date format:', data.Date);
        return; // Skip this row if date is invalid
      }

      // Parse and check the amount
      const amount = parseFloat(data.Amount);
      if (isNaN(amount)) {
        console.error('Invalid amount format:', data.Amount);
        return; // Skip this row if amount is invalid
      }

      // Convert 'Yes' and 'No' to integers (0 or 1)
      const paid = data.Paid.toLowerCase() === 'yes' ? 1 : 0;

      // Generate a unique ID using uuid
      const uniqueId = uuidv4(); // Generate a new unique ID for each row

      results.push({
        id: uniqueId,
        name: data.Name,
        date: parsedDate,
        amount: amount,
        paid: paid,
      });
    })
    .on('end', () => {
      if (results.length === 0) {
        console.log('CSV file is empty.');
        return res.status(400).json({ message: 'CSV file is empty' });
      }

      const insertPromises = results.map((row) =>
        knex('earnings').insert({
          id: row.id,
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
          res.status(500).json({ message: 'Internal server error during insertion', error: error.message });
        })
        .finally(() => {
          console.log('Database connection closed.');
          knex.destroy(); // Close the database connection
        });
    })
    .on('error', (error) => {
      console.error('Error parsing CSV:', error);
      res.status(400).json({ message: 'Error parsing CSV file' });
    });
});

module.exports = router;
