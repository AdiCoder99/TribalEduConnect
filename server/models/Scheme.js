import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema(
  {
    schemeCode: { type: String, required: true, unique: true }, // e.g., 'NFST', 'NOS'
    name: { type: String, required: true },
    description: { type: String, required: true },
    maxIncomeLimit: { type: Number, required: true, default: 600000 },
    degreeType: { type: String, enum: ['MASTERS', 'PHD', 'UG', 'ALL'], default: 'ALL' },
    isOverseas: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Scheme', schemeSchema);