import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { base_url } from '../api';
import EditResearcher from '../pages/edit_researchers_form';

function ModifyDeleteForm({token}) {
    const navigate = useNavigate();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deletedMessage, setDeletedMessage] = useState(false);
    
    const handleClose = () => {
        localStorage.removeItem("token");
        window.location.reload();
    }

    const handleDeleteFirstClick = () => {
      if (confirmDelete){
        handleDelete();
      } else {
        setConfirmDelete(true)
      }
    }

    const handleDelete = async () => {
      try {
        const response = await axios.post(`${base_url}research-info-surveys/delete_submission/`,{
          token:token,
        });
        if(response.status >= 200 && response.status < 300){
          setDeletedMessage(true);

          // Hide message after 3 seconds and go to another page
          setTimeout(() => {
            setDeletedMessage(false);
            //Removing the token and reloading the page will return to the initial state
            localStorage.removeItem("token");
            window.location.reload();
          }, 3000);
        } else {
          console.error('Request was not successful. Status:', response.status);
        }

      } catch (error) {
        console.error('Error in data deletion: ',error)
      }
    }

    const handleEdit = async () => {
      try {
        const response = await axios.post(`${base_url}research-info-surveys/find-by-user/`,{
          token:token,
      });
      if(response.status >= 200 && response.status < 300){
        navigate('/editresearcherdata', {state: response.data})
        console.log(response)
      } else {
        console.error('Request was not successful. Status:', response.status);
      }
    } catch (error) {
      console.error('Error while updating data: ',error)
    }
  }


  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal.Dialog>
        <Modal.Header closeButton onClick={handleClose}>
          <Modal.Title> You have already filled out the form</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>You have already filled out the form, you can choose to edit your information or delete it permanently.</p>
          {deletedMessage && <Alert variant="success">Data deleted successfully! You will now be redirected to the home page</Alert>}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteFirstClick}>
            {confirmDelete ? 'All your data will be deleted, click again to confirm' : 'Delete all my data'}
          </Button>
          <Button variant="primary" onClick={handleEdit}>Edit my data</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
}

export default ModifyDeleteForm;