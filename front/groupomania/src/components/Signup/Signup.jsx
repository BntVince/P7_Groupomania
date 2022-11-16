import { useState } from 'react'
import axios from '../../http-common'
import { useNavigate } from 'react-router-dom'

function Signup({ setHaveAccount }) {
   const [userName, setUserName] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const navigate = useNavigate()

   const handleSubmit = (e) => {
      e.preventDefault()

      const userData = {
         userName: userName,
         email: email,
         password: password,
      }

      if (userName === '' || email === '' || password === '') {
         alert("Veuillez remplir les champs du formulaire d'inscription")
      } else {
         axios
            .post('/auth/signup', userData)
            .then((res) => {
               const groupomaniaActiveUser = {
                  token: res.data.token,
               }

               sessionStorage.setItem(
                  'groupomaniaActiveUser',
                  JSON.stringify(groupomaniaActiveUser)
               )
               navigate('/home')
            })
            .catch((error) => {
               alert(error.response.data.message)
            })
      }
   }

   return (
      <form className="login__container" onSubmit={handleSubmit}>
         <h1>Inscription</h1>
         <label htmlFor="userName">Nom d'utilisateur</label>
         <input
            type="userName"
            name="userName"
            id="userName"
            onChange={(e) => setUserName(e.target.value)}
         />
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
            Inscription
         </button>
      </form>
   )
}

export default Signup
