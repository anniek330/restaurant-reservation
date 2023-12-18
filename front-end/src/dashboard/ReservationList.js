import React from "react";
import { cancelReservation } from "../utils/api";

function ReservationCard({
  reservations,
  loadDashboard,
  setReservationsError,
}) {
  function handleCancel(reservation_id) {
    const confirmed = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (confirmed) {
      cancelReservation(reservation_id)
        .then(() => loadDashboard())
        .catch(setReservationsError);
    }
  }

  // reservations.map
  const reservationCard = reservations
    .filter((reservation) => reservation.status === "booked")
    .map((reservation) => (
      <div className="card" key={reservation.reservation_id}>
        <div className="card-body">
          <h4 className="card-title">
            Reservation for: {`${reservation.first_name} ${reservation.last_name}`}
          </h4>

          <div className="card-text">
            <p className="card-text">Number: {reservation.mobile_number}</p>
            <p className="card-text">Date: {reservation.reservation_date}</p>
            <p className="card-text">Time: {reservation.reservation_time}</p>
            <p className="card-text">Party Size: {reservation.people}</p>
            <p
              className="card-text"
              data-reservation-id-status={reservation.reservation_id}
            >
              Status: {reservation.status}
            </p>
          </div>
        </div>

        <div className="card-buttons">
          <a
            className="btn btn-primary"
            href={`/reservations/${reservation.reservation_id}/seat`}
          >
            Seat
          </a>

          <a
            className="btn btn-primary"
            href={`/reservations/${reservation.reservation_id}/edit`}
          >
            Edit
          </a>

          <button
            className="btn btn-danger"
            onClick={() => handleCancel(reservation.reservation_id)}
            data-reservation-id-cancel={reservation.reservation_id}
          >
            Cancel
          </button>
        </div>
      </div>
    ));

  return <ul className="list-group mt-2 card-list">{reservationCard}</ul>;
}

export default ReservationCard;
