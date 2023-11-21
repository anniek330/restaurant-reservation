const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");

//middleware fxns

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "people",
  "reservation_date",
  "reservation_time",
];

//all properties are filled in
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "people",
  "reservation_date",
  "reservation_time"
);

//only has properties from VALID array
function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const arrayOfFields = Object.keys(data);

  const invalidFields = arrayOfFields.filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

//check if time is real: btw 01:00 and 24:59 (military time)
function validateTime(str) {
  const [hour, minute] = str.split(":");

  if (hour.length > 2 || minute.length > 2) {
    return false;
  }
  const hourAsInt = Number(hour);
  const minuteAsInt = Number(minute);

  if (hourAsInt < 1 || hourAsInt > 23) {
    return false;
  }
  if (minuteAsInt < 0 || minuteAsInt > 59) {
    return false;
  }
  return true;
}

function validateTimeField(req, res, next) {
  const { data = {} } = req.body;
  Object.keys(data).filter((field) => {
    if (field === "reservation_time") {
      if (!validateTime(data[field])) {
        return next({
          status: 400,
          message: `${"reservation_time"} is not a valid time`,
        });
      }
    }
  });
  next();
}
function validateDateField(req, res, next) {
  const { data = {} } = req.body;
  Object.keys(data).filter((field) => {
    if (field === "reservation_date") {
      if (!Date.parse(data[field])) {
        return next({
          status: 400,
          message: `${"reservation_date"} is not a valid date`,
        });
      }
    }
  });
  next();
}
function validatePeopleField(req, res, next) {
  const { data = {} } = req.body;
  Object.keys(data).filter((field) => {
    if (field === "people") {
      const isNumber = Number.isInteger(data[field]);
      if (!isNumber || Number(data[field]) < 0) {
        return next({
          status: 400,
          message: `${"people"} is not a valid number greater than zero`,
        });
      }
    }
  });
  next();
}

//reservation_id exists
async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} cannot be found.`,
  });
}

async function list(req, res) {
  const { reservation_date } = req.query;
  if (reservation_date) {
    const data = await service.listReservationsByDate(reservation_date);
    res.status(200).json({ data });
  }
  else {
    const data = await service.list();
    res.status(200).json({ data });
  }
}
async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

function read(req, res) {
  const { reservation: data } = res.locals;
  res.send({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    validateTimeField,
    validatePeopleField,
    validateDateField,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
};
