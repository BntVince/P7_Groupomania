import './Header.css'
import { Link } from 'react-router-dom'
import profile from '../../assets/profile.png'
import logo from '../../assets/logo-blanc-sans-texte.png'

function Header() {
   return (
      <div className="header">
         <Link to={'/home/'} className="header__logo header__left">
            <img src={logo} alt="Groupomania" />
         </Link>

         <div className="header__right">
            <p>UserName</p>
            <img src={profile} alt="" className="image-profile" />
         </div>
      </div>
   )
}

export default Header
