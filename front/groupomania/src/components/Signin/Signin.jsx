function Signin() {
   return (
      <div className="login__container">
         <h1>Connexion</h1>
         <label htmlFor="email">Adresse e-mail</label>
         <input type="email" name="email" id="email" />
         <label htmlFor="password">Mot de passe</label>
         <input type="password" name="password" id="password" />
         <button className="btn login__btn">Connexion</button>
      </div>
   )
}

export default Signin
