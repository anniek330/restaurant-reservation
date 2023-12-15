import React from "react";
import { cancelReservation } from "../utils/api";

function ReservationCard({
  reservations,
  loadDashboard,
  setReservationsError,
}) {
  function handleCancel(reservation_id) {
    const confirmed = window.confirm(
      "Delete this reservation?\n\nYou will not be able to recover it."
    );
    if (confirmed) {
      cancelReservation(reservation_id)
        .then(() => loadDashboard())
        .catch(setReservationsError);
    }
  }

  // reservations.map
  const reservationCard = reservations.map((res) => (
    <div className="card" key={res.reservation_id}>
      <div className="card-body">
        <h4 className="card-title">
          Reservation for: {`${res.first_name} ${res.last_name}`}
        </h4>

        <div className="card-text">
          <p className="card-text">Number: {res.mobile_number}</p>
          <p className="card-text">Date: {res.reservation_date}</p>
          <p className="card-text">Time: {res.reservation_time}</p>
          <p className="card-text">Party Size: {res.people}</p>
          <p className="card-text" data-reservation-id-status={res.reservation_id}>Status: {res.status}</p>
        </div>
      </div>

      <div className="card-buttons">
        {res.status === "booked" && (
          <a
            className="btn btn-primary"
            href={`/reservations/${res.reservation_id}/seat`}
          >
            Seat
          </a>
        )}
        <a
          className="btn btn-primary"
          href={`/reservations/${res.reservation_id}/edit`}
        >
          Edit
        </a>

        <button
          className="btn btn-danger"
          onClick={() => handleCancel(res.reservation_id)}
        >
          Cancel
        </button>
      </div>
    </div>
  ));

  return <ul className="list-group mt-2 card-list">{reservationCard}</ul>;
}

export default ReservationCard;
