import { useEffect, useState } from 'react';
import '../../Style/App.css';
import Tooltip from 'bootstrap/js/dist/tooltip';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';
import Recherche from '../Vrac/Recherche';
import Liste from '../Vrac/liste';

function PieceList(props) {

  const [rechercheResult, setRechercheResult] = useState([{}])
  const [rechercheInput, setRechercheInput] = useState("")

  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))

  const [infoToast, setInfoToast] = useState('')
  const [statutToast, setStatutToast] = useState('')

  useEffect(() => {
    getAll();
  }, [])

  useEffect(() => {
    if (rechercheInput !== "" || rechercheInput !== null) {
      fetch(`${process.env.REACT_APP_URL}/piece/rechLibelle`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
          body: JSON.stringify({
            libelle: rechercheInput,
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.erreur != null) {
            // Erreur, phrase définie dans le back
            // setInfoToast(data.erreur)
            // new Toast(document.querySelector('.toast')).show()
          } else {
            setRechercheResult(data)
          }

        })
        .catch(error => {
          console.log(error)
          //   new Toast(document.querySelector('.toast')).show()
        });
    }
  }, [rechercheInput])

  function getAll() {
    fetch(`${process.env.REACT_APP_URL}/piece/getAll`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
      })
      .then(response => {
        if(response.status == 401){
          localStorage.setItem("Token", "")
          window.location.href = '/login'
        }else{
          response.json()
        }
      })
      .then(data => {
        if (data.erreur != null) {
          // Erreur, phrase définie dans le back
          // setInfoToast(data.erreur)
          // new Toast(document.querySelector('.toast')).show()
        } else {
          setRechercheResult(data)
        }

      })
      .catch(error => {
        console.log(error)
        //   new Toast(document.querySelector('.toast')).show()
      });
  }

  function deleteElem(id) {
    if (window.confirm("Voulez-vous supprimer la pièce avec l'id : " + id)) {
      fetch(`${process.env.REACT_APP_URL}/piece/delete/${id}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
        })
        .then(response => response.json())
        .then(() => { getAll(); })
        .catch(error => {
          console.log(error)
        });
    }
  }

  const recherche = (rechercheLib) => {
    fetch(`${process.env.REACT_APP_URL}/piece/rechLibelle`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
        body: JSON.stringify({
          libelle: rechercheLib,
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.erreur != null) {
          // Erreur, phrase définie dans le back
          setInfoToast(data.erreur)
          setStatutToast('error')
          new Toast(document.querySelector('.toast')).show()
        } else {
          setRechercheResult(data)
        }

      })
      .catch(error => {
        setInfoToast(error)
        setStatutToast('error')
        new Toast(document.querySelector('.toast')).show()
      });
  }

  return (<>
    <ToastAff infoToast={infoToast} statutToast={statutToast}></ToastAff>
    <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Liste des pièces</h1></div>
    <Recherche recherche={(rechercheLib) => recherche(rechercheLib)} prov="piece"></Recherche>
    <Liste rechercheResult={rechercheResult} deleteElem={(id) => deleteElem(id)} prov="piece"></Liste>
  </>
  );
}

export default PieceList;
