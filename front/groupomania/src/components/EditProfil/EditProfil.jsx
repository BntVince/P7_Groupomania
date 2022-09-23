import React from 'react'
import { useState, useEffect } from 'react'
import './EditProfil.css'
import cancelNewPost from '../../assets/cancel-new-post.png'

function EditProfil({ profilUser }) {
   const [softEditProfil, setSoftEditProfil] = useState(true)
   const [file, setFile] = useState(null)
   const [preview, setPreview] = useState(profilUser.profilImg)

   function cancelImg() {
      setFile(null)
      setPreview(profilUser.profilImg)
   }

   useEffect(() => {
      if (!file) {
         setPreview(profilUser.profilImg)
         return
      }
      const fileURL = URL.createObjectURL(file)
      setPreview(fileURL)
   }, [file])

   return (
      <div className="flex-cl form-container">
         {softEditProfil ? (
            <form className="form-profil flex-cl">
               <div className="form-profil-img flex">
                  <input
                     type="file"
                     name="file"
                     id="file"
                     accept="image/png, image/jpeg"
                     className="new-post-img-input"
                     onChange={(e) => {
                        setFile(e.target.files[0])
                        console.log(e.target.files[0])
                     }}
                  />
                  <img
                     src={preview}
                     alt=""
                     className="form-profil-img-preview"
                  />

                  <label htmlFor="file" className="form-profil-img-label btn">
                     Changer la photo
                  </label>
                  {preview !== profilUser.profilImg && (
                     <img
                        src={cancelNewPost}
                        alt=""
                        className="form-profil-img--cancel-img"
                        onClick={cancelImg}
                     />
                  )}
               </div>
               <input
                  type="text"
                  name="userName"
                  id="userName"
                  className="form-profil-username"
                  placeholder="Nom d'utilisateur"
               />
               <button type="submit" className="form-profil-submit btn">
                  Enregistrer les informations
               </button>
            </form>
         ) : (
            <form className="form-profil flex-cl">
               <button type="submit" className="form-profil-submit btn">
                  Enregistrer les informations
               </button>
            </form>
         )}

         <div className="form-container-footer">
            {softEditProfil ? (
               <button
                  className="btn switch-form"
                  onClick={() => setSoftEditProfil(false)}
               >
                  Modifier les identifants de connexion
               </button>
            ) : (
               <button
                  className="btn switch-form"
                  onClick={() => setSoftEditProfil(true)}
               >
                  Modifier le profil
               </button>
            )}
            <button className="btn delete-btn">Supprimer le compte</button>
         </div>
      </div>
   )
}

export default EditProfil
