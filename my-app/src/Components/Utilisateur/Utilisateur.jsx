import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../Style/App.css';
import { useEffect, useState } from 'react';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';
import { debounce } from 'lodash';

function Utilisateur(props) {

    const [provenance, setProvenance] = useState(sessionStorage.getItem("Provenance"))
    const [infoToast, setInfoToast] = useState("")
    const [statutToast, setStatutToast] = useState("")

    const [id, setId] = useState()

    const [nom, setNom] = useState("")
    const [prenom, setPrenom] = useState("")
    const [nom_uti, setNomUti] = useState("")
    const [mdp, setMdp] = useState("")
    const [mdpConfirm, setMdpConfirm] = useState("")

    const [rechercheResultDroit, setRechercheResultDroit] = useState([])
    const [listeDroit, setListeDroit] = useState([])

    const [rechercheResultPoste, setRechercheResultPoste] = useState([])
    const [listePoste, setListePoste] = useState([])

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
                fetch(`${process.env.REACT_APP_URL}/utilisateur/getId`,
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
                            setNom(data.utilisateur.nom)
                            setPrenom(data.utilisateur.prenom)
                            setNomUti(data.utilisateur.nom_uti)
                            setListeDroit(data.droits)
                            setListePoste(data.qualifications)
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
        if(nom_uti){
            if(mdp){
                if(mdp === mdpConfirm){
                    fetch(`${process.env.REACT_APP_URL}/utilisateur/add`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                            body: JSON.stringify({
                                utilisateur: {
                                    nom: nom,
                                    prenom: prenom,
                                    nom_uti: nom_uti,
                                    mdp: mdp
                                },
                                droits: listeDroit,
                                qualifications : listePoste
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
                                window.location.href = '/utilisateurs'
                            }
                        })
                        .catch(error => {
                            setInfoToast(error)
                            setStatutToast('error')
                            new Toast(document.querySelector('.toast')).show()
                        });
                }else{
                    setInfoToast("Le mot de passe et la confirmation du mot de passe ne correspondent pas")
                    setStatutToast('error')
                    new Toast(document.querySelector('.toast')).show()
                }
            }else{
                setInfoToast("Le mot de passe est vide")
                setStatutToast('error')
                new Toast(document.querySelector('.toast')).show()
            }
        }else{
            setInfoToast("L'identifiant est vide")
            setStatutToast('error')
            new Toast(document.querySelector('.toast')).show()
        }
    }

    function update(id) {
        fetch(`${process.env.REACT_APP_URL}/utilisateur/update/${id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                body: JSON.stringify({
                    utilisateur: {
                        nom: nom,
                        prenom: prenom,
                        nom_uti: nom_uti,
                        mdp: mdp
                    },
                    droits: listeDroit,
                    qualifications : listePoste
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
                    window.location.href = '/utilisateurs'
                }
            })
            .catch(error => {
                setInfoToast(error)
                setStatutToast('error')
                new Toast(document.querySelector('.toast')).show()
            });
    }

    const rechercheDroit = (libelle) => {
        if (libelle) {
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
                        setRechercheResultDroit(data)
                    }

                })
                .catch(error => {
                    setInfoToast(error)
                    setStatutToast('error')
                    new Toast(document.querySelector('.toast')).show()
                });
        } else {
            setRechercheResultDroit([])
        }
    }

    function addListeDroit(id, libelle, niveau) {
        if (listeDroit.find((listeDroit) => listeDroit.id === id) === undefined) {
            const tab = [...listeDroit, {
                id: id,
                libelle: libelle,
                niveau: niveau,
                new : true
            }]
            setListeDroit(tab)
            setRechercheResultDroit([])
            document.getElementById("rechercheDroit").value = ""
            setInfoToast("Droit ajouté avec succès")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        } else {
            setRechercheResultDroit([])
            document.getElementById("rechercheDroit").value = ""
            setInfoToast("Droit déjà présent dans la liste")
            setStatutToast('error')
            new Toast(document.querySelector('.toast')).show()
        }
    }

    function deleteListDroit(index) {
        if ((provenance === "update" || provenance === "details")  && !listeDroit[index].new) {
            if (window.confirm("Voulez-vous supprimer le droit avec l'id : " + id + " ?\nAttention cette action est irreversible")) {
                fetch(`${process.env.REACT_APP_URL}/utilisateurdroit/delete`,
                    {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                        body: JSON.stringify({
                            id_uti: id,
                            id_droit: listeDroit[index].id,
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
                            const tab = [...listeDroit]
                            tab.splice(index, 1)
                            setListeDroit(tab)
                            setInfoToast("Droit supprimé avec succès")
                            setStatutToast('success')
                            new Toast(document.querySelector('.toast')).show()
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    });
            }
        } else {
            const tab = [...listeDroit]
            tab.splice(index, 1)
            setListeDroit(tab)
            setInfoToast("Droit supprimé avec succès")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        }

    }

    const recherchePoste = (libelle) => {
        if (libelle) {
            fetch(`${process.env.REACT_APP_URL}/poste/rechLibelle`,
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
                        setRechercheResultPoste(data)
                    }

                })
                .catch(error => {
                    setInfoToast(error)
                    setStatutToast('error')
                    new Toast(document.querySelector('.toast')).show()
                });
        } else {
            setRechercheResultPoste([])
        }
    }

    function addListePoste(id, libelle) {
        if (listePoste.find((listePoste) => listePoste.id === id) === undefined) {
            const tab = [...listePoste, {
                id: id,
                libelle: libelle,
                new : true
            }]
            setListePoste(tab)
            setRechercheResultPoste([])
            document.getElementById("recherchePoste").value = ""
            setInfoToast("Poste ajouté avec succès")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        } else {
            setRechercheResultPoste([])
            document.getElementById("recherchePoste").value = ""
            setInfoToast("Poste déjà présent dans la liste")
            setStatutToast('error')
            new Toast(document.querySelector('.toast')).show()
        }
    }

    function deleteListPoste(index) {
        if ((provenance === "update" || provenance === "details") && !listePoste[index].new) {
            if (window.confirm("Voulez-vous supprimer le poste avec l'id : " + id + " ?\nAttention cette action est irreversible")) {
                fetch(`${process.env.REACT_APP_URL}/utilisateurposte/delete`,
                    {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                        body: JSON.stringify({
                            id_uti: id,
                            id_poste: listePoste[index].id,
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
                            const tab = [...listePoste]
                            tab.splice(index, 1)
                            setListePoste(tab)
                            setInfoToast("Poste supprimé avec succès")
                            setStatutToast('success')
                            new Toast(document.querySelector('.toast')).show()
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    });
            }
        } else {
            const tab = [...listePoste]
            tab.splice(index, 1)
            setListePoste(tab)
            setInfoToast("Poste supprimé avec succès")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        }
    }

    return (<>
        <ToastAff infoToast={infoToast} statutToast={statutToast}></ToastAff>
        {provenance === "add" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Ajout des Utilisateurs</h1></div> : ""}
        {provenance === "update" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Modification des Utilisateurs</h1></div> : ""}
        {provenance === "details" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Détails des Utilisateurs</h1></div> : ""}

        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap bg-body-secondary justify-content-center list carte" style={{ width: "85%", height: '5%' }}>
                <form className="mx-3 d-flex flex-wrap align-items-center justify-content-between form-floating" style={{ width: "30%" }}>
                    <input type="text" className="form-control w-100" placeholder={'Identifiant'} value={nom_uti} onChange={(event) => { setNomUti(event.target.value) }} disabled={isDetails}></input>
                    <label>Identifiant</label>
                </form>
                <form className="mx-3 d-flex flex-wrap align-items-center justify-content-between form-floating" style={{ width: "30%" }}>
                    <input type="text" className="form-control w-100" placeholder={'Nom'} value={nom} onChange={(event) => { setNom(event.target.value) }} disabled={isDetails}></input>
                    <label>Nom</label>
                </form>
                <form className="mx-3 d-flex flex-wrap align-items-center justify-content-between form-floating" style={{ width: "30%" }}>
                    <input type="text" className="form-control w-100" placeholder={'Prénom'} value={prenom} onChange={(event) => { setPrenom(event.target.value) }} disabled={isDetails}></input>
                    <label>Prénom</label>
                </form>
            </div>
        </div>
        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap bg-body-secondary justify-content-center list carte" style={{ width: "85%", height: '5%' }}>
                <form className="mx-3 d-flex flex-wrap align-items-center justify-content-between form-floating" style={{ width: "40%" }}>
                    <input type="password" className="form-control w-100" placeholder={'Mot de passe'} value={mdp} onChange={(event) => { setMdp(event.target.value) }} disabled={isDetails}></input>
                    <label>Mot de passe</label>
                </form>
                <form className="mx-3 d-flex flex-wrap align-items-center justify-content-between form-floating" style={{ width: "40%" }}>
                    <input type="password" className="form-control w-100" placeholder={'Confirmer le Mot de passe'} value={mdpConfirm} onChange={(event) => { setMdpConfirm(event.target.value) }} disabled={isDetails}></input>
                    <label>Confirmer le Mot de passe</label>
                </form>
            </div>
        </div>
        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Droits de l'utilisateur</h1></div>
            {provenance !== "details" ? <>
                <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
                    <div className="d-flex align-items-center justify-content-between" style={{ width: "85%", height: '5%' }}>
                        <div className="input-group w-50 anim">
                            <input type="text" className="form-control w-25" placeholder={'Rechercher'} id="rechercheDroit" onChange={debounce((event) => { rechercheDroit(event.target.value) }, 500)}></input>
                            <span className="input-group-text" id="basic-addon1"><button className="btn" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                data-bs-title="Rechercher"><FontAwesomeIcon icon="fa-solid fa-plus" /></button></span>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column align-items-center w-100">
                    <div className="d-flex align-items-center justify-content-between" style={{ width: "85%" }}>
                        {rechercheResultDroit.length > 0 && <div className="input-group w-50 anim border border-2">
                            {rechercheResultDroit.map((elem, index) => {
                                return (<>
                                    <div key={index} onClick={() => { addListeDroit(elem.id, elem.libelle, elem.niveau) }} className="d-flex align-items-center my-1 mx-2 rechercheListe w-100">
                                        <div className='mx-2'><b>{elem.id}</b> - {elem.libelle}, Niv.  {elem.niveau}</div>
                                    </div></>)
                            })}
                        </div>}
                    </div>
                </div></> : ""}

            <div className="d-flex flex-column align-items-center w-100">
                {listeDroit.map((elem, index) => {
                    return (<>
                        <div key={index} className="d-flex align-items-center bg-body-secondary list carte my-1 justify-content-between" style={{ width: "85%", height: '15%' }}>
                            <div className="mx-3 d-flex align-items-center w-75">
                                <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>{elem.id}</b></div>
                                <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.libelle}</div>
                                <div className="mx-3 border-end border-2 px-3 listQte text-truncate">{elem.niveau}</div>
                            </div>
                            {provenance !== "details" ? <div className="mx-3 w-25 d-flex justify-content-end">
                                <button onClick={() => { deleteListDroit(index) }} className="btn border border-2 mx-1 button bg-danger" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                    data-bs-title="Supprimer"><FontAwesomeIcon icon="fa-solid fa-trash" style={{ color: "#ffffff", }} /></button>
                            </div> : ""}

                        </div></>)
                })}

            </div>
        </div>
        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Qualifications</h1></div>
            {provenance !== "details" ? <>
                <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
                    <div className="d-flex align-items-center justify-content-between" style={{ width: "85%", height: '5%' }}>
                        <div className="input-group w-50 anim">
                            <input type="text" className="form-control w-25" placeholder={'Rechercher'} id="recherchePoste" onChange={debounce((event) => { recherchePoste(event.target.value) }, 500)}></input>
                            <span className="input-group-text" id="basic-addon1"><button className="btn" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                data-bs-title="Rechercher"><FontAwesomeIcon icon="fa-solid fa-plus" /></button></span>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column align-items-center w-100">
                    <div className="d-flex align-items-center justify-content-between" style={{ width: "85%" }}>
                        {rechercheResultPoste.length > 0 && <div className="input-group w-50 anim border border-2">
                            {rechercheResultPoste.map((elem, index) => {
                                return (<>
                                    <div key={index} onClick={() => { addListePoste(elem.id, elem.libelle) }} className="d-flex align-items-center my-1 mx-2 rechercheListe w-100">
                                        <div className='mx-2'><b>{elem.id}</b> - {elem.libelle}</div>
                                    </div></>)
                            })}
                        </div>}
                    </div>
                </div></> : ""}

            <div className="d-flex flex-column align-items-center w-100">
                {listePoste.map((elem, index) => {
                    return (<>
                        <div key={index} className="d-flex align-items-center bg-body-secondary list carte my-1 justify-content-between" style={{ width: "85%", height: '15%' }}>
                            <div className="mx-3 d-flex align-items-center w-75">
                                <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>{elem.id}</b></div>
                                <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.libelle}</div>
                                <div className="mx-3 border-end border-2 px-3 listQte text-truncate">{elem.niveau}</div>
                            </div>
                            {provenance !== "details" ? <div className="mx-3 w-25 d-flex justify-content-end">
                                <button onClick={() => { deleteListPoste(index) }} className="btn border border-2 mx-1 button bg-danger" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                    data-bs-title="Supprimer"><FontAwesomeIcon icon="fa-solid fa-trash" style={{ color: "#ffffff", }} /></button>
                            </div> : ""}

                        </div></>)
                })}

            </div>
        </div>
        <div className='flex-grow-1'>
            <div className="w-100 d-flex justify-content-center mt-5 anim">
                {provenance === "add" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { add() }}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Ajouter un utilisateur</button> : ""}
                {provenance === "update" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { update(id) }}><FontAwesomeIcon icon="fa-solid fa-pen-to-square" style={{ color: "#ffffff", }} />&nbsp;&nbsp; Modifier un utilisateur</button> : ""}
                {provenance === "details" ? "" : ""}
            </div>
        </div>
    </>
    );
}

export default Utilisateur;
