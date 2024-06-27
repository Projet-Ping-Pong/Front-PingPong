import { useEffect, useState } from 'react';
import '../../Style/App.css';
import Tooltip from 'bootstrap/js/dist/tooltip';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';
import Recherche from '../Vrac/Recherche';
import Liste from '../Vrac/liste';

function RealisationListe(props) {

    const [rechercheResult, setRechercheResult] = useState([{}])
    const [rechercheInput, setRechercheInput] = useState("")

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))

    const [posteLibelle, setPosteLibelle] = useState('')
    const [machineLibelle, setMachineLibelle] = useState('')

    const [infoToast, setInfoToast] = useState('')
    const [statutToast, setStatutToast] = useState('')

    useEffect(() => {
        getAll();
    }, [])

    useEffect(() => {
        if (localStorage.getItem("Toast") === "success") {
            localStorage.setItem("Toast", "")
            setInfoToast("Réalisations créées avec succès")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        }
        props.verifyDroit("Atelier")
    })

    useEffect(() => {
        if (rechercheInput !== "" || rechercheInput !== null) {
            fetch(`${process.env.REACT_APP_URL}/realisation/rechLibelle`,
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
                    console.log(error)
                });
        }
    }, [rechercheInput])

    function getAll() {
        fetch(`${process.env.REACT_APP_URL}/realisation/getAll`,
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

                    console.log(data);
                    setRechercheResult(data)
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    const recherche = (rechercheLib) => {
        fetch(`${process.env.REACT_APP_URL}/realisation/rechLibelle`,
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
                console.log(error)
            });
    }

    return (<>
        <ToastAff infoToast={infoToast} statutToast={statutToast}></ToastAff>
        <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Liste des Réalisations</h1></div>
        <Recherche recherche={(rechercheLib) => recherche(rechercheLib)} prov="realisation"></Recherche>
        <Liste rechercheResult={rechercheResult} prov="realisation"></Liste>
    </>
    );
}

export default RealisationListe;
