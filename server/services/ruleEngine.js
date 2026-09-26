export const evaluateEligibility = (applicant, aiScrutiny, scheme) => {
  const flags = [];

  // Rule 1: Income Cap Check against Scheme Limit
  if (applicant.annualIncome > scheme.maxIncomeLimit) {
    flags.push({
      field: 'annualIncome',
      reason: `Declared income (₹${applicant.annualIncome.toLocaleString('en-IN')}) exceeds the scheme maximum limit of ₹${scheme.maxIncomeLimit.toLocaleString('en-IN')}.`,
      flaggedAt: new Date()
    });
  }

  // Rule 2: OCR Income Mismatch Check (>15% variance)
  if (aiScrutiny.extractedIncome) {
    const incomeDiff = Math.abs(applicant.annualIncome - aiScrutiny.extractedIncome);
    const varianceRatio = incomeDiff / applicant.annualIncome;

    if (varianceRatio > 0.15) {
      flags.push({
        field: 'incomeCertificateUrl',
        reason: `Income mismatch: Declared ₹${applicant.annualIncome.toLocaleString('en-IN')}, but OCR extracted ₹${aiScrutiny.extractedIncome.toLocaleString('en-IN')}.`,
        flaggedAt: new Date()
      });
    }
  }

  // Rule 3: Caste Category Verification Check
  if (aiScrutiny.isScDetected) {
    flags.push({
      field: 'casteCertificateUrl',
      reason: 'Caste Certificate indicates Scheduled Caste (SC), but this scheme is exclusively for Scheduled Tribes (ST).',
      flaggedAt: new Date()
    });
  } else if (!aiScrutiny.isStVerified && aiScrutiny.confidenceScore < 60) {
    flags.push({
      field: 'casteCertificateUrl',
      reason: 'ST Certificate details could not be verified automatically with high confidence. Requires manual review.',
      flaggedAt: new Date()
    });
  }

  // Final Decision Strategy
  const status = flags.length > 0 ? 'DEFICIENT' : 'AUTO_VERIFIED';

  return {
    status,
    flags
  };
};