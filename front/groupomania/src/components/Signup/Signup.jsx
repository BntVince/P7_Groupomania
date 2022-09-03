function Signup() {
   return (
      <div className="login__container">
         <h1>Inscription</h1>
         <label htmlFor="userName">Nom d'utilisateur</label>
         <input type="userName" name="userName" id="userName" />
         <label htmlFor="email">Adresse e-mail</label>
         <input type="email" name="email" id="email" />
         <label htmlFor="password">Mot de passe</label>
         <input type="password" name="password" id="password" />
         <button className="btn login__btn">Inscription</button>
      </div>
   )
}

export default Signup
