import React from 'react'
import './ProfilHeader.css'
import modifyBtn from '../../assets/modify-btn.png'
import backBtn from '../../assets/back-btn.png'

function ProfilHeader({ profilUser, activeUser, editProfil, setEditProfil }) {
   return (
      <div className="profil-header flex">
         <div className="profil-header--left flex">
            <img
               src={profilUser.profilImg}
               alt="profil"
               className="image-profil"
            />
            <span>{profilUser.userName}</span>
         </div>
         {activeUser.id === profilUser.id &&
            (editProfil ? (
               <img
                  src={backBtn}
                  alt="retour au profil"
                  className="profil-header--right"
                  onClick={() => setEditProfil(false)}
               />
            ) : (
               <img
                  src={modifyBtn}
                  alt="éditer"
                  className="profil-header--right"
                  onClick={() => setEditProfil(true)}
               />
            ))}
      </div>
   )
}

export default ProfilHeader
