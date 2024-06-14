import '../Style/App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../Assets/logo.jpg';
import { useState } from 'react';
import Toast from 'bootstrap/js/dist/toast';

function Login() {

  const [nom_utiInput, setNom_utiInput] = useState('')
  const [mdpInput, setMdpInput] = useState('')
  const [infoToast, setInfoToast] = useState('')

  const logIn = () => {
    if (nom_utiInput !== "" && mdpInput !== "") {
      fetch(`${process.env.REACT_APP_URL}/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom_uti: nom_utiInput,
            mdp: mdpInput
          })
        })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if (data.erreur != null) {
            // Erreur, phrase définie dans le back
            setInfoToast(data.erreur)
            new Toast(document.querySelector('.toast')).show()
          } else {
            localStorage.setItem("Token", data.token)
            localStorage.setItem("Nom_uti", nom_utiInput)
            window.location.href = '/accueil';
            // Success, Vous êtes bien connecté(e)
            setInfoToast("Vous êtes bien connecté(e)")
            new Toast(document.querySelector('.toast')).show()
          }

        })
        .catch(error => {
          console.log(error)
          new Toast(document.querySelector('.toast')).show()
        });
    } else {
      // Erreur, Veuillez renseigner le nom d'utilisateur et le mot de passe
      setInfoToast("Veuillez renseigner le nom d'utilisateur et le mot de passe")
      new Toast(document.querySelector('.toast')).show()
    }

  }

  return (<>
    <div className="toast-container position-fixed top-0 end-0 p-3">
      <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="alert alert-danger m-0" role="alert">
          <div className="w-100 d-flex justify-content-end"><button type="button" className="btn-close top-0 end-0" data-bs-dismiss="toast" aria-label="Close"></button></div>
          <p>{infoToast}</p>
        </div>
      </div>
    </div>

    <form className="text-body d-flex justify-content-evenly align-items-center" style={{ width: "100%", height: "100%" }}>
      <div className="w-25">
        <div className='d-flex justify-content-center pt-4'><img className="img-rectangle rounded-circle aff-up-img" style={{ minWidth: "300px", minHeight: "300px" }} src={logo} alt="Logo"></img></div>
      </div>
      <div className="post2 w-25 carte">
        <h2 className="center border-bottom border-2 pb-4">Connexion</h2>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1"><FontAwesomeIcon icon="fa-solid fa-user" /></span>
          <input type="text" className="form-control" placeholder={'Nom Utilisateur'} value={nom_utiInput} onChange={(event) => setNom_utiInput(event.target.value)}></input>
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1"><FontAwesomeIcon icon="fa-solid fa-key" /></span>
          <input type="password" className="form-control" placeholder={'Mot De Passe'} value={mdpInput} onChange={(event) => setMdpInput(event.target.value)}></input>
        </div>
        <div className="d-flex justify-content-center">
          <button className="btn center border border-2 button" type="button" onClick={logIn}>Se connecter &nbsp;&nbsp;<FontAwesomeIcon icon="fa-solid fa-right-to-bracket" /></button>
        </div>
      </div>
    </form>
  </>
  );
}

export default Login;
