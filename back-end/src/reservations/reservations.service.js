const knex = require("../db/connection");

function list() {
  return knex("reservations")
    .select("*")
    .orderBy("reservations.reservation_date");
}

//"returns only reservations matching date query parameter" sorted by time (earliest time first)"
function listReservationsByDate(reservation_date) {
  return knex("reservations")
    .select("*")
    .where( {reservation_date})
    .orderBy("reservation_time");
}
function create(reservation) {
  return knex("reservations")
    .insert(reservation) //OR .insert(reservation,"*") without "returning" line
    .returning("*")
    .then((createdReservation) => createdReservation[0]);
}
function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}
module.exports = {
  list,
  create,
  read,
  listReservationsByDate,
};
