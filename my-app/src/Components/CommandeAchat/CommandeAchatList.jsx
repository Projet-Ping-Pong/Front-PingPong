import { useEffect, useState } from 'react';
import '../../Style/App.css';
import Tooltip from 'bootstrap/js/dist/tooltip';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';
import Recherche from '../Vrac/Recherche';
import Liste from '../Vrac/liste';

function CommandeAchatList(props) {

    const [rechercheResultCommande, setRechercheResultCommande] = useState([])

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))

    const [infoToast, setInfoToast] = useState('')
    const [statutToast, setStatutToast] = useState('')

    useEffect(() => {

        getAll()

        // Vérification du droit :
        props.verifyDroit("Commerce")

        if (localStorage.getItem("Toast") === "success") {
            localStorage.setItem("Toast", "")
            setInfoToast("Commande créé avec succès")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        }
        if (localStorage.getItem("Toast") === "successUpdate") {
            localStorage.setItem("Toast", "")
            setInfoToast("Commande modifiée avec succès")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        }
    },[])

    async function getAll() {
        fetch(`${process.env.REACT_APP_URL}/commandeachat/getAll`,
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
                    setRechercheResultCommande(data)
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
            fetch(`${process.env.REACT_APP_URL}/commandeachat/rechLibelle`,
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
                        setRechercheResultCommande(data)
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

    return (<>
        <ToastAff infoToast={infoToast} statutToast={statutToast}></ToastAff>
        
        <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Liste des commandes d'achat</h1></div>
        <Recherche recherche={(libelle) => recherche(libelle)} prov="commandeachat" droit={props.droit}></Recherche>
        <Liste rechercheResult={rechercheResultCommande} prov="commandeachat" droit={props.droit} uti_id={props.uti}></Liste>
    </>
    );
}

export default CommandeAchatList;
