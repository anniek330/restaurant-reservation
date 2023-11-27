import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";

function Form({ onSubmit, onCancel, initialFormData }) {
  const history = useHistory();
  const [formData, setFormData] = useState({ ...initialFormData });
  const [reservationsError, setReservationsError] = useState(null);

  //console.log(initialFormData);

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  //submit handler for each reservation:
  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(formData)
      //return to home page
      .then(() => {
        history.push("/");
      })
      .catch(setReservationsError);
  }

  return (
    <div>
      <ErrorAlert error={reservationsError} />
      <form onSubmit={handleSubmit} className="res-form">
        <fieldset>
          <div className="form-group">
            {/* first_name label */}
            <label htmlFor="first_name" className="form-label">
              First Name
            </label>

            {/* first name text box */}
            <input
              type="text"
              id="first_name"
              name="first_name"
              className="form-control"
              value={formData.first_name}
              required
              placeholder="First Name"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            {/* last name label */}
            <label htmlFor="last_name" className="form-label">
              Last Name
            </label>

            {/* last name text box */}
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="form-control"
              value={formData.last_name}
              required
              placeholder="Last Name"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            {/* mobile label */}
            <label htmlFor="mobile_number" className="form-label">
              Mobile Number
            </label>

            {/* mobile input box-telephone */}
            <input
              type="tel"
              id="mobile_number"
              name="mobile_number"
              className="form-control"
              value={formData.mobile_number}
              required
              placeholder="Mobile Number"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            {/* people label */}
            <label htmlFor="people" className="form-label">
              Number of People
            </label>

            {/* people input box */}
            <input
              type="number"
              id="people"
              name="people"
              className="form-control"
              value={formData.people}
              required
              placeholder="Number of People"
              onChange={handleChange}
              min="1"
            />
          </div>

          <div className="form-group">
            {/* date label */}
            <label htmlFor="reservation_date" className="form-label">
              Date of reservation
            </label>

            {/* date input box */}
            <input
              type="date"
              id="reservation_date"
              name="reservation_date"
              className="form-control"
              value={formData.reservation_date}
              required
              placeholder="YYYY-MM-DD"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            {/* time label */}
            <label htmlFor="reservation_time" className="form-label">
              Time of reservation
            </label>

            {/* time text box */}
            <input
              type="time"
              id="reservation_time"
              name="reservation_time"
              className="form-control"
              value={formData.reservation_time}
              required
              placeholder="HH:MM"
              onChange={handleChange}
            />
          </div>
        </fieldset>

        <div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>

          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default Form;
