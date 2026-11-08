import mongoose from 'mongoose';

const attendanceStudentItemSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  rollNo: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  stream: {
    type: String
  },
  type: {
    type: String
  },
  phone: {
    type: String
  },
  present: {
    type: Boolean,
    default: true
  },
  score: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    default: 100
  }
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['IPUC_CET', 'IPUC_NEET', 'IIPUC_CET', 'IIPUC_NEET'],
    index: true
  },
  subject: {
    type: String,
    required: true,
    default: 'Physics'
  },
  faculty: {
    type: String,
    default: 'Faculty'
  },
  sessionTime: {
    type: String,
    default: '09:00'
  },
  maxScore: {
    type: Number,
    default: 100
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  presentCount: {
    type: Number,
    default: 0
  },
  absentCount: {
    type: Number,
    default: 0
  },
  records: [attendanceStudentItemSchema]
}, {
  timestamps: true
});

// Unique compound index so each category has one session per date and subject
attendanceSchema.index({ date: 1, category: 1, subject: 1 }, { unique: true });

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
export default Attendance;

