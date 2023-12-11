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
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

//only has properties from VALID array
function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}.`,
    });
  }
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
//check if time is real: btw 10:30 and 21:30 (9:30 pm)
function validateTime(string) {
  const [hour, minute] = string.split(":");

  if (hour.length > 2 || minute.length > 2) {
    return false;
  }
  const hourAsInt = Number(hour);
  const minuteAsInt = Number(minute);

  if (hourAsInt < 10 || hourAsInt > 21) {
    return false;
  }
  if (minuteAsInt < 0 || minuteAsInt > 59) {
    return false;
  }
  if (hourAsInt === 21 && minuteAsInt > 30) {
    return false;
  }
  if (hourAsInt === 10 && minuteAsInt < 30) {
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
          message: `reservation_time: ${data[field]} is not a valid time.`,
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
          message: `reservation_date: ${data[field]} is not a valid date.`,
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
          message: `Number of people: ${data[field]} must be a number greater than zero.`,
        });
      }
    }
  });
  next();
}

// function validatePeopleField(req, res, next) {
//   const { people } = req.body.data;
//   console.log(people);
//   const isNumber = Number.isInteger(people);
//   console.log(isNumber);
//   if (!isNumber) {
//     return next({
//       status: 400,
//       message: `Number of people: ${people} must be a number greater than zero.`,
//     });
//   }
//   next();
//}

// date.getDay(): (Sunday is 0 and Saturday is 6).
function validateNotOnTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const [year, month, day] = reservation_date.split("-");

  const resDate = new Date(`${month} ${day}, ${year}`);
  if (resDate.getDay() === 2) {
    return next({
      status: 400,
      message: "Restaurant is closed on Tuesdays.",
    });
  }
  next();
}
function validateInTheFuture(req, res, next) {
  const { reservation_date } = req.body.data;
  const [year, month, day] = reservation_date.split("-");

  const resDate = new Date(`${month} ${day}, ${year}`);
  const today = new Date();

  if (resDate < today) {
    return next({
      status: 400,
      message: "Only future reservations are allowed.",
    });
  }
  next();
}

//default status is booked
function validateDefaultStatus(req, res, next) {
  const { status } = req.body.data;
  if (status && status !== "booked") {
    next({
      status: 400,
      message: `${status} is not a vaild status. New reservations must have a status of: booked.`,
    });
  }
  next();
}

function validateStatusField(req, res, next) {
  const { status } = req.body.data;
  if (status && !["booked", "finished","seated","cancelled"].includes(status)) {
    return next({
      status: 400,
      message: `Reservation status: ${status} is not allowed.`,
    });
  }
  next();
}
function statusIsFinished(req, res, next) {
  const { status } = res.locals.reservation;
  if (status && status === "finished") {
    return next({
      status: 400,
      message: `A finished reservation cannot be updated.`,
    });
  }
  next();
}

async function list(req, res) {
  const { date } = req.query;
  const { mobile_number } = req.query;
  if (date) {
    const data = await service.listReservationsByDate(date);
    res.status(200).json({ data });
  }
  if (mobile_number) {
    const data = await service.search(mobile_number);
    res.status(200).json({ data });
  } else {
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

async function update(req, res) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await service.update(updatedReservation);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasProperties(
      "first_name",
      "last_name",
      "mobile_number",
      "people",
      "reservation_date",
      "reservation_time"
    ),
    validateTimeField,
    validatePeopleField,
    validateDateField,
    validateNotOnTuesday,
    validateInTheFuture,
    validateDefaultStatus,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  updateStatus: [
    hasOnlyValidProperties,
    asyncErrorBoundary(reservationExists),
    validateStatusField,
    statusIsFinished,
    asyncErrorBoundary(update),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasProperties(
      "first_name",
      "last_name",
      "mobile_number",
      "people",
      "reservation_date",
      "reservation_time"
    ),
    hasOnlyValidProperties,
    validateTimeField,
    validatePeopleField,
    validateDateField,
    validateNotOnTuesday,
    validateInTheFuture,
    validateDefaultStatus,
    validateStatusField,
    asyncErrorBoundary(update),
  ],
};
