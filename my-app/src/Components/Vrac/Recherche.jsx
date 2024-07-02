import '../../Style/App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { debounce } from 'lodash';

function Recherche(props) {

  function buttonChange(){
    if(props.prov==="piece"){
      window.location.href = '/piecesCRUD'
    }
    if(props.prov==="machine"){
      window.location.href = '/machinesCRUD'
    }
    if(props.prov==="poste"){
      window.location.href = '/postesCRUD'
    }
    if(props.prov==="operation"){
      window.location.href = '/operationsCRUD'
    }
    if(props.prov==="gamme"){
      window.location.href = '/gammesCRUD'
    }
    if(props.prov==="devis"){
      window.location.href = '/devisCRUD'
    }
    if(props.prov==="droit"){
      window.location.href = '/droitsCRUD'
    }
    if(props.prov==="utilisateur"){
      window.location.href = '/utilisateursCRUD'
    }
    sessionStorage.setItem("Provenance", "add")
    if(props.prov==="client" || props.prov==="fournisseur"){
      window.location.href = '/clientsfournisseursCRUD'
      if(props.prov==="client"){
        sessionStorage.setItem("Provenance", "addClient")
      }else{
        sessionStorage.setItem("Provenance", "addFournisseur")
      }
    }
    
  }

  return (<>
    <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
      <div className="d-flex align-items-center my-1 justify-content-between mb-3" style={{ width: "85%", height: '5%' }}>
        <div className="input-group w-50 anim">
          <input type="text" className="form-control w-25" placeholder={'Rechercher'} onChange={debounce((event) => {props.recherche(event.target.value)}, 500)}></input>
          <span className="input-group-text" id="basic-addon1"><button className="btn" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
            data-bs-title="Rechercher"><FontAwesomeIcon icon="fa-solid fa-magnifying-glass" /></button></span>
        </div>
        <div className="mx-3 w-25 d-flex justify-content-end anim">
          {props.droit !== "Atelier" && props.prov!=="realisation" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => {buttonChange()}}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Ajout</button>:""}
        </div>
      </div>
    </div>
  </>
  );
}

export default Recherche;
