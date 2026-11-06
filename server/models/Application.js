import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
      required: true,
    },
    applicant: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: String,
      stCertificateNo: String,
      annualIncome: { type: Number, required: true },
      academicScore: Number,
      state: String,
      university: String,
      course: String,
      rollNumber: String,
      bankAccountNo: String,
      ifscCode: String,
    },
    // AWS S3 Document Links stored here
    documents: {
      casteCertificateUrl: {
        type: String,
        required: true, // https://tribaleduconnect-documents.s3.eu-north-1.amazonaws.com/documents/casteDoc-171234.png
      },
      incomeCertificateUrl: {
        type: String,
        required: true, // https://tribaleduconnect-documents.s3.eu-north-1.amazonaws.com/documents/incomeDoc-171234.png
      },
    },
    aiScrutiny: {
      extractedIncome: Number,
      isStVerified: Boolean,
      isScDetected: Boolean,
      confidenceScore: Number,
    },
    reviewHistory: [{
      status: { type: String, required: true },
      note: { type: String, trim: true },
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reviewedAt: { type: Date, default: Date.now },
    }],
    status: {
      type: String,
      enum: ['SUBMITTED', 'UNDER_REVIEW', 'AUTO_VERIFIED', 'MANUAL_REVIEW', 'DEFICIENT', 'APPROVED', 'REJECTED'],
      default: 'SUBMITTED',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Application', applicationSchema);