import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Form from "./Form";
import { readReservation, updateReservation } from "../utils/api";

function EditReservation() {
  const history = useHistory();

  const { reservation_id } = useParams();
  //console.log(reservation_id);

  const [reservationData, setReservationData] = useState(
    {
    first_name: "",
    last_name: "",
    mobile_number: "",
    people: 1,
    reservation_date: "",
    reservation_time: "",
  }
  );

  const [errors, setErrors] = useState(null);

  useEffect(() => {
    readReservation(reservation_id)
      .then((data) => {
        //console.log("Reservation data:", data);
        setReservationData(data);
      })
      .catch(setErrors);
  }, [reservation_id]);

  function handleCancelClick() {
    history.goBack(); // cancel button redirects to previous page
  }

  //   //what the user sees on the page
  return (
    <>
      <div>
        <h1>Edit Reservation</h1>
        {/* adds form to page (text boxes) */}
        <Form
          onSubmit={updateReservation}
          onCancel={handleCancelClick}
          initialFormData={reservationData}
        />
      </div>
    </>
  );
}

export default EditReservation;
