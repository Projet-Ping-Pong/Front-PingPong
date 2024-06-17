import { useEffect, useState } from 'react';
import '../../Style/App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from 'bootstrap/js/dist/tooltip';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';

function MachineList(props) {

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
        if (localStorage.getItem("Toast") === "success") {
          localStorage.setItem("Toast", "")
          setInfoToast("Machine crée avec succès")
          setStatutToast('success')
          new Toast(document.querySelector('.toast')).show()
        }
      })

    useEffect(() => {
        if (rechercheInput !== "" || rechercheInput !== null) {
            fetch(`${process.env.REACT_APP_URL}/machine/rechLibelle`,
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
    }, [rechercheInput])

    function getAll() {
        fetch(`${process.env.REACT_APP_URL}/machine/getAll`)
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

    function deleteElem(id) {
        if (window.confirm("Voulez-vous supprimer la machine avec l'id : " + id)) {
            fetch(`${process.env.REACT_APP_URL}/machine/delete/${id}`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(response => response.json())
                .then(() => { 
                    getAll()
                    setInfoToast("Machine supprimée avec succès")
                    setStatutToast('success')
                    new Toast(document.querySelector('.toast')).show()
                })
                .catch(error => {
                    setInfoToast(error)
                    setStatutToast('error')
                    new Toast(document.querySelector('.toast')).show()
                });
        }
    }

    return (<>
        <ToastAff infoToast={infoToast} statutToast={statutToast}></ToastAff>
        <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Liste des Machines</h1></div>
        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>

            <div className="d-flex align-items-center my-1 justify-content-between mb-3" style={{ width: "85%", height: '5%' }}>
                <div className="input-group w-50 anim">
                    <input type="text" className="form-control w-25" placeholder={'Rechercher'} value={rechercheInput} onChange={(event) => { setRechercheInput(event.target.value) }}></input>
                    <span className="input-group-text" id="basic-addon1"><button className="btn" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                        data-bs-title="Rechercher"><FontAwesomeIcon icon="fa-solid fa-magnifying-glass" /></button></span>
                </div>

                <div className="mx-3 w-25 d-flex justify-content-end anim">
                    <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { window.location.href = '/machinesCRUD'; sessionStorage.setItem("Provenance", "add") }}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Ajout</button>
                </div>
            </div>
        </div>
        <div className='flex-grow-1 d-flex'>
            <div className="d-flex flex-column align-items-center w-100">
                <div className="d-flex align-items-center bg-body-secondary list carte my-1 justify-content-between mb-3 border-bottom border-5" style={{ width: "85%", height: '13%' }}>
                    <div className="mx-3 d-flex align-items-center w-75">
                        <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>ID</b></div>
                        <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate"><b>Libellé</b></div>
                    </div>

                    <div className="mx-3 w-25">
                    </div>
                </div>
                {rechercheResult.map((elem, index) => {
                    return (<>
                        <div className="d-flex align-items-center bg-body-secondary list carte my-1 justify-content-between" style={{ width: "85%", height: '15%' }}>
                            <div className="mx-3 d-flex align-items-center w-75">
                                <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>{elem.id}</b></div>
                                <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.libelle}</div>
                            </div>

                            <div className="mx-3 w-25 d-flex justify-content-end">
                                <button onClick={() => { window.location.href = `/machinesCRUD?id=${elem.id}`; sessionStorage.setItem("Provenance", "details") }} className="btn border border-2 mx-1 button bg-primary" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                    data-bs-title="Détails"><FontAwesomeIcon icon="fa-solid fa-magnifying-glass" style={{ color: "#ffffff", }} /></button>
                                <button onClick={() => { window.location.href = `/machinesCRUD?id=${elem.id}`; sessionStorage.setItem("Provenance", "update") }} className="btn border border-2 mx-1 button bg-primary" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                    data-bs-title="Modifier"><FontAwesomeIcon icon="fa-solid fa-pen-to-square" style={{ color: "#ffffff", }} /></button>
                                <button onClick={() => { deleteElem(elem.id) }} className="btn border border-2 mx-1 button bg-danger" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                    data-bs-title="Supprimer"><FontAwesomeIcon icon="fa-solid fa-trash" style={{ color: "#ffffff", }} /></button>
                            </div>
                        </div></>)
                })}

            </div>
        </div>
    </>
    );
}

export default MachineList;
