import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  groupLinks: {
    IPUC_CET_ABSENT: { type: String, default: 'https://chat.whatsapp.com/' },
    IPUC_CET_MARKS: { type: String, default: 'https://chat.whatsapp.com/' },
    IPUC_NEET_ABSENT: { type: String, default: 'https://chat.whatsapp.com/' },
    IPUC_NEET_MARKS: { type: String, default: 'https://chat.whatsapp.com/' },
    IIPUC_CET_ABSENT: { type: String, default: 'https://chat.whatsapp.com/' },
    IIPUC_CET_MARKS: { type: String, default: 'https://chat.whatsapp.com/' },
    IIPUC_NEET_ABSENT: { type: String, default: 'https://chat.whatsapp.com/' },
    IIPUC_NEET_MARKS: { type: String, default: 'https://chat.whatsapp.com/' }
  },
  customMongoUri: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
export default Settings;
