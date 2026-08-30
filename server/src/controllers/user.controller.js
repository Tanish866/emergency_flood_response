const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { isValidCoordinates, toGeoPoint } = require('../utils/distance');

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  phone: user.phone,
  email: user.email,
  role: user.role,
  location: user.location,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return res.status(200).json(new ApiResponse(200, sanitizeUser(user), 'Profile fetched'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'phone'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res.status(200).json(new ApiResponse(200, sanitizeUser(user), 'Profile updated'));
});

const updateLocation = asyncHandler(async (req, res) => {
  const { coordinates } = req.body;

  if (!isValidCoordinates(coordinates)) {
    throw new ApiError(400, 'coordinates must be a valid [longitude, latitude] pair');
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { location: toGeoPoint(coordinates) },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res.status(200).json(new ApiResponse(200, sanitizeUser(user), 'Location updated'));
});

module.exports = { getProfile, updateProfile, updateLocation };
