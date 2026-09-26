import Application from '../models/Application.js';

// GET /api/analytics/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();

    const statusCounts = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const stateDistribution = await Application.aggregate([
      { $group: { _id: '$applicant.state', total: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    const statusMap = statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        totalApplications,
        autoVerified: statusMap['AUTO_VERIFIED'] || 0,
        deficient: statusMap['DEFICIENT'] || 0,
        approved: statusMap['APPROVED'] || 0,
        rejected: statusMap['REJECTED'] || 0,
        pending: statusMap['PENDING'] || 0,
        stateDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};