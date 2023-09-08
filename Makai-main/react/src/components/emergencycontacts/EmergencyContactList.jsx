import React, { useCallback, useEffect, useState } from "react";
import EmergencyContactCard from "./EmergencyContactCard";
import emergencyContactService from "services/emergencyContactService";
import debug from "sabio-debug";
import swal from "sweetalert";
import { useNavigate, useParams } from "react-router-dom";
import { FiPlusSquare } from "react-icons/fi";

const _logger = debug.extend("ContactList");

function EmergencyContactList() {
  const [pageData, setPageData] = useState({
    arrayOfContacts: [],
    contactComponents: [],
  });

  const { id } = useParams();

  // #region GET service functions
  useEffect(() => {
    emergencyContactService
      .getByUserId(id)
      .then(onGetContactsSuccess)
      .catch(onGetContactsError);
  }, []);

  const onGetContactsSuccess = (response) => {
    _logger(response.items, "onGetContactsSuccess");
    let listOfContacts = response.items;

    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.arrayOfContacts = listOfContacts;
      pd.contactComponents = listOfContacts.map(mappedContacts);
      return pd;
    });
  };

  const onGetContactsError = (error) => {
    _logger(error, "onGetContactsError");
  };

  // #endregion

  // #region DELETE service functions

  const onDeleteRequested = useCallback((myContact, eObj) => {
    _logger(myContact.id, { myContact, eObj });

    const handler = getDeleteSuccessHandler(myContact.id);

    swal({
      title: "Remove Contact?",
      text: "You won't be able to revert this!",
      icon: "warning",
      dangerMode: true,
      buttons: [true, "Delete"],
    }).then((deleteContact) => {
      if (deleteContact) {
        emergencyContactService
          .deleteById(myContact.id)
          .then(handler)
          .catch(onDeleteContactError);
        swal("Contact Removed", { icon: "success" });
      } else {
        swal("No changes made");
      }
    });
  }, []);

  const onDeleteContactError = (error) => {
    _logger(error, "onDeleteContactError");
  };

  const getDeleteSuccessHandler = (idToBeDeleted) => {
    return () => {
      setPageData((prevState) => {
        const pd = { ...prevState };
        pd.arrayOfContacts = [...pd.arrayOfContacts];

        const indexOf = pd.arrayOfContacts.findIndex((contact) => {
          let result = false;

          if (contact.id === idToBeDeleted) {
            result = true;
          }
          return result;
        });

        if (indexOf >= 0) {
          pd.arrayOfContacts.splice(indexOf, 1);
          pd.contactComponents = pd.arrayOfContacts.map(mappedContacts);
        }

        return pd;
      });
    };
  };
  // #endregion

  const navigate = useNavigate();

  const onAddContact = () => {
    navigate(`/emergency/contact/new`);
  };

  const mappedContacts = (aContact) => {
    return (
      <EmergencyContactCard
        contact={aContact}
        key={aContact.id}
        onDeleteClicked={onDeleteRequested}
      />
    );
  };

  return (
    <React.Fragment>
      <div className="container">
        <h1 className="text-center mb-3">Emergency Contacts</h1>
        <div className="row-cols-sm-auto text-center m-2">
          <FiPlusSquare
            className="h1 text-primary"
            type="button"
            onClick={onAddContact}
          ></FiPlusSquare>
          <strong>Add New Contacts</strong>
        </div>
        <div className="row">{pageData.contactComponents}</div>
      </div>
    </React.Fragment>
  );
}

export default EmergencyContactList;
