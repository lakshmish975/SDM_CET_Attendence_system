import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Student from './models/Student.js';
import Settings from './models/Settings.js';
import { getAllInitialStudents, defaultGroupLinks, defaultSubjectFaculties } from './data/studentsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

let isConnected = false;
let currentDbUri = process.env.MONGODB_URI || '';

// Fallback in-memory store if MongoDB is not connected yet
export const inMemoryStore = {
  students: getAllInitialStudents().map((s, idx) => ({
    _id: `mem_${s.category}_${idx + 1}`,
    ...s
  })),
  attendance: [],
  settings: {
    groupLinks: { ...defaultGroupLinks },
    subjectFaculties: { ...defaultSubjectFaculties }
  }
};

export async function connectDB(uri = process.env.MONGODB_URI) {
  if (!uri || uri.trim() === '') {
    console.warn('⚠️ No MONGODB_URI provided yet. Operating in High-Speed In-Memory fallback mode with all 165 students preloaded.');
    isConnected = false;
    currentDbUri = '';
    return { success: false, message: 'No connection string provided yet. Running with preloaded in-memory store.' };
  }

  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }

    console.log(`🔌 Attempting to connect to MongoDB: ${uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      dbName: 'apex_cet_neet'
    });

    isConnected = true;
    currentDbUri = uri;
    console.log('✅ MongoDB connected successfully!');

    // Automatically check and seed if collection is empty
    await autoSeedIfNeeded();

    return { success: true, message: 'Connected to MongoDB successfully!' };
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    isConnected = false;
    return { success: false, error: err.message, message: 'Failed to connect. Using in-memory fallback.' };
  }
}

export async function autoSeedIfNeeded() {
  if (!isConnected) return;
  try {
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      console.log('🌱 Student collection empty. Seeding all 165 students from dataset...');
      const seedList = getAllInitialStudents();
      await Student.insertMany(seedList);
      console.log(`🎉 Seeded ${seedList.length} students into MongoDB!`);
    } else {
      console.log(`ℹ️ MongoDB already contains ${studentCount} students.`);
    }

    // Check Settings
    let existingSettings = await Settings.findOne({ key: 'app_settings' });
    if (!existingSettings) {
      await Settings.create({
        key: 'app_settings',
        groupLinks: defaultGroupLinks,
        subjectFaculties: defaultSubjectFaculties
      });
      console.log('⚙️ Initialized default group links and subject faculties in database.');
    } else if (!existingSettings.subjectFaculties || existingSettings.subjectFaculties.size === 0) {
      existingSettings.subjectFaculties = defaultSubjectFaculties;
      await existingSettings.save();
      console.log('⚙️ Updated subject faculties in existing settings document.');
    }
  } catch (err) {
    console.error('⚠️ Error during auto-seed:', err.message);
  }
}

export function getDbStatus() {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    databaseName: mongoose.connection.name || (isConnected ? 'Connected' : 'In-Memory Store'),
    currentUri: currentDbUri ? currentDbUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : 'Not Configured (Running In-Memory with 165 Preloaded Students)'
  };
}
