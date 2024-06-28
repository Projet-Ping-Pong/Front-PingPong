import { useEffect, useState } from 'react';
import '../Style/App.css';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from './Toast';

function Accueil(props) {

  const [infoToast, setInfoToast] = useState('')
  const [statutToast, setStatutToast] = useState('')

  useEffect(() => {
    if (localStorage.getItem("Toast") === "success") {
      localStorage.setItem("Toast", "")
      setInfoToast("Vous êtes bien connecté(e)")
      setStatutToast('success')
      new Toast(document.querySelector('.toast')).show()
    }
  })

  useEffect(() => {
    if (localStorage.getItem("Toast") === "erreurDroit") {
        localStorage.setItem("Toast", "")
        setInfoToast("Vous n'avez pas les droits nécessaires pour acceder à cette page")
        setStatutToast('error')
        new Toast(document.querySelector('.toast')).show()
    }
})

  return (<>
    <ToastAff infoToast={infoToast} statutToast={statutToast}></ToastAff>
    <div className='flex-grow-1 d-flex'>
      <div className="text-body d-flex justify-content-evenly align-items-center anim w-100" style={{ width: "100vw" }}>
        {props.service === "Atelier" && <h1>Bienvenue {localStorage.getItem("Nom_uti")}, sur l’espace Atelier</h1>}
        {props.service === "Commerce" && <h1>Bienvenue {localStorage.getItem("Nom_uti")}, sur l’espace Commerce</h1>}
        {props.service === "Admin" && <h1>Bienvenue {localStorage.getItem("Nom_uti")}, sur l’espace Admin</h1>}
      </div>
    </div>
    </>
  );
}

export default Accueil;
