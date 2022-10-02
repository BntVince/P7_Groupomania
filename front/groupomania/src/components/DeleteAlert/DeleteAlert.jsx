import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import cancelNewPost from '../../assets/cancel-new-post.png'
import './DeleteAlert.css'

function DeleteAlert({ setDeleteAlert, profilUser }) {
   const [password, setPassword] = useState('')
   const navigate = useNavigate()

   const handleDelete = (e) => {
      e.preventDefault()
      if (password === '') {
         alert('Veuillez saisir votre mot de passe!')
      } else {
         const userPassword = { currentPassword: password }
         axios
            .post(`/auth/${profilUser.id}/delete`, userPassword)
            .then((res) => {
               if ((res.status = 201)) {
                  navigate('/')
               }
            })
            .catch(() => {
               alert('Le mot de passe de correspond pas')
            })
      }
   }

   return (
      <div className="alert flex">
         <div className="alert-container">
            <div className="alert-header flex">
               <img
                  className="alert-header--btn"
                  src={cancelNewPost}
                  alt=""
                  onClick={() => setDeleteAlert(false)}
               />
            </div>
            <form className="alert-body flex-cl" onSubmit={handleDelete}>
               <span>
                  Attention, vous vous apprétez à supprimer votre compte ! Cette
                  action sera définitive et supprimera également tout vos posts
                  associés!
               </span>

               <input
                  type="password"
                  name="password"
                  id="password"
                  className="form-profil-username"
                  placeholder="Mot de passe"
                  onChange={(e) => setPassword(e.target.value)}
               />
               <span>
                  Pour confirmer la suppression veuillez saisir votre mot de
                  passe!
               </span>
               <button className="btn delete-btn" type="submit">
                  Supprimer le compte
               </button>
            </form>
         </div>
      </div>
   )
}

export default DeleteAlert
