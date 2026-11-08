import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Student from './models/Student.js';
import Settings from './models/Settings.js';
import { getAllInitialStudents, defaultGroupLinks } from './data/studentsData.js';

dotenv.config();

const uri = process.env.MONGODB_URI;

async function seed() {
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in environment or .env file!');
    process.exit(1);
  }

  try {
    console.log(`🔌 Connecting to MongoDB...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      dbName: 'apex_cet_neet'
    });
    console.log('✅ Connected.');

    console.log('🧹 Clearing existing students in collection...');
    await Student.deleteMany({});

    const allStudents = getAllInitialStudents();
    console.log(`🌱 Inserting ${allStudents.length} hardcoded students...`);
    const inserted = await Student.insertMany(allStudents);
    console.log(`🎉 Successfully seeded ${inserted.length} students into MongoDB!`);

    console.log('⚙️ Updating default group links...');
    await Settings.findOneAndUpdate(
      { key: 'app_settings' },
      { $set: { groupLinks: defaultGroupLinks } },
      { upsert: true }
    );
    console.log('✅ Default WhatsApp group links initialized.');

    await mongoose.disconnect();
    console.log('🚀 Seed complete. Database ready!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
