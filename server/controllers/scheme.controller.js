import Scheme from '../models/Scheme.js';

/**
 * 1. GET ALL ACTIVE SCHEMES (Public / Student View)
 * Used on the Applicant Portal homepage and form dropdowns.
 */
export const getActiveSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: schemes.length,
      data: schemes
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 2. GET SINGLE SCHEME DETAILS BY ID
 * Fetches full metadata and eligibility limits for a specific scheme.
 */
export const getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ success: false, error: 'Scheme not found.' });
    }
    res.json({ success: true, data: scheme });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 3. CREATE NEW SCHEME (Super Admin Only)
 * Allows administrators to add a new scholarship program to the portal.
 */
export const createScheme = async (req, res) => {
  try {
    const { schemeCode, name, description, maxIncomeLimit, degreeType, isOverseas } = req.body;

    const existingScheme = await Scheme.findOne({ schemeCode });
    if (existingScheme) {
      return res.status(400).json({ success: false, error: `Scheme code '${schemeCode}' already exists.` });
    }

    const scheme = await Scheme.create({
      schemeCode,
      name,
      description,
      maxIncomeLimit,
      degreeType,
      isOverseas
    });

    res.status(201).json({
      success: true,
      message: 'Scholarship scheme created successfully.',
      data: scheme
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 4. UPDATE SCHEME / ELIGIBILITY RULES (Super Admin Only)
 * Update scheme limits (e.g., changing maxIncomeLimit from ₹6L to ₹8L).
 */
export const updateScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!scheme) {
      return res.status(404).json({ success: false, error: 'Scheme not found.' });
    }

    res.json({
      success: true,
      message: 'Scheme eligibility parameters updated.',
      data: scheme
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 5. TOGGLE SCHEME ACTIVE STATUS (Super Admin Only)
 * Enable or disable applications for a scheme without deleting it from the database.
 */
export const toggleSchemeStatus = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ success: false, error: 'Scheme not found.' });
    }

    scheme.isActive = !scheme.isActive;
    await scheme.save();

    res.json({
      success: true,
      message: `Scheme ${scheme.isActive ? 'activated' : 'deactivated'} successfully.`,
      data: scheme
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};