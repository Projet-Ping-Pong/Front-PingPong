import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../Style/App.css';
import { useEffect, useState } from 'react';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';
import { debounce } from 'lodash';

function Gamme(props) {

    const [provenance, setProvenance] = useState(sessionStorage.getItem("Provenance"))
    const [libelle, setLibelle] = useState("")
    const [ref, setRef] = useState()
    const [resp, setResp] = useState("")
    const [description, setDescription] = useState("")
    const [infoToast, setInfoToast] = useState('')
    const [statutToast, setStatutToast] = useState('')
    const [id, setId] = useState('')
    const [isDetails, setIsDetails] = useState(false)

    const [rechercheResultOperation, setRechercheResultOperation] = useState([])
    const [rechercheResultOperationAff, setRechercheResultOperationAff] = useState([])

    const [rechercheResultPiece, setRechercheResultPiece] = useState([])
    const [rechercheResultPieceAff, setRechercheResultPieceAff] = useState([])

    useEffect(() => {
        const search = window.location.search; // returns the URL query String
        const params = new URLSearchParams(search);
        const IdFromURL = params.get('id');
        setId(IdFromURL)

        if (provenance === "update" || provenance === "details") {
            fetch(`${process.env.REACT_APP_URL}/gamme/getId`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        id: IdFromURL,
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
                        setLibelle(data.libelle)
                        setDescription(data.description)
                        setResp(data.responsable)
                        fetch(`${process.env.REACT_APP_URL}/gammeoperation/getOpByIdGamme`,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                                body: JSON.stringify({
                                    id_gamme: IdFromURL,
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
                                    setRechercheResultOperationAff(data)
                                }
                            })
                            .catch(error => {
                                console.log(error)
                            });
                        if(data.id_piece != undefined && data.id_piece != null){
                            fetch(`${process.env.REACT_APP_URL}/piece/getId`,
                                {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                                    body: JSON.stringify({
                                        id: data.id_piece,
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
                                        setRef(data.libelle)
                                        addListePiece(data.id, data.libelle)
                                    }
                                })
                                .catch(error => {
                                    console.log(error)
                                });
                        }
                        
                    }
                })
                .catch(error => {
                    console.log(error)
                });
        }
        if (provenance === "details") {
            setIsDetails(true)
        }
    }, [])

    function add() {
        if (libelle === "" || libelle === null) {
            setInfoToast("Le libellé est vide")
            setStatutToast('error')
            new Toast(document.querySelector('.toast')).show()
        } else {
            fetch(`${process.env.REACT_APP_URL}/gamme/add`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        libelle: libelle,
                        description: description,
                        responsable: resp,
                        id_piece: rechercheResultPieceAff.id,
                        operationList: rechercheResultOperationAff
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
                        localStorage.setItem("Toast", "success")
                        window.location.href = '/gammes'
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    function update(id) {
        console.log(rechercheResultOperation);
        fetch(`${process.env.REACT_APP_URL}/gamme/update/${id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                body: JSON.stringify({
                    libelle: libelle,
                    description: description,
                    id_piece: rechercheResultPieceAff.length>0?rechercheResultPieceAff[0].id:null,
                    responsable: resp,
                    operationList: rechercheResultOperationAff
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
                    localStorage.setItem("Toast", "successUpdate")
                    window.location.href = '/gammes'
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    const rechercheOperation = (rechercheLib) => {
        if (rechercheLib !== "") {
            fetch(`${process.env.REACT_APP_URL}/operation/rechLibelle`,
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
                        setRechercheResultOperation(data)
                    }

                })
                .catch(error => {
                    setInfoToast(error)
                    setStatutToast('error')
                    new Toast(document.querySelector('.toast')).show()
                });
        } else {
            setRechercheResultOperation([])
        }
    }

    function addListeOperation(id, libelle) {

        const tab = [...rechercheResultOperationAff, {
            id: id,
            libelle: libelle
        }]
        setRechercheResultOperationAff(tab)
        setRechercheResultOperation([])
        document.getElementById("rechercheOperation").value = ""

    }

    function deleteListOperation(id) {
        const tab = [...rechercheResultOperationAff]
        tab.splice(id, 1)
        setRechercheResultOperationAff(tab)
    }

    const recherchePiece = (rechercheLib) => {
        if (rechercheLib !== "") {
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
                        setRechercheResultPiece(data)
                    }

                })
                .catch(error => {
                    setInfoToast(error)
                    setStatutToast('error')
                    new Toast(document.querySelector('.toast')).show()
                });
        } else {
            setRechercheResultPiece([])
        }
    }

    function addListePiece(id, libelle) {
        const tab = [{
            id: id,
            libelle: libelle
        }]
        document.getElementById("recherchePiece").value = libelle
        setRechercheResultPieceAff(tab)
        setRechercheResultPiece("")
    }

    function deleteListOperation(id, id_gamme, id_operation) {
        if (window.confirm("Voulez-vous supprimer la liaison de l'opération avec l'id : " + id_operation + "?\nAttention cette action est irreversible")) {
            fetch(`${process.env.REACT_APP_URL}/gammeoperation/delete`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        id_gamme: id_gamme,
                        id_operation: id_operation,
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
                        const tab = [...rechercheResultOperationAff]
                        tab.splice(id, 1)
                        setRechercheResultOperationAff(tab)
                        setInfoToast("Liaison supprimée avec succès")
                        setStatutToast('success')
                        new Toast(document.querySelector('.toast')).show()
                    }
                })
                .catch(error => {
                    console.log(error)
                });
        }
    }

    return (<>
        <ToastAff infoToast={infoToast} statutToast={statutToast}></ToastAff>
        {provenance === "add" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Ajout des gammes</h1></div> : ""}
        {provenance === "update" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Modification des gammes</h1></div> : ""}
        {provenance === "details" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Détails des gammes</h1></div> : ""}

        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap bg-body-secondary justify-content-between list carte" style={{ width: "85%", height: '5%' }}>
                <form className="mx-3 d-flex-wrap align-items-center justify-content-between form-floating" style={{ width: "20%" }}>
                    <input type="text" className="form-control w-100" id="recherchePiece" placeholder={'Pièce'} onChange={debounce((event) => { recherchePiece(event.target.value) }, 500)} disabled={isDetails}></input>
                    <label for="recherchePiece">Pièce</label>
                    <div className="d-flex flex-column align-items-center w-100">
                        <div className="d-flex align-items-center justify-content-between" style={{ width: "100%" }}>
                            {rechercheResultPiece.length > 0 && <div className="input-group anim border border-2">
                                {rechercheResultPiece.map((elem) => {
                                    return (<>
                                        <div onClick={() => { addListePiece(elem.id, elem.libelle) }} className="d-flex align-items-center my-1 mx-2 rechercheListe w-100">
                                            <div className='mx-2'><b>{elem.id}</b> - {elem.libelle}</div>
                                        </div></>)
                                })}
                            </div>}
                        </div>
                    </div>
                </form>
                <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "50%" }}>
                    <input type="text" className="form-control w-100" id="floatingInputLibelle" placeholder={'Libellé'} value={libelle} onChange={(event) => { setLibelle(event.target.value) }} disabled={isDetails}></input>
                    <label for="floatingInputLibelle">Libellé</label>
                </form>
                <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "20%" }}>
                    <input type="text" className="form-control w-100" id="floatingInputLibelle" placeholder={'Responsable'} value={resp} onChange={(event) => { setResp(event.target.value) }} disabled={isDetails}></input>
                    <label for="floatingInputLibelle">Responsable</label>
                </form>
            </div>
        </div>
        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap bg-body-secondary list carte" style={{ width: "85%", height: '5%' }}>
                <form className="mx-3 d-flex align-items-center justify-content-between w-100 form-floating">
                    <textarea type="textarea" rows="5" id="floatingInputDescription" className="form-control w-100" placeholder={'Description'} value={description} onChange={(event) => { setDescription(event.target.value) }} disabled={isDetails}></textarea>
                    <label for="floatingInputDescription">Description</label>
                </form>
            </div>
        </div>
        <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Opérations</h1></div>
        {provenance !== "details" ? <>
            <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
                <div className="d-flex align-items-center justify-content-between" style={{ width: "85%", height: '5%' }}>
                    <div className="input-group w-50 anim">
                        <input type="text" className="form-control w-25" id="rechercheOperation" placeholder={'Rechercher'} onChange={debounce((event) => { rechercheOperation(event.target.value) }, 500)}></input>
                        <span className="input-group-text" id="basic-addon1"><button className="btn" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                            data-bs-title="Rechercher"><FontAwesomeIcon icon="fa-solid fa-plus" /></button></span>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-center w-100">
                <div className="d-flex align-items-center justify-content-between" style={{ width: "85%" }}>
                    {rechercheResultOperation.length > 0 && <div className="input-group w-50 anim border border-2">
                        {rechercheResultOperation.map((elem, index) => {
                            return (<>
                                <div onClick={() => { addListeOperation(elem.id, elem.libelle) }} className="d-flex align-items-center my-1 mx-2 rechercheListe w-100">
                                    <div className='mx-2'><b>{elem.id}</b> - {elem.libelle}</div>
                                </div></>)
                        })}
                    </div>}
                </div>
            </div></> : ""}

        <div className="d-flex flex-column align-items-center w-100">
            {rechercheResultOperationAff.map((elem, index) => {
                return (<>
                    <div className="d-flex align-items-center bg-body-secondary list carte my-1 justify-content-between" style={{ width: "85%", height: '15%' }}>
                        <div className="mx-3 d-flex align-items-center w-75">
                            <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>{elem.id}</b></div>
                            <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.libelle}</div>
                        </div>
                        {provenance !== "details" ? <div className="mx-3 w-25 d-flex justify-content-end">
                            <button onClick={() => { console.log("------------------- index : " + index + "id : " + id + "elem.id : " + elem.id) ;deleteListOperation(index, id, elem.id) }} className="btn border border-2 mx-1 button bg-danger" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                data-bs-title="Supprimer"><FontAwesomeIcon icon="fa-solid fa-trash" style={{ color: "#ffffff", }} /></button>
                        </div> : ""}

                    </div></>)
            })}

        </div>
        <div className='flex-grow-1'>
            <div className="w-100 d-flex justify-content-center mt-5 anim">
                {provenance === "add" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { add() }}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Ajouter une gamme</button> : ""}
                {provenance === "update" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { update(id) }}><FontAwesomeIcon icon="fa-solid fa-pen-to-square" style={{ color: "#ffffff", }} />&nbsp;&nbsp; Modifier une gamme</button> : ""}
                {provenance === "details" ? "" : ""}
            </div>
        </div>
    </>
    );
}

export default Gamme;
