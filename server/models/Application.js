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
      fullName: { type: String, required: true },
      dob: { type: String, required: true },
      annualIncome: { type: Number, required: true },
      category: { type: String, required: true },
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
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Approved', 'Flagged'],
      default: 'Submitted',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Application', applicationSchema);