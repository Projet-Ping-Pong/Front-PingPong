import '../../Style/App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { debounce } from 'lodash';

function Recherche(props) {

  return (<>
    <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
      <div className="d-flex align-items-center my-1 justify-content-between mb-3" style={{ width: "85%", height: '5%' }}>
        <div className="input-group w-50 anim">
          <input type="text" className="form-control w-25" placeholder={'Rechercher'} onChange={debounce((event) => {props.recherche(event.target.value)}, 500)}></input>
          <span className="input-group-text" id="basic-addon1"><button className="btn" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
            data-bs-title="Rechercher"><FontAwesomeIcon icon="fa-solid fa-magnifying-glass" /></button></span>
        </div>
        <div className="mx-3 w-25 d-flex justify-content-end anim">
          {props.prov==="piece"?<button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => {window.location.href = '/piecesCRUD'; sessionStorage.setItem("Provenance", "add")}}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Ajout</button>:""}
          {props.prov==="machine" && props.droit !== "Atelier"?<button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => {window.location.href = '/machinesCRUD'; sessionStorage.setItem("Provenance", "add")}}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Ajout</button>:""}
          {props.prov==="poste" && props.droit !== "Atelier"?<button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => {window.location.href = '/postesCRUD'; sessionStorage.setItem("Provenance", "add")}}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Ajout</button>:""}
          {props.prov==="operation" && props.droit !== "Atelier"?<button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => {window.location.href = '/operationsCRUD'; sessionStorage.setItem("Provenance", "add")}}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Ajout</button>:""}
          {props.prov==="gamme" && props.droit !== "Atelier"?<button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => {window.location.href = '/gammesCRUD'; sessionStorage.setItem("Provenance", "add")}}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Ajout</button>:""}
        </div>
      </div>
    </div>
  </>
  );
}

export default Recherche;
