import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['IPUC_CET', 'IPUC_NEET', 'IIPUC_CET', 'IIPUC_NEET']
  },
  puc: {
    type: String,
    enum: ['I PUC', 'II PUC'],
    default: 'I PUC'
  },
  stream: {
    type: String,
    enum: ['CET', 'NEET'],
    required: true
  },
  type: {
    type: String,
    default: 'LOCAL',
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  slNo: {
    type: Number
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

studentSchema.index({ rollNo: 1, category: 1 }, { unique: true });

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
export default Student;

