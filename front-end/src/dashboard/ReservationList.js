import React from "react";
//import { cancelReservation } from "../utils/api";

function ReservationCard({ reservations }) {
  // function handleCancel(reservation_id) {
  //   const confirmed = window.confirm(
  //     "Delete this reservation?\n\nYou will not be able to recover it."
  //   );
  //   if (confirmed) {
  //     cancelReservation(reservation_id).then(fetchReservationsList);
  //   }
  // }

  // reservations.map
  const reservationCard = reservations.map((res) => (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">
          Reservation for: {`${res.first_name} ${res.last_name}`}
        </h5>
        <p className="card-text">Number: {res.mobile_number}</p>
        <p className="card-text">Date: {res.reservation_date}</p>
        <p className="card-text">Time: {res.reservation_time}</p>
        <p className="card-text">Party Size: {res.people}</p>
      </div>

      <div className="card-buttons">
        {/* <button className="btn btn-danger" onClick={handleCancel}>
          Cancel
        </button> */}
      </div>
    </div>
  ));
  return <ul className="list-group mt-2 card-list">{reservationCard}</ul>;
}

export default ReservationCard;
