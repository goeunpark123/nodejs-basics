const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers",
    location: {
      lat: 40.7484405,
      lng: -73.9882393,
    },
    address: "20 W 34th St., New York, NY 10001",
    creator: "u1",
  },
];

//검색
const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;

  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError("No match for place id.", 404);
  }

  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const places = DUMMY_PLACES.find((u) => {
    return u.creator === userId;
  });

  if (!places || places.length === 0) {
    return next(new HttpError("No match for user id.", 404)); //두번째 오류 처리 방법
  }

  res.json({ places });
};

//추가
const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    throw new HttpError("Invalid input.", 422);
  }

  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

//수정
const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeid = req.params.pid;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    throw new HttpError("Invalid input.", 422);
  }

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeid) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeid);

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

//삭제
const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;

  if (!DUMMY_PLACES.find((p) => p.id !== placeId)) {
    throw new HttpError("Delete unavailable.");
  }

  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  res.status(200).json({ message: "Place deleted." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
