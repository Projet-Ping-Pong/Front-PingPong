import { useEffect, useState } from 'react';
import '../../Style/App.css';
import Tooltip from 'bootstrap/js/dist/tooltip';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';
import Recherche from '../Vrac/Recherche';
import Liste from '../Vrac/liste';

function ClientFournisseurList(props) {

    const [rechercheResultClient, setRechercheResultClient] = useState([])
    const [rechercheResultFournisseur, setRechercheResultFournisseur] = useState([])

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))

    const [infoToast, setInfoToast] = useState('')
    const [statutToast, setStatutToast] = useState('')

    useEffect(() => {

        getAllClient();
        getAllFournisseur()

        // Vérification du droit :
        props.verifyDroit("Commerce")

        if (localStorage.getItem("Toast") === "successClient") {
            localStorage.setItem("Toast", "")
            setInfoToast("Client créé avec succès")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        }
        if (localStorage.getItem("Toast") === "successFour") {
            localStorage.setItem("Toast", "")
            setInfoToast("Fournisseur créé avec succès")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        }
        if (localStorage.getItem("Toast") === "successUpdateClient") {
            localStorage.setItem("Toast", "")
            setInfoToast("Client modifié avec succès")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        }
        if (localStorage.getItem("Toast") === "successUpdateFournisseur") {
            localStorage.setItem("Toast", "")
            setInfoToast("Fournisseur modifié avec succès")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        }
    },[])

    async function getAllClient() {
        fetch(`${process.env.REACT_APP_URL}/client/getAll`,
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
                    setRechercheResultClient(data)
                }
            })
            .catch(error => {
                setInfoToast(error)
                setStatutToast('error')
                new Toast(document.querySelector('.toast')).show()
            });
    }

    async function getAllFournisseur() {
        fetch(`${process.env.REACT_APP_URL}/fournisseur/getAll`,
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
                    setRechercheResultFournisseur(data)
                }
            })
            .catch(error => {
                setInfoToast(error)
                setStatutToast('error')
                new Toast(document.querySelector('.toast')).show()
            });
    }

    function deleteElemClient(id) {
        if (window.confirm("Voulez-vous supprimer le client avec l'id : " + id)) {
            fetch(`${process.env.REACT_APP_URL}/client/delete/${id}`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                })
                .then(response => response.json())
                .then(() => {
                    getAllClient()
                    setInfoToast("Client supprimé avec succès")
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

    function deleteElemFournisseur(id) {
        if (window.confirm("Voulez-vous supprimer le fournisseur avec l'id : " + id)) {
            fetch(`${process.env.REACT_APP_URL}/fournisseur/delete/${id}`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                })
                .then(response => response.json())
                .then(() => {
                    getAllFournisseur()
                    setInfoToast("Fournisseur supprimé avec succès")
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

    const rechercheClient = (raison_sociale) => {
        if(raison_sociale){
            fetch(`${process.env.REACT_APP_URL}/client/rechRaisonSociale`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        raison_sociale: raison_sociale,
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
                        setRechercheResultClient(data)
                    }
    
                })
                .catch(error => {
                    setInfoToast(error)
                    setStatutToast('error')
                    new Toast(document.querySelector('.toast')).show()
                });
        }else{
            getAllClient()
        }
    }

    const rechercheFournisseur = (raison_sociale) => {
        if(raison_sociale){
            fetch(`${process.env.REACT_APP_URL}/fournisseur/rechRaisonSociale`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        raison_sociale: raison_sociale,
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
                        setRechercheResultFournisseur(data)
                    }
    
                })
                .catch(error => {
                    setInfoToast(error)
                    setStatutToast('error')
                    new Toast(document.querySelector('.toast')).show()
                });
        }else{
            getAllFournisseur()
        }
    }

    return (<>
        <ToastAff infoToast={infoToast} statutToast={statutToast}></ToastAff>
        
        <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Liste des Clients</h1></div>
        <Recherche recherche={(raison_sociale) => rechercheClient(raison_sociale)} prov="client" droit={props.droit}></Recherche>
        <Liste rechercheResult={rechercheResultClient} deleteElem={(id) => deleteElemClient(id)} prov="client" droit={props.droit} uti_id={props.uti}></Liste>

        <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Liste des Fournisseurs</h1></div>
        <Recherche recherche={(raison_sociale) => rechercheFournisseur(raison_sociale)} prov="fournisseur" droit={props.droit}></Recherche>
        <Liste rechercheResult={rechercheResultFournisseur} deleteElem={(id) => deleteElemFournisseur(id)} prov="fournisseur" droit={props.droit} uti_id={props.uti}></Liste>
    </>
    );
}

export default ClientFournisseurList;
