import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../Style/App.css';
import { useEffect, useState } from 'react';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';
import { debounce } from 'lodash';

function Poste(props) {

    const [provenance] = useState(sessionStorage.getItem("Provenance"))

    const [id, setId] = useState("")
    const [libelle, setLibelle] = useState("")
    const [description, setDescription] = useState("")

    const [infoToast, setInfoToast] = useState("")
    const [statutToast, setStatutToast] = useState("")

    const [isDetails, setIsDetails] = useState(false)

    const [rechercheResult, setRechercheResult] = useState([])

    const [rechercheResult2, setRechercheResult2] = useState([])

    useEffect(() => {
        if(!provenance){
            window.location.href = '/accueil';
        }
        sessionStorage.removeItem("Provenance")
        props.verifyDroit("Atelier")
    },[])

    useEffect(() => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const IdFromURL = params.get('id');
        setId(IdFromURL)

        if (provenance === "update" || provenance === "details") {
            fetch(`${process.env.REACT_APP_URL}/poste/getId`,
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
                        setRechercheResult2(data.machines)
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

    const recherche = (rechercheLib) => {
        if (rechercheLib !== "") {
            fetch(`${process.env.REACT_APP_URL}/machine/rechLibelle`,
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
        } else {
            setRechercheResult([])
        }
    }

    function add() {
        if (libelle === "" || libelle === null) {
            setInfoToast("Le libellé est vide")
            setStatutToast('error')
            new Toast(document.querySelector('.toast')).show()
        } else {
            fetch(`${process.env.REACT_APP_URL}/poste/add`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        libelle: libelle,
                        description: description,
                        posteMachine: rechercheResult2
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
                        window.location.href = '/postes'
                    }
                })
                .catch(error => {
                    setInfoToast(error.body)
                    setStatutToast('error')
                    new Toast(document.querySelector('.toast')).show()
                });

        }
    }

    function update(id) {
        if (libelle === "" || libelle === null) {
            setInfoToast("Le libellé est vide")
            setStatutToast('error')
            new Toast(document.querySelector('.toast')).show()
        } else {
            fetch(`${process.env.REACT_APP_URL}/poste/update/${id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        libelle: libelle,
                        description: description,
                        machines: rechercheResult2
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
                        window.location.href = '/postes'
                    }
                })
                .catch(error => {
                    console.log(error)
                });
        }
    }

    function addListe(id, libelle) {
        if (rechercheResult2.find((rechercheResult2) => rechercheResult2.id === id) === undefined) {
            const tab = [...rechercheResult2, {
                id: id,
                libelle: libelle
            }]
            setRechercheResult2(tab)
            setRechercheResult([])
        } else {
            setInfoToast("Machine déjà présente dans la liste des machines adaptées au poste")
            setStatutToast('error')
            new Toast(document.querySelector('.toast')).show()
        }
        document.getElementById("recherche").value = ""
    }

    function deleteList(id, id_poste, id_machine) {
        if (window.confirm("Voulez-vous supprimer la liaison de la machine avec l'id : " + id_machine + "\nAttention cette action est irreversible")) {
            fetch(`${process.env.REACT_APP_URL}/postemachine/delete`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        id_poste: id_poste,
                        id_machine: id_machine,
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
                        const tab = [...rechercheResult2]
                        tab.splice(id, 1)
                        setRechercheResult2(tab)
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
        {provenance === "add" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Ajout des postes</h1></div> : ""}
        {provenance === "update" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Modification des postes</h1></div> : ""}
        {provenance === "details" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Détails des postes</h1></div> : ""}

        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap bg-body-secondary list carte" style={{ width: "85%", height: '5%' }}>
                <form class="mx-3 d-flex align-items-center justify-content-between w-100 form-floating">
                    <input type="text" className="form-control w-100" id="floatingInputLibelle" placeholder={'Libellé'} value={libelle} onChange={(event) => { setLibelle(event.target.value) }} disabled={isDetails}></input>
                    <label for="floatingInputLibelle">Libellé</label>
                </form>
            </div>
        </div>
        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap bg-body-secondary list carte" style={{ width: "85%", height: '5%' }}>
                <form class="mx-3 d-flex align-items-center justify-content-between w-100 form-floating">
                    <textarea type="textarea" rows="5" id="floatingInputDescription" className="form-control w-100" placeholder={'Description'} value={description} onChange={(event) => { setDescription(event.target.value) }} disabled={isDetails}></textarea>
                    <label for="floatingInputDescription">Description</label>
                </form>
            </div>
        </div>
        <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Machines adaptées au poste </h1></div>
        {provenance !== "details" ? <>
            <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
                <div className="d-flex align-items-center justify-content-between" style={{ width: "85%", height: '5%' }}>
                    <div className="input-group w-50 anim">
                        <input type="text" className="form-control w-25" placeholder={'Rechercher'} id="recherche" onChange={debounce((event) => { recherche(event.target.value) }, 500)}></input>
                        <span className="input-group-text" id="basic-addon1"><button className="btn" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                            data-bs-title="Rechercher"><FontAwesomeIcon icon="fa-solid fa-plus" /></button></span>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-center w-100">
                <div className="d-flex align-items-center justify-content-between" style={{ width: "85%" }}>
                    {rechercheResult.length > 0 && <div className="input-group w-50 anim border border-2">
                        {rechercheResult.map((elem, index) => {
                            return (<>
                                <div onClick={() => { addListe(elem.id, elem.libelle) }} className="d-flex align-items-center my-1 mx-2 rechercheListe w-100">
                                    <div className='mx-2'><b>{elem.id}</b> - {elem.libelle}</div>
                                </div></>)
                        })}
                    </div>}
                </div>
            </div></> : ""}

        <div className="d-flex flex-column align-items-center w-100">
            {rechercheResult2.map((elem, index) => {
                return (<>
                    <div className="d-flex align-items-center bg-body-secondary list carte my-1 justify-content-between" style={{ width: "85%", height: '15%' }}>
                        <div className="mx-3 d-flex align-items-center w-75">
                            <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>{elem.id}</b></div>
                            <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.libelle}</div>
                        </div>
                        {provenance !== "details" ? <div className="mx-3 w-25 d-flex justify-content-end">
                            <button onClick={() => { deleteList(index, id, elem.id) }} className="btn border border-2 mx-1 button bg-danger" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                data-bs-title="Supprimer"><FontAwesomeIcon icon="fa-solid fa-trash" style={{ color: "#ffffff", }} /></button>
                        </div> : ""}

                    </div></>)
            })}

        </div>
        <div className='flex-grow-1'>
            <div className="w-100 d-flex justify-content-center mt-5 anim">
                {provenance === "add" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { add() }}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Ajouter un poste</button> : ""}
                {provenance === "update" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { update(id) }}><FontAwesomeIcon icon="fa-solid fa-pen-to-square" style={{ color: "#ffffff", }} />&nbsp;&nbsp; Modifier un poste</button> : ""}
                {provenance === "details" ? "" : ""}
            </div>
        </div>
    </>
    );
}

export default Poste;
