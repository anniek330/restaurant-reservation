import React from "react";
//import { cancelReservation } from "../utils/api";

function ReservationList({ reservations, setReservations, setError }) {
  // function handleResCancel(reservation_id) {
  //   const confirmed = window.confirm(
  //     "Delete this reservation?\n\nYou will not be able to recover it."
  //   );
  //   if (confirmed) {
  //     cancelReservation(reservation_id).then(fetchReservationsList);
  //   }
  // }

  // reservations.map
  const reservationList = reservations.map((reservation) => (
    <li
      key={reservation.id}
      className="list-group-item list-group-item-action flex-column align-items-start"
    >
      <div>
        <li>
          reservation.first_name, reservation.last_name,
          reservation.mobile_number, reservation.reservation_date,
          reservation.reservation_time, reservation.people
        </li>
      </div>

      <button
        className="btn btn-danger float-right"
        // onClick={() => handleResCancel(reservation.id)}
      >
        {" "}
        <span className="oi oi-trash p-1" />
      </button>
    </li>
  ));

  return <ul className="list-group mt-2 res-list">{reservationList}</ul>;
}

export default ReservationList;
