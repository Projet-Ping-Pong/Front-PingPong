import { useEffect, useState } from 'react';
import '../../Style/App.css';
import Tooltip from 'bootstrap/js/dist/tooltip';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';
import Recherche from '../Vrac/Recherche';
import Liste from '../Vrac/liste';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function CommandeAchatList(props) {

    const [rechercheResultCommande, setRechercheResultCommande] = useState([])

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))

    const [mois, setMois] = useState(0)

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
    }, [])

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
        if (libelle) {
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
        } else {
            getAll()
        }
    }

    function csv(){
        window.location.href = `${process.env.REACT_APP_URL}/commandeachat/generecsv/${mois}`
    }

    return (<>
        <ToastAff infoToast={infoToast} statutToast={statutToast}></ToastAff>

        <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Liste des commandes d'achat</h1></div>
        <Recherche recherche={(libelle) => recherche(libelle)} prov="commandeachat" droit={props.droit}></Recherche>
        <Liste rechercheResult={rechercheResultCommande} prov="commandeachat" droit={props.droit} uti_id={props.uti}></Liste>

        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "20px" }}>
            <div className="d-flex align-items-center my-1 justify-content-center mb-3" style={{ width: "85%", height: '5%' }}>
                <div className="d-flex align-items-center justify-content-end w-100 form-floating">
                    <select className="form-select w-100" id='selectType' value={mois} onChange={(event) => { setMois(event.target.value) }}>
                        <option disabled value={0}>Mois</option>
                        <option value={1}>Janvier</option>
                        <option value={2}>Février</option>
                        <option value={3}>Mars</option>
                        <option value={4}>Avril</option>
                        <option value={5}>Mai</option>
                        <option value={6}>Juin</option>
                        <option value={7}>Juillet</option>
                        <option value={8}>Août</option>
                        <option value={9}>Septembre</option>
                        <option value={10}>Octobre</option>
                        <option value={11}>Novembre</option>
                        <option value={12}>Décembre</option>
                    </select>
                    <label>Mois</label>
                </div>
                <div className="w-100 d-flex justify-content-end mt-5 anim">
                    <button className="btn border border-2 px-4 button bg-primary" onClick={() => {csv()}} type="button" style={{ color: "#ffffff", }}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Export csv</button>
                </div>
            </div>
        </div>
    </>
    );
}

export default CommandeAchatList;
