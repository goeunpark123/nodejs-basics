const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const Place = require("../models/place");
const User = require("../models/user");
const HttpError = require("../models/http-error");

//검색
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Could not find a place.", 500);

    return next(error);
  }

  if (!place) {
    throw new HttpError("No match for place id.", 404);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  //let places;
  let userPlaces;

  try {
    userPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError("Try again!", 500);

    return next(error);
  }

  if (!userPlaces || userPlaces.length === 0) {
    return next(new HttpError("No match for user id.", 404)); //두번째 오류 처리 방법
  }

  res.json({
    //places: places.map((place) => place.toObject({ getters: true })),
    places: userPlaces.places,
  });
};

//추가
const createPlace = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const error = new HttpError("Invalid input.", 422);

    return next(error);
  }

  const { title, description, address, creator } = req.body;
  const createdPlace = new Place({
    title,
    description,
    address,
    //img,
    creator,
  });
  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Fail to create a place.", 500);

    return next(error);
  }

  if (!user) {
    const error = new HttpError("Couldn't find user.", 404);

    return next(error);
  }

  try {
    const s = await mongoose.startSession();
    s.startTransaction();
    await createdPlace.save({ session: s }); //새로운 place 저장
    user.places.push(createdPlace); //user의 places 속성으로 새로운 place 추가
    await user.save({ session: s }); //places가 추가된 user로 다시 저장
    await s.commitTransaction();
  } catch (err) {
    const error = new HttpError("Fail! Try Again.", 500);

    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

//수정
const updatePlace = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const error = new HttpError("Invalid input.", 422);

    return next(error);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Something wrong with finding data!", 500);

    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new (HttpError("Something wrong with saving data!", 500))();

    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

//삭제
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError("Something wrong with finding data!", 500);

    return next(error);
  }

  if (!place) {
    const error = new HttpError("Couldn't find a place!", 404);

    return next(error);
  }

  try {
    const s = await mongoose.startSession();
    s.startTransaction();
    await place.deleteOne({ session: s });
    place.creator.places.pull(place);
    await place.creator.save({ session: s });
    await s.commitTransaction();
  } catch (err) {
    const error = new HttpError("Something wrong with deleting data!", 500);

    return next(error);
  }

  res.status(200).json({ message: "Place deleted." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
