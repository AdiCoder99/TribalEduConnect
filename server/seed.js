import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import User from './models/User.js';
import Scheme from './models/Scheme.js';
import Application from './models/Application.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing database collections...');
    await User.deleteMany();
    await Scheme.deleteMany();
    await Application.deleteMany();

    console.log('👤 Seeding Demo Users...');
    const users = await User.create([
      {
        name: 'Aditya Srivastava',
        email: 'student@gmail.com',
        password: 'password123',
        role: 'STUDENT',
        phone: '9876543210',
        stCertificateNo: 'ST-2026-9948',
        state: 'Uttar Pradesh'
      },
      {
        name: 'Sunita Sharma (Verifier)',
        email: 'verifier@mota.gov.in',
        password: 'adminpassword',
        role: 'SCRUTINIZER',
        phone: '9876543211',
        state: 'Delhi'
      },
      {
        name: 'Ministry Executive (Admin)',
        email: 'admin@mota.gov.in',
        password: 'adminpassword',
        role: 'SUPER_ADMIN',
        phone: '9876543212',
        state: 'Delhi'
      }
    ]);

    const studentUser = users[0];

    console.log('📜 Seeding MoTA Schemes...');
    const schemes = await Scheme.create([
      {
        schemeCode: 'NFST',
        name: 'National Fellowship for Higher Education of ST Students',
        description: 'Provides financial assistance to eligible ST students to pursue M.Phil and Ph.D. courses in India.',
        maxIncomeLimit: 600000,
        degreeType: 'PHD',
        isOverseas: false,
        isActive: true
      },
      {
        schemeCode: 'NOS',
        name: 'National Overseas Scholarship for ST Students',
        description: 'Provides financial assistance to selected ST students for pursuing Master’s and Ph.D. abroad.',
        maxIncomeLimit: 800000,
        degreeType: 'MASTERS',
        isOverseas: true,
        isActive: true
      }
    ]);

    console.log('📑 Seeding Demo Applications...');
    await Application.create([
      {
        user: studentUser._id,
        scheme: schemes[0]._id,
        applicant: {
          name: studentUser.name,
          email: studentUser.email,
          phone: '9876543210',
          stCertificateNo: 'ST-2026-9948',
          annualIncome: 450000,
          academicScore: 88,
          state: 'Uttar Pradesh',
          university: 'IIT Kanpur',
          course: 'Ph.D. Computer Science',
          rollNumber: 'CS2026-88',
          bankAccountNo: '918273645012',
          ifscCode: 'SBIN0001234'
        },
        documents: {
          casteCertificateUrl: 'caste_cert_valid.pdf',
          incomeCertificateUrl: 'income_cert_valid.pdf'
        },
        aiScrutiny: {
          extractedName: 'Aditya Srivastava',
          extractedIncome: 450000,
          extractedCasteCategory: 'Scheduled Tribe',
          confidenceScore: 94,
          isTamperSuspected: false
        },
        status: 'AUTO_VERIFIED',
        deficiencyNotes: []
      },
      {
        user: studentUser._id,
        scheme: schemes[1]._id,
        applicant: {
          name: studentUser.name,
          email: studentUser.email,
          phone: '9876543210',
          stCertificateNo: 'ST-2026-9948',
          annualIncome: 750000,
          academicScore: 82,
          state: 'Uttar Pradesh',
          university: 'Imperial College London',
          course: 'M.Sc. Data Science',
          rollNumber: 'ICL-9021',
          bankAccountNo: '918273645012',
          ifscCode: 'SBIN0001234'
        },
        documents: {
          casteCertificateUrl: 'caste_cert_valid.pdf',
          incomeCertificateUrl: 'income_cert_mismatch.pdf'
        },
        aiScrutiny: {
          extractedName: 'Aditya Srivastava',
          extractedIncome: 550000,
          extractedCasteCategory: 'Scheduled Tribe',
          confidenceScore: 72,
          isTamperSuspected: false
        },
        status: 'DEFICIENT',
        deficiencyNotes: [
          {
            field: 'incomeCertificateUrl',
            reason: 'Income mismatch: Form declared ₹7,50,000, but document OCR extracted ₹5,50,000.',
            flaggedAt: new Date()
          }
        ]
      }
    ]);

    console.log('\n✅ Database seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('🔑 TEST CREDENTIALS FOR DEMO:');
    console.log('1. Student     : student@gmail.com / password123');
    console.log('2. Scrutinizer : verifier@mota.gov.in / adminpassword');
    console.log('3. Super Admin : admin@mota.gov.in / adminpassword');
    console.log('----------------------------------------------------');

    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();