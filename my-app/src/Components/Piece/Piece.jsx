import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../Style/App.css';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';
import { useEffect, useState } from 'react';

function PieceAjout(props) {

    const [disablePrixVente, setDisablePrixVente] = useState(true)
    const [disablePrixAchat, setDisablePrixAchat] = useState(true)

    const [provenance] = useState(sessionStorage.getItem("Provenance"))

    const [infoToast, setInfoToast] = useState("")
    const [statutToast, setStatutToast] = useState("")

    const [isDetails, setIsDetails] = useState(false)

    const [id, setId]                   = useState("")
    const [libelle, setLibelle]         = useState("")
    const [prixVente, setPrixVente]     = useState("")
    const [prixAchat, setPrixAchat]     = useState("")
    const [quantite, setQuantite]       = useState("")
    const [unite, setUnite]             = useState("")
    const [type, setType]               = useState("")
    const [idGamme, setIdGamme]         = useState()

    function add() {
        if (libelle === "" || libelle === null) {
            setInfoToast("Le libellé est vide")
            setStatutToast('error')
            new Toast(document.querySelector('.toast')).show()
        } else {
            fetch(`${process.env.REACT_APP_URL}/piece/add`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        libelle: libelle,
                        prix_vente: prixVente,
                        prix_catalogue: prixAchat,
                        stock: quantite,
                        unite: unite,
                        type: type,
                        id_gamme: idGamme,
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
                        // Success, Vous êtes bien connecté(e)
                        localStorage.setItem("Toast", "success")
                        window.location.href = '/pieces'
                    }
                })
                .catch(error => {
                    console.log(error);
                });

        }
    }

    return (<>
        <ToastAff infoToast={infoToast} statutToast={statutToast}></ToastAff>
        {provenance === "add" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Ajout des pièces</h1></div> : ""}
        {provenance === "update" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Modification des pièces</h1></div> : ""}
        {provenance === "details" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Détails des pièces</h1></div> : ""}

        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap bg-body-secondary list carte mb-3" style={{ width: "85%", height: '5%' }}>
                <div className="mx-3 d-flex align-items-center justify-content-between w-100 mb-3">
                    <input type="text" className="form-control w-25" placeholder={'Référence'}></input>
                    <input type="text" className="form-control w-25" placeholder={'Prix de vente'} value={prixVente} onChange={(event) => { setPrixVente(event.target.value) }} disabled={disablePrixVente}></input>
                    <input type="text" className="form-control w-25" placeholder={'Quantité'} value={quantite} onChange={(event) => { setQuantite(event.target.value) }}></input>
                </div>
                <div className="mx-3 d-flex align-items-center justify-content-between w-100">
                    <input type="text" className="form-control w-25" placeholder={'Libellé'} value={libelle} onChange={(event) => { setLibelle(event.target.value) }}></input>
                    <input type="text" className="form-control w-25" placeholder={'Prix catalogue'} value={prixAchat} onChange={(event) => { setPrixAchat(event.target.value) }} disabled={disablePrixAchat}></input>
                    <input type="text" className="form-control w-25" placeholder={'Unité'} value={unite} onChange={(event) => { setUnite(event.target.value) }}></input>
                </div>
            </div>
            <div className="d-flex flex-wrap bg-body-secondary list carte" style={{ width: "85%", height: '5%' }}>
                <div className="mx-3 d-flex align-items-center justify-content-between w-100">
                    <select class="form-select w-25" id='selectType' onChange={() => {
                        if (document.getElementById('selectType').value == "Type") {
                            setDisablePrixAchat(true); setDisablePrixVente(true)
                        }
                        if (document.getElementById('selectType').value == 1) {
                            setDisablePrixAchat(true); setDisablePrixVente(false)
                        }
                        if (document.getElementById('selectType').value == 2) {
                            setDisablePrixAchat(true); setDisablePrixVente(true)
                        }
                        if (document.getElementById('selectType').value == 3) {
                            setDisablePrixAchat(true); setDisablePrixVente(true)
                        }
                        if (document.getElementById('selectType').value == 4) {
                            setDisablePrixAchat(false); setDisablePrixVente(true)
                        }
                    }}>
                        <option selected>Type</option>
                        <option value="1">Livrable</option>
                        <option value="2">Intermédiaire</option>
                        <option value="3">Matière Première</option>
                        <option value="4">Achetée</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap" style={{ width: "85%" }}>
                <div className="bg-body-secondary d-flex justify-content-between list carte w-25">
                    <div className="d-flex align-items-center justify-content-center w-75">Gérer la gamme </div>
                    <button class="btn w-25" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                        <FontAwesomeIcon icon="fa-solid fa-chevron-down" />
                    </button>
                </div>
            </div>
        </div>
        <div class="collapse" id="collapseExample">
            <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%" }}>
                <div className="d-flex flex-wrap bg-body-secondary list carte mb-3" style={{ width: "85%", height: '5%' }}>
                    <div className="mx-3 d-flex align-items-center justify-content-between w-100 mb-3">
                        <input type="text" className="form-control w-100" placeholder={'Libellé'}></input>
                    </div>
                    <div className="mx-3 d-flex align-items-center justify-content-between w-100">
                        <textarea type="text" className="form-control w-100" placeholder={'Description'}></textarea>
                    </div>
                </div>
            </div>
        </div>
        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap" style={{ width: "85%" }}>
                <div className="bg-body-secondary d-flex justify-content-between list carte mb-3 w-25">
                    <div className="d-flex align-items-center justify-content-center w-75">Gérer la composition </div>
                    <button className="btn w-25" type="button"><FontAwesomeIcon icon="fa-solid fa-chevron-down" /></button>
                </div>
            </div>
        </div>

        <div className='flex-grow-1'>
            <div className="w-100 d-flex justify-content-center mt-5 anim">
                {provenance === "add" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { add() }}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Ajouter une pièce</button> : ""}
                {/* {provenance === "update" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { update(id) }}><FontAwesomeIcon icon="fa-solid fa-pen-to-square" style={{ color: "#ffffff", }} />&nbsp;&nbsp; Modifier une pièce</button> : ""} */}
                {/* {provenance === "details" ? "" : ""} */}
            </div>
        </div>
    </>
    );
}

export default PieceAjout;
