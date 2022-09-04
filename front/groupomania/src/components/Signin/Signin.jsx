import http from '../../http-common'
import { useState } from 'react'

function Signin() {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')

   const handleSubmit = (e) => {
      e.preventDefault()

      const userData = {
         email: email,
         password: password,
      }

      if (email === '' || password === '') {
         alert("Veuillez remplir les champs du formulaire d'inscription")
      } else {
         console.log(userData)

         http.post('/auth/login', userData)
      }
   }

   return (
      <form className="login__container" onSubmit={handleSubmit}>
         <h1>Connexion</h1>
         <label htmlFor="email">Adresse e-mail</label>
         <input
            type="email"
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
         />
         <label htmlFor="password">Mot de passe</label>
         <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
         />
         <button type="submit" className="btn login__btn">
            Connexion
         </button>
      </form>
   )
}

export default Signin
