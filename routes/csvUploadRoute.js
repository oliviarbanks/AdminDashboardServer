const express = require('express');
const multer = require('multer');
const router = express.Router();
const fastcsv = require('fast-csv');
const bodyParser = require('body-parser');
const knex = require('./db'); // This imports the preconfigured knex instance
const { v4: uuidv4 } = require('uuid'); // Import uuid
const { parse, isValid, format } = require('date-fns');

// Use body-parser middleware for parsing JSON and URL-encoded data
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Define an array of accepted date formats
const acceptedDateFormats = ['yyyy-MM-dd', 'M/dd/yyyy', 'MM/dd/yyyy', 'dd/MM/yyyy', 'dd-MM-yyyy'];

// Helper function to parse a date with a given format
function parseDate(dateString) {
  for (const formatStr of acceptedDateFormats) {
    const parsedDate = parse(dateString, formatStr, new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }
  return null; // Return null if parsing fails
}

// Helper function to format a date as 'MM-dd-yyyy'
function formatDateCustom(dateString) {
  const parsedDate = parseDate(dateString);
  if (parsedDate) {
    return format(parsedDate, 'yyyy-MM-dd');
  } else {
    return ''; // Return an empty string if parsing fails
  }
}

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
      const parsedDate = parseDate(data.Date);

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
      // const paid = data.Paid.toLowerCase() === 'yes' ? 1 : 0;
      const paid = data.Paid && data.Paid.toLowerCase() === 'yes' ? 1 : 0;

      // Generate a unique ID using uuid
      const uniqueId = uuidv4(); // Generate a new unique ID for each row

      results.push({
        id: uniqueId,
        name: data.Name,
        date: formatDateCustom(data.Date), // Format the date consistently
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

      // Include the formatted date in the response JSON
      const responseData = {
        message: 'CSV file uploaded and processed successfully',
        dates: results.map((row) => row.date),
      };

      res.status(200).json(responseData);
    })
    .catch((error) => {
      console.error('Error inserting rows:', error);
      res.status(500).json({ message: 'Internal server error during insertion', error: error.message });
    })
    .finally(() => {
      console.log('Database connection closed.');
      // Don't destroy the database connection here
    });
})
    .on('error', (error) => {
      console.error('Error parsing CSV:', error);
      res.status(400).json({ message: 'Error parsing CSV file' });
    });
});

module.exports = router;
