const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { isValidCoordinates } = require('../utils/distance');
const shelterService = require('../services/shelter.service');

const getShelters = asyncHandler(async (req, res) => {
  const shelters = await shelterService.listShelters();
  return res.status(200).json(new ApiResponse(200, shelters, 'Shelters fetched'));
});

const getShelterById = asyncHandler(async (req, res) => {
  const shelter = await shelterService.getShelterById(req.params.id);
  return res.status(200).json(new ApiResponse(200, shelter, 'Shelter fetched'));
});

const parseCoordinatesFromQuery = (req) => {
  const { lng, lat, maxDistanceKm } = req.query;
  const coordinates = [Number(lng), Number(lat)];

  if (!isValidCoordinates(coordinates)) {
    throw new ApiError(400, 'lng and lat query parameters must form a valid coordinate pair');
  }

  return { coordinates, maxDistanceKm: maxDistanceKm ? Number(maxDistanceKm) : undefined };
};

const getNearbyShelters = asyncHandler(async (req, res) => {
  const { coordinates, maxDistanceKm } = parseCoordinatesFromQuery(req);

  const shelters = await shelterService.findNearbyShelters({
    coordinates,
    ...(maxDistanceKm ? { maxDistanceKm } : {}),
  });

  return res.status(200).json(new ApiResponse(200, shelters, 'Nearby shelters fetched'));
});

const getRecommendedShelter = asyncHandler(async (req, res) => {
  const { coordinates, maxDistanceKm } = parseCoordinatesFromQuery(req);

  const result = await shelterService.recommendShelter({
    coordinates,
    ...(maxDistanceKm ? { maxDistanceKm } : {}),
  });

  if (!result.recommended) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'No suitable shelter found near this location'));
  }

  return res.status(200).json(new ApiResponse(200, result.recommended, 'Recommended shelter found'));
});

module.exports = { getShelters, getShelterById, getNearbyShelters, getRecommendedShelter };
