import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../Style/App.css';
import { useEffect, useState } from 'react';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';
import { debounce } from 'lodash';

function CommandeAchat(props) {

    const [provenance, setProvenance] = useState(sessionStorage.getItem("Provenance"))
    const [infoToast, setInfoToast] = useState("")
    const [statutToast, setStatutToast] = useState("")

    const [id, setId] = useState()

    const [rechercheResultFournisseur, setRechercheResultFournisseur] = useState([])
    const [idFournisseur, setIdFournisseur] = useState("")

    const [libelleAchat, setLibelleAchat] = useState("")
    const [dateAchat, setDateAchat] = useState("")
    const [dateprvAchat, setDateprvAchat] = useState("")
    const [daterlAchat, setDaterlAchat] = useState("")

    const [rechercheResultPiece, setRechercheResultPiece] = useState([])
    const [listePiece, setListePiece] = useState([])

    const [isDetails, setIsDetails] = useState(false)

    useEffect(() => {
        props.verifyDroit("Commerce")

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
                fetch(`${process.env.REACT_APP_URL}/commandeachat/getId`,
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
                            addFournisseur(data.commande.id_fournisseur, data.commande.fournisseur)
                            setLibelleAchat(data.commande.libelle)
                            setDateAchat(data.commande.date)
                            setDateprvAchat(data.commande.date_liv_prevue)
                            setDaterlAchat(data.commande.date_liv_reelle)
                            setListePiece(data.listePiece)
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
        fetch(`${process.env.REACT_APP_URL}/commandeachat/add`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                body: JSON.stringify({
                    commandeAchat: {
                        libelle: libelleAchat,
                        date_liv_prevue: dateprvAchat,
                        date_liv_reelle: daterlAchat,
                        date: dateAchat,
                        id_fournisseur: idFournisseur
                    },
                    listePiece: listePiece
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
                    window.location.href = '/commandesachats'
                }
            })
            .catch(error => {
                setInfoToast(error)
                setStatutToast('error')
                new Toast(document.querySelector('.toast')).show()
            });
    }

    function update(id) {
        fetch(`${process.env.REACT_APP_URL}/commandeachat/update/${id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                body: JSON.stringify({
                    commandeAchat: {
                        libelle: libelleAchat,
                        date_liv_prevue: dateprvAchat,
                        date_liv_reelle: daterlAchat,
                        date: dateAchat,
                        id_fournisseur: idFournisseur
                    },
                    listePiece: listePiece
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
                    window.location.href = '/commandesachats'
                }
            })
            .catch(error => {
                setInfoToast(error)
                setStatutToast('error')
                new Toast(document.querySelector('.toast')).show()
            });
    }

    function rechercheFournisseur(raison_sociale) {
        if (raison_sociale) {
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
        } else {
            setRechercheResultFournisseur([])
        }
    }

    function addFournisseur(id, raison_sociale) {
        setIdFournisseur(id)
        document.getElementById("rechercheFournisseur").value = raison_sociale
        setRechercheResultFournisseur([])
    }

    const recherchePiece = (libelle) => {
        if (libelle) {
            fetch(`${process.env.REACT_APP_URL}/piece/rechAchFournisseur`,
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
                        setRechercheResultPiece(data)
                    }

                })
                .catch(error => {
                    setInfoToast(error)
                    setStatutToast('error')
                    new Toast(document.querySelector('.toast')).show()
                });
        } else {
            setRechercheResultPiece([])
        }
    }

    function addListePiece(id_piece, libelle, unite, prix_achat) {
        if (listePiece.find((listePiece) => listePiece.id_piece === id_piece) === undefined) {
            const tab = [...listePiece, {
                id_piece: id_piece,
                libelle: libelle,
                quantite: 0,
                unite: unite,
                prix_achat: prix_achat,
            }]
            setListePiece(tab)
            setRechercheResultPiece([])
            document.getElementById("recherchePiece").value = ""
            setInfoToast("Pièce ajoutée avec succès")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        } else {
            setRechercheResultPiece([])
            document.getElementById("recherchePiece").value = ""
            setInfoToast("Pièce déjà présente dans la liste")
            setStatutToast('error')
            new Toast(document.querySelector('.toast')).show()
        }
    }

    function deleteListPiece(index) {
        if (window.confirm("Voulez-vous supprimer la ligne avec l'id : " + id + " du devis ?\nAttention cette action est irreversible")) {
            fetch(`${process.env.REACT_APP_URL}/ligneachat/delete/${listePiece[index].id}`,
                {
                    method: 'DELETE',
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
                        const tab = [...listePiece]
                        tab.splice(index, 1)
                        setListePiece(tab)
                        setInfoToast("Ligne supprimée avec succès")
                        setStatutToast('success')
                        new Toast(document.querySelector('.toast')).show()
                    }
                })
                .catch(error => {
                    console.log(error)
                });
        }
    }

    function changeQuantite(index, quantite) {
        let tab = [...listePiece]
        tab[index].quantite = quantite
        setListePiece(tab)
    }

    function changePrixAchat(index, prix_achat) {
        let tab = [...listePiece]
        tab[index].prix_achat = prix_achat
        setListePiece(tab)
    }

    return (<>
        <ToastAff infoToast={infoToast} statutToast={statutToast}></ToastAff>
        {provenance === "add" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Ajout des commandes d'achat</h1></div> : ""}
        {provenance === "update" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Modification des commandes d'achat</h1></div> : ""}
        {provenance === "details" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Détails des commandes d'achat</h1></div> : ""}

        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap bg-body-secondary justify-content-center list carte" style={{ width: "85%", height: '5%' }}>
                <form className="mx-3 d-flex flex-wrap align-items-center justify-content-between form-floating" style={{ width: "30%" }}>
                    <input type="text" className="form-control w-100" placeholder={'Fournisseur'} id="rechercheFournisseur" onChange={debounce((event) => { rechercheFournisseur(event.target.value) }, 500)} disabled={isDetails}></input>
                    <label>Fournisseur</label>
                    <div className="d-flex flex-column align-items-center w-100">
                        <div className="d-flex align-items-center justify-content-between" style={{ width: "100%" }}>
                            {
                                rechercheResultFournisseur.length > 0 &&
                                <div className="input-group anim border border-2">
                                    {rechercheResultFournisseur.map((elem) => {
                                        return (<>
                                            <div onClick={() => { addFournisseur(elem.id, elem.raison_sociale) }} className="d-flex align-items-center my-1 mx-2 rechercheListe w-100">
                                                <div className='mx-2'><b>{elem.id}</b> - {elem.raison_sociale}</div>
                                            </div></>)
                                    })}
                                </div>
                            }
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap bg-body-secondary justify-content-between list carte" style={{ width: "85%", height: '5%' }}>
                <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "30%" }}>
                    <input type="text" className="form-control w-100" id="floatingInputLibelle" placeholder={'Libelle'} value={libelleAchat} onChange={(event) => { setLibelleAchat(event.target.value) }} disabled={isDetails} ></input>
                    <label for="floatingInputLibelle">Libelle</label>
                </form>
                <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "20%" }}>
                    <input type="date" className="form-control w-100" id="floatingInputLibelle" placeholder={'Date'} value={dateAchat} onChange={(event) => { setDateAchat(event.target.value) }} disabled={isDetails}></input>
                    <label for="floatingInputLibelle">Date</label>
                </form>
                <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "20%" }}>
                    <input type="date" className="form-control w-100" id="floatingInputLibelle" placeholder={'Date liv. prévue'} value={dateprvAchat} onChange={(event) => { setDateprvAchat(event.target.value) }} disabled={isDetails}></input>
                    <label for="floatingInputLibelle">Date liv. prévue</label>
                </form>
                <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "20%" }}>
                    <input type="date" className="form-control w-100" id="floatingInputLibelle" placeholder={'Date liv. réelle'} value={daterlAchat} onChange={(event) => { setDaterlAchat(event.target.value) }} disabled={isDetails}></input>
                    <label for="floatingInputLibelle">Date liv. réelle</label>
                </form>
            </div>
        </div>

        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Choix des pièces</h1></div>
            {provenance !== "details" ? <>
                <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
                    <div className="d-flex align-items-center justify-content-between" style={{ width: "85%", height: '5%' }}>
                        <div className="input-group w-50 anim">
                            <input type="text" className="form-control w-25" placeholder={'Rechercher'} id="recherchePiece" onChange={debounce((event) => { recherchePiece(event.target.value) }, 500)}></input>
                            <span className="input-group-text" id="basic-addon1"><button className="btn" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                data-bs-title="Rechercher"><FontAwesomeIcon icon="fa-solid fa-plus" /></button></span>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column align-items-center w-100">
                    <div className="d-flex align-items-center justify-content-between" style={{ width: "85%" }}>
                        {rechercheResultPiece.length > 0 && <div className="input-group w-50 anim border border-2">
                            {rechercheResultPiece.map((elem, index) => {
                                return (<>
                                    <div key={index} onClick={() => { addListePiece(elem.id, elem.libelle, elem.unite, elem.prix_vente) }} className="d-flex align-items-center my-1 mx-2 rechercheListe w-100">
                                        <div className='mx-2'><b>{elem.id}</b> - {elem.libelle}</div>
                                    </div></>)
                            })}
                        </div>}
                    </div>
                </div></> : ""}

            <div className="d-flex flex-column align-items-center w-100">
                {listePiece.map((elem, index) => {
                    return (<>
                        <div key={index} className="d-flex align-items-center bg-body-secondary list carte my-1 justify-content-between" style={{ width: "85%", height: '15%' }}>
                            <div className="mx-3 d-flex align-items-center w-75">
                                <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>{elem.id_piece}</b></div>
                                <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.libelle}</div>
                                <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">
                                    <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "90%" }}>
                                        <input type="number" className="form-control w-100" placeholder={'Quantité'} value={listePiece[index].quantite} onChange={(event) => { changeQuantite(index, event.target.value) }} disabled={isDetails}></input>
                                        <label>Quantité</label>
                                    </form>
                                </div>
                                <div className="mx-3 border-end border-2 px-3 listQte text-truncate">{elem.unite}</div>
                                <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">
                                    <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "90%" }}>
                                        <input type="number" className="form-control w-100" placeholder={`Prix d'achat`} value={listePiece[index].prix_achat} onChange={(event) => { changePrixAchat(index, event.target.value) }} disabled={isDetails}></input>
                                        <label>Prix d'achat</label>
                                    </form>
                                </div>
                            </div>
                            {provenance !== "details" ? <div className="mx-3 w-25 d-flex justify-content-end">
                                <button onClick={() => { deleteListPiece(index) }} className="btn border border-2 mx-1 button bg-danger" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                    data-bs-title="Supprimer"><FontAwesomeIcon icon="fa-solid fa-trash" style={{ color: "#ffffff", }} /></button>
                            </div> : ""}

                        </div></>)
                })}
            </div>
        </div>

        <div className='flex-grow-1'>
            <div className="w-100 d-flex justify-content-center mt-5 anim">
                {provenance === "add" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { add() }}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Ajouter une commande</button> : ""}
                {provenance === "update" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { update(id) }}><FontAwesomeIcon icon="fa-solid fa-pen-to-square" style={{ color: "#ffffff", }} />&nbsp;&nbsp; Modifier une commande</button> : ""}
                {provenance === "details" ? "" : ""}
            </div>
        </div>
    </>
    );
}

export default CommandeAchat;
