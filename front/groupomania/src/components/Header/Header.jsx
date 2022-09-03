import "./Header.css"
import {Link} from "react-router-dom"

function Header() {
  return (
    <div className="header">
        <Link to={'/home/'} className="header__logo"></Link>
    </div>
  )
}

export default Header