import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";

function Form({ onSubmit, onCancel, initialFormData }) {
  const history = useHistory();
  const [formData, setFormData] = useState({ ...initialFormData });
  const [tableError, setTableError] = useState(null);

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
      //return to home page on res date
      .then(() => {
        history.push(`/`);
      })
      .catch(setTableError);
  }

  return (
    <div>
      <ErrorAlert error={tableError} />
      <form onSubmit={handleSubmit} className="table-form">
        <fieldset>
          <div className="form-group">
            {/* table_name label */}
            <label htmlFor="table_name" className="form-label">
              Table Name
            </label>

            {/* table name text box */}
            <input
              type="text"
              id="table_name"
              name="table_name"
              className="form-control"
              value={formData.table_name}
              required
              placeholder="Table Name"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            {/* capacity label */}
            <label htmlFor="capacity" className="form-label">
              Number of People
            </label>
            {/*capacity input box */}
            <input
              type="number"
              id="capacity"
              name="capacity"
              className="form-control"
              value={formData.capacity}
              required
              placeholder="#"
              onChange={handleChange}
              min="1"
            />
          </div>
        </fieldset>

        <div>
          <button type="submit" className="btn btn-primary w-25">
            Submit
          </button>
          <> </>
          <button
            type="button"
            className="btn btn-danger w-25"
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
