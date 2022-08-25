import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { BASE_URL } from "../constants/api";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import slugify from "slugify";

// rich text editor credits:
// https://www.youtube.com/watch?v=CuPqfcTnIwg

const schema = yup.object().shape({
  Name: yup.string().required("Please enter your name!"),
  category: yup.string().required("Please select a category!"),
  detail_beds: yup.number().required("Please enter a value!").min(1, "Please enter a value greater than 1").typeError("Please enter a valid value greater than 1!"),
  detail_guests: yup.number().required("Please enter a value!").min(1, "Please enter a value greater than 1").typeError("Please enter a valid value greater than 1!"),
  detail_bedrooms: yup.number().required("Please enter a value!").min(1, "Please enter a value greater than 1").typeError("Please enter a valid value greater than 1!"),
  detail_baths: yup.number().required("Please enter a value!").min(1, "Please enter a value greater than 1").typeError("Please enter a valid value greater than 1!"),
  price_night: yup.number().required("Please enter a value!").min(1, "Please enter a value greater than 1").typeError("Please enter a valid value greater than 1!"),
  host: yup.string().required("Please enter a host!"),
  location: yup.string().required("Please enter a location!"),
  short_desc: yup.string().required("Please enter a short description (100-200 words)").min(100, "Short description must be atleast 100 characters.").max(200, "Short description has a cap of 200 characters."),
  long_desc: yup.string().required("Please enter a long description (200-300 words)").min(200, "Long description must be atleast 200 characters.").max(500, "Long description has a cap of 500 characters."),
});

export default function EnquiryForm() {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data) {
    setSubmitting(true);
    setServerError(null);

    const url = BASE_URL + "/api/accomodations";

    const sluggedName = slugify(data.Name, { lower: true });

    const body = {
      data: {
        Name: data.Name,
        slug: sluggedName,
        short_desc: data.short_desc,
        long_desc: data.long_desc,
        host: data.host,
        category: data.category,
        price_night: data.price_night,
        location: data.location,

        detail: [
          {
            beds: data.detail_beds,
            guests: data.detail_guests,
            bedrooms: data.detail_bedrooms,
            baths: data.detail_baths,
          },
        ],
      },
    };

    const postData = { data: body };

    try {
      const response = await axios.post(url, body);
      setSuccess("Accomodation successfully added! Current version of this panel does not allow for images :(");
    } catch (error) {
      setServerError(error.toString());
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="formc formc__new rounded" onSubmit={handleSubmit(onSubmit)}>
      {serverError && <div>{serverError}</div>}
      {success && (
        <div>
          <Modal show={show} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
              <Modal.Title>Accomodation Added</Modal.Title>
            </Modal.Header>
            <Modal.Body>{success}</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}

      <fieldset className="form d-flex flex-column" disabled={submitting}>
        <Row>
          <Form.Group className="mb-3 w-50">
            <Form.Label>Accomodation Name</Form.Label>
            <input {...register("Name")} className="form-control" />
            {errors.Name && <span>{errors.Name.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3 w-50">
            <Form.Label>Category</Form.Label>
            <select className="form-control" {...register("category")}>
              <option value="">Select option</option>
              <option value="hotel">Hotel</option>
              <option value="b&b">B&B</option>
              <option value="guesthouse">Guesthouse</option>
              <option value="other">Other</option>
            </select>
            {errors.subject && <span>{errors.subject.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3 w-100">
            <Form.Label>Location</Form.Label>
            <input {...register("location")} className="form-control" />
            {errors.location && <span>{errors.location.message}</span>}
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group className="mb-3 w-25">
            <Form.Label>Beds</Form.Label>
            <input type="number" {...register("detail_beds")} className="form-control" />
            {errors.detail_beds && <span>{errors.detail_beds.message}</span>}
          </Form.Group>
          <Form.Group className="mb-3 w-25">
            <Form.Label>Guests</Form.Label>
            <input type="number" {...register("detail_guests")} className="form-control" />
            {errors.detail_guests && <span>{errors.detail_guests.message}</span>}
          </Form.Group>
          <Form.Group className="mb-3 w-25">
            <Form.Label>Bedrooms</Form.Label>
            <input type="number" {...register("detail_bedrooms")} className="form-control" />
            {errors.detail_bedrooms && <span>{errors.detail_bedrooms.message}</span>}
          </Form.Group>
          <Form.Group className="mb-3 w-25">
            <Form.Label>Baths</Form.Label>
            <input type="number" {...register("detail_baths")} className="form-control" />
            {errors.detail_baths && <span>{errors.detail_baths.message}</span>}
          </Form.Group>
        </Row>

        <Row>
          <Form.Group className="mb-3 w-50">
            <Form.Label>Host</Form.Label>
            <input {...register("host")} className="form-control" />
            {errors.host && <span>{errors.host.message}</span>}
          </Form.Group>
          <Form.Group className="mb-3 w-50">
            <Form.Label>Price per night</Form.Label>
            <input type="number" {...register("price_night")} className="form-control" />
            {errors.price_night && <span>{errors.price_night.message}</span>}
          </Form.Group>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Short Description</Form.Label>
          <textarea {...register("short_desc")} className="form-control" />
          {errors.short_desc && <span>{errors.short_desc.message}</span>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Long Description</Form.Label>
          <textarea {...register("long_desc")} className="form-control" />
          {errors.long_desc && <span>{errors.long_desc.message}</span>}
        </Form.Group>

        <button className="form-control btn-primary" onClick={() => setShow(true)}>
          {submitting ? "Creating..." : "Create"}
        </button>
      </fieldset>
    </form>
  );
}
