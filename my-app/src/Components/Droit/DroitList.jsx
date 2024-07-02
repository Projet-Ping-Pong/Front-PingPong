import { useEffect, useState } from 'react';
import '../../Style/App.css';
import Tooltip from 'bootstrap/js/dist/tooltip';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';
import Recherche from '../Vrac/Recherche';
import Liste from '../Vrac/liste';

function DroitList(props) {

    const [rechercheResult, setRechercheResult] = useState([])

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))

    const [infoToast, setInfoToast] = useState('')
    const [statutToast, setStatutToast] = useState('')

    useEffect(() => {

        getAll()

        // Vérification du droit :
        props.verifyDroit("Admin")

        if (localStorage.getItem("Toast") === "success") {
            localStorage.setItem("Toast", "")
            setInfoToast("Droit créé avec succès")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        }
        if (localStorage.getItem("Toast") === "successUpdate") {
            localStorage.setItem("Toast", "")
            setInfoToast("Droit modifié avec succès")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        }
    },[])

    async function getAll() {
        fetch(`${process.env.REACT_APP_URL}/droit/getAll`,
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

    const recherche = (libelle) => {
        if(libelle){
            fetch(`${process.env.REACT_APP_URL}/droit/rechLibelle`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        libelle: libelle,
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
        }else{
            getAll()
        }
    }

    function deleteElem(id) {
        if (window.confirm("Voulez-vous supprimer le droit avec l'id : " + id)) {
            fetch(`${process.env.REACT_APP_URL}/droit/delete/${id}`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                })
                .then(response => response.json())
                .then(() => {
                    getAll()
                    setInfoToast("Droit supprimé avec succès")
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
        
        <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Liste des Droits</h1></div>
        <Recherche recherche={(libelle) => recherche(libelle)} prov="droit" droit={props.droit}></Recherche>
        <Liste rechercheResult={rechercheResult} deleteElem={(id) => deleteElem(id)} prov="droit" droit={props.droit} uti_id={props.uti}></Liste>
    </>
    );
}

export default DroitList;
