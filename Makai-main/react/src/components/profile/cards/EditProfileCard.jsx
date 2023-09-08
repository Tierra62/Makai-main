import React, { useEffect, useState } from "react";
import { Button, Card, Row } from "react-bootstrap";
import FalconCardHeader from "components/common/FalconCardHeader";
import userService from "services/userService";
import { Formik, Field, Form, ErrorMessage } from "formik";
import FileUploader from "components/FileUploader";
import toastr from "toastr";
import debug from "sabio-debug";
import { editProfileSchema } from "schemas/editProfileSchema";
const _logger = debug.extend("profile");
import PropTypes from "prop-types";
import Avatar from "components/common/Avatar";

const defaultForm = {
  firstName: "",
  lastName: "",
  mi: "",
  phone: "",
  dob: "",
};

const genericProfilePhoto =
  "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg";

const EditProfileCard = ({ user, handleProfileChange }) => {
  const [formData, setFormData] = useState(defaultForm);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    _logger("user", user);
    const dob =
      user.dob.indexOf("T") > 0
        ? user.dob.slice(0, user.dob.indexOf("T"))
        : user.dob;
    setFormData(() => {
      let pd = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        dob: dob,
        mi: user.mi || "",
        email: user.email,
      };
      return pd;
    });
    setAvatar(user.avatarUrl || "");
  }, [user]);

  const onUploadFilesSuccess = (data) => {
    _logger("upload response data", data);
    setAvatar(data.items[0].url);
  };

  const handleSubmit = (values) => {
    _logger("submit values", values);
    let payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      dob: values.dob,
      email: values.email,
    };
    if (values.mi && values.mi.length > 0) {
      payload.mi = values.mi;
    }
    if (avatar && avatar.length > 0) {
      payload.avatarUrl = avatar;
    }

    userService
      .onUpdateUser(values.id, payload)
      .then(onUpdateSuccess)
      .catch(onUpdateError);
  };

  const onUpdateSuccess = ({ payload }) => {
    toastr.success("Profile Update Successful!");
    _logger("success payload", payload);
    handleProfileChange(payload);
  };

  const onUpdateError = () => {
    toastr.error("Something went wrong with the update!");
  };

  const onRemoveAvatarClicked = () => {
    setAvatar("");
    toastr.error("file removed");
  };

  return (
    <Card>
      <FalconCardHeader title="Edit Profile" />
      <Card.Body className="bg-light">
        <Formik
          enableReinitialize={true}
          initialValues={formData}
          onSubmit={handleSubmit}
          validationSchema={editProfileSchema}
        >
          <Form>
            <Row className="g-3 mb-3">
              <div className="form-group col-5">
                <div className="form-label font-weight-bold">First Name*</div>
                <Field
                  className="form-control"
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="has-error"
                />
              </div>

              <div className="form-group col-2">
                <div className="form-label font-weight-bold">Mi</div>
                <Field
                  type="text"
                  className="form-control"
                  placeholder="Mi"
                  maxLength={2}
                  name="mi"
                />
                <ErrorMessage
                  name="mi"
                  component="div"
                  className="has-error text-c"
                />
              </div>

              <div className="form-group col-5">
                <div className="form-label font-weight-bold">Last Name*</div>
                <Field
                  type="text"
                  className="form-control"
                  placeholder="Last Name"
                  name="lastName"
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="has-error"
                />
              </div>
            </Row>
            <Row className="mb-3 g-3">
              <div className="form-group col-6">
                <div className="form-label font-weight-bold">Phone*</div>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">+1</div>
                  </div>
                  <Field
                    type="text"
                    className="form-control"
                    placeholder="Phone"
                    name="phone"
                  />
                </div>
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="has-error"
                />
              </div>

              <div className="form-group col-6">
                <div className="form-label font-weight-bold">Birthday*</div>
                <Field type="date" name="dob" className="form-control" />
                <ErrorMessage
                  name="dob"
                  component="div"
                  className="has-error"
                />
              </div>
            </Row>
            <Row className="mb-3 g-3">
              <div className="form-group profile-image-group">
                <div className="form-label font-weight-bold">Profile Image</div>
                <div className="d-flex">
                  {avatar && (
                    <div className="z-index-2">
                      <Button
                        variant="outline-danger"
                        className="profile-small-avatar-remove"
                        onClick={onRemoveAvatarClicked}
                      >
                        X
                      </Button>
                    </div>
                  )}
                  <div
                    className={
                      avatar
                        ? "profile-small-avatar z-index-1"
                        : "profile-small-avatar-generic z-index-1"
                    }
                  >
                    <Avatar
                      size="4xl"
                      src={avatar || genericProfilePhoto}
                      mediaClass="img-thumbnail shadow-sm"
                      rounded="false"
                    />
                  </div>
                </div>
                <FileUploader
                  className="w-50 mb-5"
                  onUploadSuccess={onUploadFilesSuccess}
                />
              </div>
            </Row>
            <div className="profil-card-subtitle form-label mb-0">
              *Required Fields
            </div>
            <div className="text-end">
              <Button variant="primary" type="submit" className="button-custom">
                Update
              </Button>
            </div>
          </Form>
        </Formik>
      </Card.Body>
    </Card>
  );
};
EditProfileCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    mi: PropTypes.string,
    phone: PropTypes.string.isRequired,
    dob: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    email: PropTypes.string.isRequired,
  }),
  handleProfileChange: PropTypes.func.isRequired,
};

export default EditProfileCard;
