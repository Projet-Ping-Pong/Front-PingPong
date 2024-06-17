import { useEffect, useState } from 'react';
import '../../Style/App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from 'bootstrap/js/dist/tooltip';

function Recherche(props) {

    console.log(props.prov)
  const [rechercheResult, setRechercheResult] = useState([{}])
  const [rechercheInput, setRechercheInput] = useState("")

  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))


  useEffect(() => {
    if(rechercheInput !== "" || rechercheInput !== null){
        switch (props.prov) {
            case 'piece':
                fetch(`${process.env.REACT_APP_URL}/piece/rechLibelle`,
                    {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
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
            case 'machine':

          }
    }
  }, [rechercheInput])

  return (<>
    <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
      <div className="d-flex align-items-center my-1 justify-content-between mb-3" style={{ width: "85%", height: '5%' }}>
        <div className="input-group w-50 anim">
          <input type="text" className="form-control w-25" placeholder={'Rechercher'} value={rechercheInput} onChange={(event) => {setRechercheInput(event.target.value)}}></input>
          <span className="input-group-text" id="basic-addon1"><button className="btn" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
            data-bs-title="Rechercher"><FontAwesomeIcon icon="fa-solid fa-magnifying-glass" /></button></span>
        </div>
        <div className="mx-3 w-25 d-flex justify-content-end anim">
          {props.prov==="piece"?<button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => {window.location.href = '/piecesAjout';}}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Ajout</button>:""}
        </div>
      </div>
    </div>
  </>
  );
}

export default Recherche;
