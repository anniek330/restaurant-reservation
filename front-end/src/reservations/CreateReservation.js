import React from "react";
import { useHistory } from "react-router-dom";
import Form from "./Form";
import { createReservation } from "../utils/api";

function CreateReservation() {
  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    people: 0,
    reservation_date: "",
    reservation_time: "",
  };

  const history = useHistory();

  function handleCancelClick() {
    history.goBack(); // cancel button redirects to previous page
  }

  //what the user sees on the page
  return (
    <>
      <div>
        <h1>Make a Reservation</h1>
        {/* adds form to page (text boxes) */}
        <Form
          onSubmit={createReservation}
          onCancel={handleCancelClick}
          initialFormData={initialFormData}
        />
      </div>
    </>
  );
}

export default CreateReservation;
