import React from 'react'
import { useState } from 'react'

import Signin from '../../components/Signin/Signin'
import Signup from '../../components/Signup/Signup'
import './Login.css'
import logo from '../../assets/icon-left-sans-fond.png'
import Footer from '../../components/Footer/Footer'

function Login() {
   const [haveAccount, setHaveAccount] = useState(true)

   return (
      <div>
         <div className="main">
            <img src={logo} alt="Groupomania" />
            <div className="login">
               {haveAccount ? (
                  <Signin />
               ) : (
                  <Signup setHaveAccount={setHaveAccount} />
               )}

               {haveAccount ? (
                  <div className="have-account">
                     <span>Pas encore de compte ?</span>
                     <button
                        className="btn"
                        onClick={() => setHaveAccount(false)}
                     >
                        Inscription
                     </button>
                  </div>
               ) : (
                  <div className="have-account">
                     <span>Déjà un compte ?</span>
                     <button
                        className="btn"
                        onClick={() => setHaveAccount(true)}
                     >
                        Connexion
                     </button>
                  </div>
               )}
            </div>
         </div>
         <Footer />
      </div>
   )
}

export default Login
