import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser'; // npm install csv-parser
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load env from the express-backend config.env
dotenv.config({ path: path.resolve(new URL('../express-backend/config.env', import.meta.url).pathname) });
const ATLAS_URI = process.env.ATLAS_URIS || process.env.ATLAS_URI;
if (!ATLAS_URI) {
  console.error('Missing MongoDB URI. Set ATLAS_URIS or ATLAS_URI in ../express-backend/config.env or env.');
  process.exit(1);
}

// CSV file path (resolved relative to this script)
const CSV_FILE_PATH = path.resolve(new URL('./data.csv', import.meta.url).pathname);

// Define the schema to match CSV columns
const CategorySchema = new mongoose.Schema({
  catName: String,
  desc: String,
  disposalInfo: String,
  co2: { type: Number, default: 0 },
  energy: { type: Number, default: 0 },
  water: { type: Number, default: 0 },
  links: [String],
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);

async function importData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB.');

    const rows = [];

    console.log(`Reading CSV file from ${CSV_FILE_PATH}...`);
    await new Promise((resolve, reject) => {
      fs.createReadStream(CSV_FILE_PATH)
        .pipe(csv())
        .on('data', (row) => {
          
          const obj = {
            catName: row.catName || row.category || '',
            desc: row.desc || row.description || '',
            disposalInfo: row.disposalInfo || '',
            co2: row.co2 ? parseFloat(row.co2) : 0,
            energy: row.energy ? parseFloat(row.energy) : 0,
            water: row.water ? parseFloat(row.water) : 0,
            links: row.links ? row.links.split(',').map(s => s.trim()).filter(Boolean) : [],
          };
          rows.push(obj);
        })
        .on('end', () => resolve())
        .on('error', (err) => reject(err));
    });

    if (rows.length === 0) {
      console.log('No rows found in CSV.');
    } else {
      console.log(`Inserting ${rows.length} documents...`);
      
      const res = await Category.insertMany(rows, { ordered: false });
      console.log(`Inserted ${res.length} documents.`);
    }
  } catch (err) {
    console.error('Error during import:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

importData();