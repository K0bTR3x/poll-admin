import React, { useState } from "react";
import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import "./EventCreate.scss";

const EventCreate = () => {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    title: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    status: "upcoming",
    questions: [],
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Başlıq mütləqdir"),
    eventDate: Yup.date().required("Tədbirin tarixi mütləqdir"),
    startTime: Yup.string().required("Başlama vaxtı mütləqdir"),
    endTime: Yup.string()
      .required("Bitmə vaxtı mütləqdir")
      .test(
        "is-after-start",
        "Bitmə vaxtı başlanğıc vaxtından sonra olmalıdır",
        function (value) {
          const { startTime } = this.parent;
          if (!startTime || !value) return true;
          const [sh, sm] = startTime.split(":").map(Number);
          const [eh, em] = value.split(":").map(Number);
          if (eh > sh) return true;
          if (eh === sh && em > sm) return true;
          return false;
        }
      ),
    status: Yup.string().oneOf(["upcoming", "active", "finished"]).required(),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      const payload = {
        title: values.title,
        date: values.eventDate, // YYYY-MM-DD
        startTime: values.startTime,
        endTime: values.endTime,
        status: values.status,
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/events`, payload);
      toast.success("Tədbir uğurla yaradıldı!");
      resetForm();
    } catch (err) {
      console.log(process.env.REACT_APP_API_URL)
      console.log(err);
      toast.error("Xəta baş verdi. Tədbir yaradıla bilmədi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event">
      <Toaster position="top-right" />
      <div className="form-container">
        <h2>Tədbir Yarat</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values }) => (
            <Form>
              <div className="form-group">
                <label>Başlıq</label>
                <Field type="text" name="title" placeholder="Tədbirin adı" />
                <ErrorMessage name="title" component="div" className="error" />
              </div>

              <div className="form-group">
                <label>Tədbirin tarixi</label>
                <Field type="date" name="eventDate" />
                <ErrorMessage name="eventDate" component="div" className="error" />
              </div>

              <div className="form-group">
                <label>Başlama vaxtı</label>
                <Field type="time" name="startTime" />
                <ErrorMessage name="startTime" component="div" className="error" />
              </div>

              <div className="form-group">
                <label>Bitmə vaxtı</label>
                <Field type="time" name="endTime" />
                <ErrorMessage name="endTime" component="div" className="error" />
              </div>

              <div className="form-group">
                <label>Status</label>
                <Field as="select" name="status">
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="finished">Finished</option>
                </Field>
                <ErrorMessage name="status" component="div" className="error" />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Yaradılır..." : "Tədbiri Yarat"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EventCreate;
