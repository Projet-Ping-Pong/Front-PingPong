import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../Style/App.css';
import { useEffect, useState } from 'react';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';

function Droit(props) {

    const [provenance, setProvenance] = useState(sessionStorage.getItem("Provenance"))
    const [infoToast, setInfoToast] = useState("")
    const [statutToast, setStatutToast] = useState("")

    const [id, setId] = useState()

    const [libelle, setLibelle] = useState("")
    const [niveau, setNiveau] = useState("")

    const [isDetails, setIsDetails] = useState(false)

    useEffect(() => {
        props.verifyDroit("Admin")

        if (!provenance) {
            window.location.href = '/accueil';
        }
        sessionStorage.removeItem("Provenance")

        if (provenance === "update" || provenance === "details") {

            const search = window.location.search; // returns the URL query String
            const params = new URLSearchParams(search);
            const IdFromURL = params.get('id');
            setId(IdFromURL)

            if (IdFromURL) {
                fetch(`${process.env.REACT_APP_URL}/droit/getId`,
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
                            setNiveau(data.niveau)
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }
        if (provenance === "details") {
            setIsDetails(true)
        }

    }, [])

    function add() {
        fetch(`${process.env.REACT_APP_URL}/droit/add`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                body: JSON.stringify({
                    libelle: libelle,
                    niveau: niveau,
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
                    window.location.href = '/droits'
                }
            })
            .catch(error => {
                setInfoToast(error)
                setStatutToast('error')
                new Toast(document.querySelector('.toast')).show()
            });
    }

    function update(id) {
        fetch(`${process.env.REACT_APP_URL}/droit/update/${id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                body: JSON.stringify({
                    libelle: libelle,
                    niveau: niveau,
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
                    window.location.href = '/droits'
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
        {provenance === "add" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Ajout des Droits</h1></div> : ""}
        {provenance === "update" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Modification des Droits</h1></div> : ""}
        {provenance === "details" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Détails des Droits</h1></div> : ""}

        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap bg-body-secondary justify-content-center list carte" style={{ width: "85%", height: '5%' }}>
                <form className="mx-3 d-flex flex-wrap align-items-center justify-content-between form-floating" style={{ width: "60%" }}>
                    <input type="text" className="form-control w-100" placeholder={'Libellé'} value={libelle} onChange={(event) => { setLibelle(event.target.value) }} disabled={isDetails}></input>
                    <label>Libellé</label>
                </form>
                <form className="mx-3 d-flex flex-wrap align-items-center justify-content-between form-floating" style={{ width: "30%" }}>
                    <input type="number" className="form-control w-100" placeholder={'Niveau'} value={niveau} onChange={(event) => { setNiveau(event.target.value) }} disabled={isDetails}></input>
                    <label>Niveau</label>
                </form>
            </div>
        </div>
        <div className='flex-grow-1'>
            <div className="w-100 d-flex justify-content-center mt-5 anim">
                {provenance === "add" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { add() }}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Ajouter un droit</button> : ""}
                {provenance === "update" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { update(id) }}><FontAwesomeIcon icon="fa-solid fa-pen-to-square" style={{ color: "#ffffff", }} />&nbsp;&nbsp; Modifier un droit</button> : ""}
                {provenance === "details" ? "" : ""}
            </div>
        </div>
    </>
    );
}

export default Droit;
