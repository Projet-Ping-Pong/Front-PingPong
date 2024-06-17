import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../Style/App.css';
import { useEffect, useState } from 'react';
import Toast from 'bootstrap/js/dist/toast';

function Machine(props) {

    const [provenance, setProvenance] = useState(sessionStorage.getItem("Provenance"))
    const [libelle, setLibelle] = useState(sessionStorage.getItem(""))
    const [description, setDescription] = useState(sessionStorage.getItem(""))
    const [infoToast, setInfoToast] = useState('')
    const [statutToast, setStatutToast] = useState('')
    const [id, setId] = useState('')
    const [isDetails, setIsDetails] = useState(false)

    useEffect(() => {
        const search = window.location.search; // returns the URL query String
        const params = new URLSearchParams(search);
        const IdFromURL = params.get('id');
        setId(IdFromURL)

        if (provenance === "update" || provenance === "details") {
            fetch(`${process.env.REACT_APP_URL}/machine/getId`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
                    }
                })
                .catch(error => {
                    console.log(error)
                });
        }
        if (provenance === "details"){
            setIsDetails(true)
        }
    },[])

    function add() {
        fetch(`${process.env.REACT_APP_URL}/machine/add`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    libelle: libelle,
                    description: description
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
                    window.location.href = '/machines'
                }
            })
            .catch(error => {
                setInfoToast(error.body)
                setStatutToast('error')
                new Toast(document.querySelector('.toast')).show()
            });
    }

    function update(id) {
        fetch(`${process.env.REACT_APP_URL}/machine/update/${id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    libelle: libelle,
                    description: description
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
                    setInfoToast("Machine modifiée avec succès")
                    setStatutToast('success')
                    new Toast(document.querySelector('.toast')).show()
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    return (<>
        <div className="toast-container position-fixed top-0 end-0 p-3">
            <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="alert alert-danger m-0" role="alert">
                    <div className="w-100 d-flex justify-content-end"><button type="button" className="btn-close top-0 end-0" data-bs-dismiss="toast" aria-label="Close"></button></div>
                    <p>{infoToast}</p>
                </div>
            </div>
        </div>
        {provenance === "add" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Ajout des machines</h1></div> : ""}
        {provenance === "update" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Modification des machines</h1></div> : ""}
        {provenance === "details" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Détails des machines</h1></div> : ""}

        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap bg-body-secondary list carte" style={{ width: "85%", height: '5%' }}>
                <div className="mx-3 d-flex align-items-center justify-content-between w-100">
                    <input type="text" className="form-control w-100" placeholder={'Libellé'} value={libelle} onChange={(event) => { setLibelle(event.target.value) }} disabled={isDetails}></input>
                </div>
            </div>
        </div>
        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap bg-body-secondary list carte" style={{ width: "85%", height: '5%' }}>
                <div className="mx-3 d-flex align-items-center justify-content-between w-100">
                    <textarea type="textarea" rows="5" className="form-control w-100" placeholder={'Description'} value={description} onChange={(event) => { setDescription(event.target.value) }} disabled={isDetails}></textarea>
                </div>
            </div>
        </div>

        <div className='flex-grow-1'>
            <div className="w-100 d-flex justify-content-center mt-5 anim">
                {provenance === "add" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { add() }}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Ajouter une machine</button> : ""}
                {provenance === "update" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { update(id) }}><FontAwesomeIcon icon="fa-solid fa-pen-to-square" style={{ color: "#ffffff", }} />&nbsp;&nbsp; Modifier une machine</button> : ""}
                {provenance === "details" ? "" : ""}
            </div>
        </div>
    </>
    );
}

export default Machine;
