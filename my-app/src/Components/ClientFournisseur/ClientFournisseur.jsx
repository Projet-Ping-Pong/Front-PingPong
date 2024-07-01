import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../Style/App.css';
import { useEffect, useState } from 'react';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';

function ClientFournisseur(props) {

    const [provenance, setProvenance] = useState(sessionStorage.getItem("Provenance"))
    const [infoToast, setInfoToast] = useState("")
    const [statutToast, setStatutToast] = useState("")
    const [disableChoix, setDisableChoix] = useState(false)

    const [idClient, setIdClient] = useState("")
    const [idFournisseur, setIdFournisseur] = useState("")

    const [choix, setChoix] = useState("")
    const [raisonSociale, setRaisonSociale] = useState("")
    const [adresse, setAdresse] = useState("")

    const [isDetails, setIsDetails] = useState(false)


    useEffect(() => {
        props.verifyDroit("Commerce")

        if(provenance === "addClient"){
            setChoix("1")
        }else{
            setChoix("2")
        }

        if(!provenance){
            window.location.href = '/accueil';
        }
        sessionStorage.removeItem("Provenance")

        if(provenance === "update" || provenance === "details"){

            setDisableChoix(true)

            const search = window.location.search; // returns the URL query String
            const params = new URLSearchParams(search);
            const IdClientFromURL = params.get('id_client');
            const IdFournisseurFromURL = params.get('id_fournisseur');
    
            if(IdClientFromURL){
                setIdClient(IdClientFromURL)
                fetch(`${process.env.REACT_APP_URL}/client/getId`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                        body: JSON.stringify({
                            id: IdClientFromURL,
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
                            setChoix(1)
                            setRaisonSociale(data.raison_sociale)
                            setAdresse(data.adresse)
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
    
            if(IdFournisseurFromURL){
                setIdFournisseur(IdFournisseurFromURL)
                fetch(`${process.env.REACT_APP_URL}/fournisseur/getId`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                        body: JSON.stringify({
                            id: IdFournisseurFromURL,
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
                            setChoix(2)
                            setRaisonSociale(data.raison_sociale)
                            setAdresse(data.adresse)
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
       
    },[])

    function add() {
        if(choix && raisonSociale && adresse){
            switch (choix) {
                case "1":
                    fetch(`${process.env.REACT_APP_URL}/client/add`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                            body: JSON.stringify({
                                raison_sociale: raisonSociale,
                                adresse: adresse,
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
                                localStorage.setItem("Toast", "successClient")
                                window.location.href = '/clientsfournisseurs'
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                    break;
    
                case "2":
                    fetch(`${process.env.REACT_APP_URL}/fournisseur/add`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                            body: JSON.stringify({
                                raison_sociale: raisonSociale,
                                adresse: adresse,
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
                                localStorage.setItem("Toast", "successFour")
                                window.location.href = '/clientsfournisseurs'
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                    break;
            
                default:
                    break;
            }
        }else{
            setInfoToast("Vous devez remplir tous les champs avant de valider")
            setStatutToast('error')
            new Toast(document.querySelector('.toast')).show()
        }
        
        
    }

    function update() {
        if(idClient){
            fetch(`${process.env.REACT_APP_URL}/client/update/${idClient}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        raison_sociale: raisonSociale,
                        adresse: adresse,
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
                        localStorage.setItem("Toast", "successUpdateClient")
                        window.location.href = '/clientsfournisseurs'
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
        if(idFournisseur){
            fetch(`${process.env.REACT_APP_URL}/fournisseur/update/${idFournisseur}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        raison_sociale: raisonSociale,
                        adresse: adresse,
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
                        localStorage.setItem("Toast", "successUpdateFour")
                        window.location.href = '/clientsfournisseurs'
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    return (<>
        <ToastAff infoToast={infoToast} statutToast={statutToast}></ToastAff>
        {provenance === "addClient" || provenance === "addFournisseur" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Ajout des Clients / Fournisseurs</h1></div> : ""}
        {provenance === "update" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Modification des Clients / Fournisseurs</h1></div> : ""}
        {provenance === "details" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Détails des Clients / Fournisseurs</h1></div> : ""}

        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap bg-body-secondary justify-content-between list carte" style={{ width: "85%", height: '5%' }}>
                <form className="mx-3 d-flex-wrap align-items-center justify-content-between form-floating" style={{ width: "20%" }}>
                    <select className="form-select" id='selectType' value={choix} onChange={(event) => {setChoix(event.target.value)}} disabled={disableChoix}>
                        <option value="1">Client</option>
                        <option value="2">Fournisseur</option>
                    </select>
                    <label>Choix</label>
                </form>
                <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "70%" }}>
                    <input type="text" className="form-control w-100" id="floatingInputLibelle" placeholder={'Raison Sociale'} value={raisonSociale} onChange={(event) => {setRaisonSociale(event.target.value)}} disabled={isDetails}></input>
                    <label for="floatingInputLibelle">Raison Sociale</label>
                </form>
            </div>
        </div>
        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap bg-body-secondary list carte" style={{ width: "85%", height: '5%' }}>
                <form className="mx-3 d-flex align-items-center justify-content-between w-100 form-floating">
                    <textarea type="textarea" rows="5" id="floatingInputDescription" className="form-control w-100" placeholder={'Adresse'} value={adresse} onChange={(event) => {setAdresse(event.target.value)}} disabled={isDetails}></textarea>
                    <label for="floatingInputDescription">Adresse</label>
                </form>
            </div>
        </div>

        <div className='flex-grow-1'>
            <div className="w-100 d-flex justify-content-center mt-5 anim">
                {provenance === "addClient" || provenance === "addFournisseur" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { add() }}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Ajouter un client / fournisseur</button> : ""}
                {provenance === "update" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { update() }}><FontAwesomeIcon icon="fa-solid fa-pen-to-square" style={{ color: "#ffffff", }} />&nbsp;&nbsp; Modifier un client / fournisseur</button> : ""}
                {provenance === "details" ? "" : ""}
            </div>
        </div>
    </>
    );
}

export default ClientFournisseur;
