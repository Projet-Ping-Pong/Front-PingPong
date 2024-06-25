import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../Style/App.css';
import { useEffect, useState } from 'react';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';
import { debounce } from 'lodash';

function Operation(props) {

    const [provenance, setProvenance] = useState(sessionStorage.getItem("Provenance"))
    const [libelle, setLibelle] = useState(sessionStorage.getItem(""))
    const [temps, setTemps] = useState(sessionStorage.getItem(""))
    const [description, setDescription] = useState(sessionStorage.getItem(""))
    const [infoToast, setInfoToast] = useState('')
    const [statutToast, setStatutToast] = useState('')
    const [id, setId] = useState('')
    const [isDetails, setIsDetails] = useState(false)

    const [rechercheResultMachine, setRechercheResultMachine] = useState([])
    const [rechercheResultPoste, setRechercheResultPoste] = useState([])

    const [rechercheResultMachineAff, setRechercheResultMachineAff] = useState([])
    const [rechercheResultPosteAff, setRechercheResultPosteAff] = useState([])

    useEffect(() => {
        if(!provenance){
            window.location.href = '/accueil';
        }
        sessionStorage.removeItem("Provenance")
    },[])

    useEffect(() => {
        const search = window.location.search; // returns the URL query String
        const params = new URLSearchParams(search);
        const IdFromURL = params.get('id');
        setId(IdFromURL)

        if (provenance === "update" || provenance === "details") {
            fetch(`${process.env.REACT_APP_URL}/operation/getId`,
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
                        setLibelle(data.operation.libelle)
                        setTemps(data.operation.temps)
                        setDescription(data.operation.description)
                        if (data.poste != null) { setRechercheResultPosteAff([data.poste]) }
                        if (data.machine != null) { setRechercheResultMachineAff([data.machine]) }
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
            fetch(`${process.env.REACT_APP_URL}/operation/add`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        libelle: libelle,
                        description: description,
                        temps: temps,
                        id_poste: rechercheResultPosteAff.length>0?rechercheResultPosteAff[0].id:null,
                        id_machine: rechercheResultMachineAff.length>0?rechercheResultMachineAff[0].id:null
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
                        window.location.href = '/operations'
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
        fetch(`${process.env.REACT_APP_URL}/operation/update/${id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                body: JSON.stringify({
                    libelle: libelle,
                    description: description,
                    temps: temps,
                    id_poste: rechercheResultPosteAff.length > 0 ? rechercheResultPosteAff[0].id : null,
                    id_machine: rechercheResultMachineAff.length > 0 ? rechercheResultMachineAff[0].id : null
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
                    window.location.href = '/operations'
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    const rechercheMachine = (rechercheLib) => {
        if (rechercheLib !== "") {
            fetch(`${process.env.REACT_APP_URL}/postemachine/rechLibelle`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        id_poste: rechercheResultPosteAff[0].id,
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
                        console.log(data);
                        setRechercheResultMachine(data)
                    }

                })
                .catch(error => {
                    setInfoToast(error)
                    setStatutToast('error')
                    new Toast(document.querySelector('.toast')).show()
                });
        } else {
            setRechercheResultMachine([])
        }
    }

    const recherchePoste = (rechercheLib) => {
        if (rechercheLib !== "") {
            fetch(`${process.env.REACT_APP_URL}/poste/rechLibelle`,
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
                        console.log(data)
                        setRechercheResultPoste(data)
                    }

                })
                .catch(error => {
                    setInfoToast(error)
                    setStatutToast('error')
                    new Toast(document.querySelector('.toast')).show()
                });
        } else {
            setRechercheResultPoste([])
        }
    }

    function addListePoste(id, libelle) {
        if (rechercheResultPosteAff.length < 1) {
            const tab = [...rechercheResultPosteAff, {
                id: id,
                libelle: libelle
            }]
            setRechercheResultPosteAff(tab)
            setRechercheResultPoste([])
            document.getElementById("recherchePoste").value = ""
        } else {
            setInfoToast("Il n'est pas possible d'ajouter plus d'un poste")
            setStatutToast('error')
            new Toast(document.querySelector('.toast')).show()
            setRechercheResultPoste([])
            document.getElementById("recherchePoste").value = ""
        }
    }

    function addListeMachine(id, libelle) {
        if (rechercheResultMachineAff.length < 1) {
            const tab = [...rechercheResultMachineAff, {
                id: id,
                libelle: libelle
            }]
            setRechercheResultMachineAff(tab)
            setRechercheResultMachine([])
            document.getElementById("rechercheMachine").value = ""
        } else {
            setInfoToast("Il n'est pas possible d'ajouter plus d'une machine")
            setStatutToast('error')
            new Toast(document.querySelector('.toast')).show()
            setRechercheResultMachine([])
            document.getElementById("rechercheMachine").value = ""
        }
    }

    function deleteListPoste(id) {
        if (window.confirm("Voulez-vous supprimer le poste ?\nAttention la machine sera aussi supprimée")) {
            const tab = [...rechercheResultPosteAff]
            tab.splice(id, 1)
            setRechercheResultPosteAff(tab)
            setRechercheResultMachineAff([])
        }
    }

    function deleteListMachine(id) {
        if (window.confirm("Voulez-vous supprimer la machine ?")) {
            const tab = [...rechercheResultMachineAff]
            tab.splice(id, 1)
            setRechercheResultMachineAff(tab)
        }
    }

    return (<>
        <ToastAff infoToast={infoToast} statutToast={statutToast}></ToastAff>
        {provenance === "add" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Ajout des operations</h1></div> : ""}
        {provenance === "update" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Modification des operations</h1></div> : ""}
        {provenance === "details" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Détails des operations</h1></div> : ""}

        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap bg-body-secondary justify-content-between list carte" style={{ width: "85%", height: '5%' }}>
                <form class="mx-3 d-flex align-items-center justify-content-between w-50 form-floating">
                    <input type="text" className="form-control w-100" id="floatingInputLibelle" placeholder={'Libellé'} value={libelle} onChange={(event) => { setLibelle(event.target.value) }} disabled={isDetails}></input>
                    <label for="floatingInputLibelle">Libellé</label>
                </form>
                <form class="mx-3 d-flex align-items-center justify-content-between w-25 form-floating">
                    <input type="text" className="form-control w-100" id="floatingInputLibelle" placeholder={'Temps'} value={temps} onChange={(event) => { setTemps(event.target.value) }} disabled={isDetails}></input>
                    <label for="floatingInputLibelle">Temps</label>
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
        <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Postes de travail</h1></div>
        {provenance !== "details" ? <>
            <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
                <div className="d-flex align-items-center justify-content-between" style={{ width: "85%", height: '5%' }}>
                    <div className="input-group w-50 anim">
                        <input type="text" className="form-control w-25" id="recherchePoste" placeholder={'Rechercher'} onChange={debounce((event) => { recherchePoste(event.target.value) }, 500)}></input>
                        <span className="input-group-text" id="basic-addon1"><button className="btn" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                            data-bs-title="Rechercher"><FontAwesomeIcon icon="fa-solid fa-plus" /></button></span>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-center w-100">
                <div className="d-flex align-items-center justify-content-between" style={{ width: "85%" }}>
                    {rechercheResultPoste.length > 0 && <div className="input-group w-50 anim border border-2">
                        {rechercheResultPoste.map((elem, index) => {
                            return (<>
                                <div onClick={() => { addListePoste(elem.id, elem.libelle) }} className="d-flex align-items-center my-1 mx-2 rechercheListe w-100">
                                    <div className='mx-2'><b>{elem.id}</b> - {elem.libelle}</div>
                                </div></>)
                        })}
                    </div>}
                </div>
            </div></> : ""}

        <div className="d-flex flex-column align-items-center w-100">
            {rechercheResultPosteAff.map((elem, index) => {
                return (<>
                    <div className="d-flex align-items-center bg-body-secondary list carte my-1 justify-content-between" style={{ width: "85%", height: '15%' }}>
                        <div className="mx-3 d-flex align-items-center w-75">
                            <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>{elem.id}</b></div>
                            <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.libelle}</div>
                        </div>
                        {provenance !== "details" ? <div className="mx-3 w-25 d-flex justify-content-end">
                            <button onClick={() => { deleteListPoste(index) }} className="btn border border-2 mx-1 button bg-danger" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                data-bs-title="Supprimer"><FontAwesomeIcon icon="fa-solid fa-trash" style={{ color: "#ffffff", }} /></button>
                        </div> : ""}

                    </div></>)
            })}

        </div>
        {
            rechercheResultPosteAff.length > 0 &&
            <>
                <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Machines</h1></div>
                {provenance !== "details" ? <>
                    <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
                        <div className="d-flex align-items-center justify-content-between" style={{ width: "85%", height: '5%' }}>
                            <div className="input-group w-50 anim">
                                <input type="text" className="form-control w-25" id="rechercheMachine" placeholder={'Rechercher'} onChange={debounce((event) => { rechercheMachine(event.target.value) }, 500)}></input>
                                <span className="input-group-text" id="basic-addon1"><button className="btn" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                    data-bs-title="Rechercher"><FontAwesomeIcon icon="fa-solid fa-plus" /></button></span>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column align-items-center w-100">
                        <div className="d-flex align-items-center justify-content-between" style={{ width: "85%" }}>
                            {rechercheResultMachine.length > 0 && <div className="input-group w-50 anim border border-2">
                                {rechercheResultMachine.map((elem, index) => {
                                    return (<>
                                        <div onClick={() => { addListeMachine(elem.id, elem.libelle) }} className="d-flex align-items-center my-1 mx-2 rechercheListe w-100">
                                            <div className='mx-2'><b>{elem.id}</b> - {elem.libelle}</div>
                                        </div></>)
                                })}
                            </div>}
                        </div>
                    </div></> : ""}

                <div className="d-flex flex-column align-items-center w-100">
                    {rechercheResultMachineAff.map((elem, index) => {
                        return (<>
                            <div className="d-flex align-items-center bg-body-secondary list carte my-1 justify-content-between" style={{ width: "85%", height: '15%' }}>
                                <div className="mx-3 d-flex align-items-center w-75">
                                    <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>{elem.id}</b></div>
                                    <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.libelle}</div>
                                </div>
                                {provenance !== "details" ? <div className="mx-3 w-25 d-flex justify-content-end">
                                    <button onClick={() => { deleteListMachine(index) }} className="btn border border-2 mx-1 button bg-danger" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                        data-bs-title="Supprimer"><FontAwesomeIcon icon="fa-solid fa-trash" style={{ color: "#ffffff", }} /></button>
                                </div> : ""}

                            </div></>)
                    })}

                </div>
            </>
        }

        <div className='flex-grow-1'>
            <div className="w-100 d-flex justify-content-center mt-5 anim">
                {provenance === "add" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { add() }}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Ajouter une operation</button> : ""}
                {provenance === "update" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { update(id) }}><FontAwesomeIcon icon="fa-solid fa-pen-to-square" style={{ color: "#ffffff", }} />&nbsp;&nbsp; Modifier une operation</button> : ""}
                {provenance === "details" ? "" : ""}
            </div>
        </div>
    </>
    );
}

export default Operation;
