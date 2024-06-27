import { useEffect, useState } from 'react';
import '../../Style/App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from 'bootstrap/js/dist/tooltip';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';
import Recherche from '../Vrac/Recherche';
import Liste from '../Vrac/liste';

function OperationList(props) {

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
            setInfoToast("Opération créée avec succès")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        }

        if (localStorage.getItem("Toast") === "successUpdate") {
            localStorage.setItem("Toast", "")
            setInfoToast("Operation modifiée avec succès")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        }
        props.verifyDroit("Atelier")
    })

    useEffect(() => {
        if (rechercheInput !== "" || rechercheInput !== null) {
            fetch(`${process.env.REACT_APP_URL}/operation/rechLibelle`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
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
        fetch(`${process.env.REACT_APP_URL}/operation/getAll`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
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

    function deleteElem(id) {
        if (window.confirm("Voulez-vous supprimer l'opération avec l'id : " + id)) {
            fetch(`${process.env.REACT_APP_URL}/operation/delete/${id}`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                })
                .then(response => response.json())
                .then(() => {
                    getAll()
                    setInfoToast("Opération supprimée avec succès")
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

    const recherche = (rechercheLib) => {
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
                    setRechercheResult(data)
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
        <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Liste des Opérations</h1></div>
        <Recherche recherche={(rechercheLib) => recherche(rechercheLib)} prov="operation" droit={props.droit}></Recherche>
        <Liste rechercheResult={rechercheResult} deleteElem={(id) => deleteElem(id)} prov="operation" droit={props.droit}></Liste>
    </>
    );
}

export default OperationList;
