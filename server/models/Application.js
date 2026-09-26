import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scheme: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
    applicant: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      stCertificateNo: { type: String, required: true },
      annualIncome: { type: Number, required: true },
      academicScore: { type: Number, required: true },
      state: { type: String, required: true },
      university: { type: String, required: true }
    },
    documents: {
      casteCertificateUrl: { type: String, default: 'sample_caste.pdf' },
      incomeCertificateUrl: { type: String, default: 'sample_income.pdf' }
    },
    aiScrutiny: {
      extractedName: String,
      extractedIncome: Number,
      extractedCasteCategory: String,
      confidenceScore: { type: Number, default: 0 },
      isTamperSuspected: { type: Boolean, default: false }
    },
    status: {
      type: String,
      enum: ['SUBMITTED', 'AUTO_VERIFIED', 'DEFICIENT', 'MANUAL_REVIEW', 'APPROVED', 'REJECTED'],
      default: 'SUBMITTED'
    },
    deficiencyNotes: [
      {
        field: String,
        reason: String,
        flaggedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Application', applicationSchema);