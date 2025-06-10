import { matchedData } from "express-validator";
import locationModel from "../../models/locationModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function getLocations(req, res) {
  try {
    const requestData = matchedData(req);
    console.log("REQUEST:".requestData);

    console.log(requestData);
    const parsedLat = parseFloat(requestData?.lat);
    const parsedLng = parseFloat(requestData?.lng);

    const locations = await locationModel.find({
      deleted: false,
      ...(requestData?.q
        ? { name: { $regex: new RegExp(requestData?.q, "i") } }
        : {}),
    });

    if (!requestData?.lat || !requestData?.lng) {
      return response200(res, locations);
    }

    const locationsWithDistance = locations.map((loc) => {
      const locLat = parseFloat(loc.location.lat);
      const locLng = parseFloat(loc.location.lng);
      const distance = haversineDistance(parsedLat, parsedLng, locLat, locLng);
      return {
        ...loc.toObject(),
        distance,
      };
    });

    locationsWithDistance.sort((a, b) => a.distance - b.distance);

    response200(res, locationsWithDistance);
  } catch (err) {
    console.log({ err });
    internalServerResponse(res);
  }
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const toRadians = (deg) => (deg * Math.PI) / 180;

  const R = 6371e3;
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lng2 - lng1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
