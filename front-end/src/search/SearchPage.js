import React, { useState } from "react";
import ReservationCard from "../dashboard/ReservationList";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";

function SearchPage() {
  const [error, setError] = useState(null);

  const [mobile_number, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleChange = ({ target }) => {
    setMobileNumber(target.value);
  };

  const handleFind = (event) => {
    event.preventDefault();
    setButtonClicked(true);
    listReservations({ mobile_number })
      .then((reservations) => setReservations(reservations))
      .catch(setError);
  };

  return (
    <main>
      <div className="d-md-flex mb-3">
        <h1>Search for a Reservation</h1>
        <ErrorAlert error={error} setError={setError} />
      </div>

      {/* search box */}
      <div className="input-group mb-3" id="mobileSearchBox">
        <input
          type="text"
          name="mobile_number"
          className="form-control"
          onChange={handleChange}
          value={mobile_number}
          placeholder="Enter a customer's phone number"
        />

        <button className="btn btn-primary" type="submit" onClick={handleFind}>
          Find
        </button>
      </div>

      {/* Reservations */}
      <div className="listReservations">
        {buttonClicked && reservations.length === 0 ? (
          <h3>No reservations found</h3>
        ) : (
          reservations.length > 0 && (
            <ReservationCard reservations={reservations} />
          )
        )}
      </div>
    </main>
  );
}

export default SearchPage;
