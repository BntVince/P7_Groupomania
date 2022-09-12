import './Header.css'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo-blanc-sans-texte.png'
import { useState } from 'react'
import newPostBtn from '../../assets/new-post-btn.png'

function Header({ newPost, setNewPost, activeUser }) {
   const [header, setHeader] = useState(false)
   const [oldScroll, setOldScroll] = useState(0)

   const hideHeader = () => {
      if (oldScroll < window.pageYOffset && window.pageYOffset > 48) {
         setHeader(true)
      } else {
         setHeader(false)
      }
      setOldScroll(window.pageYOffset)
   }

   window.addEventListener('scroll', hideHeader)

   const logOut = () => {
      sessionStorage.removeItem('groupomaniaActiveUser')
      window.location.href = '/'
   }

   return (
      <div id="header" className={header ? 'header header-hide' : 'header'}>
         <Link to={'/home/'} className="header__logo header__left">
            <img src={logo} alt="Groupomania" />
         </Link>
         <button
            className="header__mid set-new-post-btn"
            onClick={() => {
               setNewPost(true)
            }}
         >
            <img src={newPostBtn} alt="" />
         </button>
         <div className="header__right">
            <p className="username">{activeUser.userName}</p>
            <img src={activeUser.profilImg} alt="" className="image-profile" />
            <div className="edit">
               <ul className="edit-menu">
                  <li className="edit-menu__choice">Editer</li>
                  <li className="edit-menu__choice" onClick={logOut}>
                     Déconexion
                  </li>
               </ul>
            </div>
         </div>
      </div>
   )
}

export default Header
