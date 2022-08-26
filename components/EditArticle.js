import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { BASE_URL } from "../constants/api";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

// rich text editor credits:
// https://www.youtube.com/watch?v=CuPqfcTnIwg

const schema = yup.object().shape({
  title: yup.string().required("Please enter a title!"),
  category: yup.string().required("Please select a category!"),
  content: yup.string().required("Please add some content!"),
  tag: yup.string().required("Please select a tag!"),
  image: yup.string().required("Please upload an image!"),
});

export default function EditArticle({ article }) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [file, setFile] = useState(null);
  const [imageID, setImageID] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  let token = "";

  useEffect(() => {
    token = localStorage.getItem("token");
  });

  const uploadImage = (file) => {
    const formData = new FormData();
    formData.append("file", file[0]);
    formData.append("status", "publish");

    axios
      .post(BASE_URL + "wp/v2/media", formData, {
        headers: {
          Authorization: "Bearer" + token,
        },
      })
      .then((r) => setImageID(r.data.id));
  };

  async function onDelete() {
    setDeleting(true);
    setServerError(null);

    try {
      await axios
        .delete(BASE_URL + "wp/v2/posts/" + article[0].id, {
          headers: {
            Authorization: "Bearer" + token,
          },
        })
        .then(() => {
          location.href = "/";
        });

      setSuccess(`Article successfully deleted! Yay!`);
    } catch (error) {
      console.log(error);
      if (error.code === "ERR_BAD_REQUEST") {
        setServerError("Seems like we're having some server issues, please try again another time!");
      } else {
        setServerError(error.toString());
      }
    } finally {
      setDeleting(false);
    }
  }

  async function onSubmit(data) {
    setSubmitting(true);
    setServerError(null);

    try {
      await uploadImage(file);

      data = {
        title: data.title,
        categories: [data.category],
        tags: [data.tag],
        content: data.content,
        status: "publish",
        featured_media: imageID,
      };

      await axios.post(BASE_URL + "wp/v2/posts/" + article[0].id, data, {
        headers: {
          Authorization: "Bearer" + token,
        },
      });

      setSuccess(`Article successfully editted! Go view it now!`);
    } catch (error) {
      if (error.code === "ERR_BAD_REQUEST") {
        setServerError("Seems like we're having some server issues, please try again another time!");
      } else {
        setServerError(error.toString());
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="formc formc__new rounded " onSubmit={handleSubmit(onSubmit)}>
      {serverError && <div>{serverError}</div>}
      {success && (
        <div>
          <Modal show={show} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
              <Modal.Title>Article Updated</Modal.Title>
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

      <fieldset className="form d-flex flex-column w-100 justify-content-center" disabled={submitting}>
        <Row>
          <Form.Group className="mb-3 w-50">
            <Form.Label>Title</Form.Label>
            <input {...register("title")} className="form-control" defaultValue={article[0].title.rendered} />
            {errors.title && <span>{errors.title.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3 w-50">
            <Form.Label>Tag</Form.Label>
            <select className="form-control" defaultValue={article[0].tags[0]} {...register("tag")}>
              <option value="">Select option</option>
              <option value="7">Classes</option>
              <option value="15">Documenting</option>
              <option value="16">Element</option>
              <option value="13">Importance</option>
              <option value="9">Linking</option>
              <option value="8">Paths</option>
              <option value="10">Position</option>
              <option value="12">Rules</option>
              <option value="17">Symbols</option>
              <option value="11">Syntax</option>
              <option value="14">Value</option>
            </select>
            {errors.tag && <span>{errors.tag.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3 w-50">
            <Form.Label>Category</Form.Label>
            <select className="form-control" defaultValue={article[0].categories[0]} {...register("category")}>
              <option value="">Select option</option>
              <option value="2">CSS</option>
              <option value="3">JS</option>
              <option value="4">HTML</option>
              <option value="18">Other</option>
            </select>
            {errors.category && <span>{errors.category.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3 w-50">
            <Form.Label>Image</Form.Label>
            <input
              type="file"
              {...register("image")}
              className="form-control "
              onChange={(e) => {
                setFile(e.target.files);
              }}
            />
            {errors.image && <span>{errors.image.message}</span>}
          </Form.Group>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <textarea {...register("content")} defaultValue={article[0].content.rendered} className="form-control textarea" />
          {errors.content && <span>{errors.content.message}</span>}
        </Form.Group>

        <Row className="d-flex mx-auto justify-content-between w-100">
          <button className="form-control btn-primary w-25" onClick={() => setShow(true)}>
            {submitting ? "Updating..." : "Update"}
          </button>
          <button className="form-control btn-primary w-25" onClick={onDelete}>
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </Row>
      </fieldset>
    </form>
  );
}
