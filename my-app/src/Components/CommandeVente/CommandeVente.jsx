import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../Style/App.css';
import { useEffect, useState } from 'react';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';
import { debounce } from 'lodash';

function CommandeVente(props) {

    const [provenance, setProvenance] = useState(sessionStorage.getItem("Provenance"))
    const [infoToast, setInfoToast] = useState("")
    const [statutToast, setStatutToast] = useState("")

    const [id, setId] = useState()

    const [rechercheResultClient, setRechercheResultClient] = useState([])
    const [idClient, setIdClient] = useState("")

    const [libelleCommande, setLibelleCommande] = useState("")
    const [dateCommande, setDateCommande] = useState("")

    const [rechercheResultPiece, setRechercheResultPiece] = useState([])
    const [listePiece, setListePiece] = useState([])
    const [listePieceSelected, setListePieceSelected] = useState([])
    const [listePieceWithoutCommande, setListePieceWithoutCommande] = useState([])

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
                fetch(`${process.env.REACT_APP_URL}/commandevente/getId`,
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
                            addClient(data.commande.id_client, data.commande.client)
                            setLibelleCommande(data.commande.libelle)
                            setDateCommande(data.commande.date)
                            setListePiece(data.listePiece)
                            setListePieceWithoutCommande(data.listePieceWithoutCommande)
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }
        if (provenance === "details" || provenance === "update") {
            setIsDetails(true)
        }
    }, [])

    function add() {
        if (libelleCommande) {
            if (dateCommande) {
                if (idClient) {
                    fetch(`${process.env.REACT_APP_URL}/commandevente/add`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                            body: JSON.stringify({
                                commandeVente: {
                                    libelle: libelleCommande,
                                    date: dateCommande,
                                    id_client: idClient
                                },
                                listePiece: listePieceSelected
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
                                window.location.href = '/commandesventes'
                            }
                        })
                        .catch(error => {
                            setInfoToast(error)
                            setStatutToast('error')
                            new Toast(document.querySelector('.toast')).show()
                        });
                } else {
                    setInfoToast("Vous n'avez pas choisi de client")
                    setStatutToast('error')
                    new Toast(document.querySelector('.toast')).show()
                }
            } else {
                setInfoToast("Vous n'avez pas renseigné la date")
                setStatutToast('error')
                new Toast(document.querySelector('.toast')).show()
            }
        } else {
            setInfoToast("Vous n'avez pas renseigné le libellé")
            setStatutToast('error')
            new Toast(document.querySelector('.toast')).show()
        }

    }

    function update(id) {
        fetch(`${process.env.REACT_APP_URL}/commandevente/update/${id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                body: JSON.stringify({
                    id: id,
                    listePiece: listePieceSelected
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
                    window.location.href = '/commandesventes'
                }
            })
            .catch(error => {
                setInfoToast(error)
                setStatutToast('error')
                new Toast(document.querySelector('.toast')).show()
            });
    }

    function rechercheClient(raison_sociale) {
        if (raison_sociale) {
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
        } else {
            setRechercheResultClient([])
        }
    }

    function addClient(id, raison_sociale) {
        setIdClient(id)
        document.getElementById("rechercheClient").value = raison_sociale
        setRechercheResultClient([])
        if (provenance !== "update" && provenance !== "details") {
            recherchePiece(id)
        }
    }

    const recherchePiece = (id_client) => {
        if (id_client) {
            fetch(`${process.env.REACT_APP_URL}/lignevente/getAllLigneClient`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        id_client: id_client,
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
                        setListePiece(data)
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

    function addListePiece(elem, value, index) {

        if (value) {
            if (listePieceSelected.find((listePieceSelected) => listePieceSelected.id_piece === elem.id_piece) === undefined) {
                const tab = [...listePieceSelected, {
                    id: elem.id,
                    id_piece: elem.id_piece,
                    libelle: elem.libelle,
                    quantite: elem.quantite,
                    unite: elem.unite,
                    prix_vente: elem.prix_vente,
                }]
                setListePieceSelected(tab)
                setInfoToast("Pièce ajoutée avec succès")
                setStatutToast('success')
                new Toast(document.querySelector('.toast')).show()
            } else {
                document.getElementById(`check` + index).checked = false
                setInfoToast("Pièce déjà présente dans la liste")
                setStatutToast('error')
                new Toast(document.querySelector('.toast')).show()
            }
        } else {
            const index = listePieceSelected.findIndex((listePieceSelected) => listePieceSelected.id === elem.id)
            const tab = [...listePieceSelected]
            tab.splice(index, 1)
            setListePieceSelected(tab)
            setInfoToast("Pièce supprimée avec succès")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        }
    }

    function addListePiece2(elem, value, index) {

        if (value) {
            if (listePieceSelected.find((listePieceSelected) => listePieceSelected.id_piece === elem.id_piece) === undefined &&
                listePiece.find((listePiece) => listePiece.id_piece === elem.id_piece) === undefined) {
                const tab = [...listePieceSelected, {
                    id: elem.id,
                    id_piece: elem.id_piece,
                    libelle: elem.libelle,
                    quantite: elem.quantite,
                    unite: elem.unite,
                    prix_vente: elem.prix_vente,
                }]
                setListePieceSelected(tab)
                setInfoToast("Pièce ajoutée avec succès")
                setStatutToast('success')
                new Toast(document.querySelector('.toast')).show()
            } else {
                document.getElementById(`check` + index).checked = false
                setInfoToast("Pièce déjà présente dans la liste")
                setStatutToast('error')
                new Toast(document.querySelector('.toast')).show()
            }
        } else {
            const index = listePieceSelected.findIndex((listePieceSelected) => listePieceSelected.id === elem.id)
            const tab = [...listePieceSelected]
            tab.splice(index, 1)
            setListePieceSelected(tab)
            setInfoToast("Pièce supprimée avec succès")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        }
    }

    function deleteLigneVente(elem) {
        if (id) {
            fetch(`${process.env.REACT_APP_URL}/lignevente/delete/${elem.id}`,
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

                        const tab = [...listePieceWithoutCommande, {
                            id: elem.id,
                            id_piece: elem.id_piece,
                            libelle: elem.libelle,
                            quantite: elem.quantite,
                            unite: elem.unite,
                            prix_vente: elem.prix_vente,
                        }]
                        setListePieceWithoutCommande(tab)

                        const index = listePiece.findIndex((listePiece) => listePiece.id === elem.id)
                        const tab2 = [...listePiece]
                        tab2.splice(index, 1)
                        setListePiece(tab2)

                        setInfoToast("Ligne supprimée avec succès")
                        setStatutToast('success')
                        new Toast(document.querySelector('.toast')).show()
                    }

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
        {provenance === "add" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Ajout des Commandes de vente</h1></div> : ""}
        {provenance === "update" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Modification des Commandes de vente</h1></div> : ""}
        {provenance === "details" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Détails des Commandes de vente</h1></div> : ""}

        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap bg-body-secondary justify-content-center list carte" style={{ width: "85%", height: '5%' }}>
                <form className="mx-3 d-flex flex-wrap align-items-center justify-content-between form-floating" style={{ width: "30%" }}>
                    <input type="text" className="form-control w-100" placeholder={'Client'} id="rechercheClient" onChange={debounce((event) => { rechercheClient(event.target.value) }, 500)} disabled={isDetails}></input>
                    <label>Client</label>
                    <div className="d-flex flex-column align-items-center w-100">
                        <div className="d-flex align-items-center justify-content-between" style={{ width: "100%" }}>
                            {
                                rechercheResultClient.length > 0 &&
                                <div className="input-group anim border border-2">
                                    {rechercheResultClient.map((elem) => {
                                        return (<>
                                            <div onClick={() => { addClient(elem.id, elem.raison_sociale) }} className="d-flex align-items-center my-1 mx-2 rechercheListe w-100">
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
            <div className="d-flex flex-wrap bg-body-secondary justify-content-evenly list carte" style={{ width: "85%", height: '5%' }}>
                <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "40%" }}>
                    <input type="text" className="form-control w-100" id="floatingInputLibelle" placeholder={'Libelle'} value={libelleCommande} onChange={(event) => { setLibelleCommande(event.target.value) }} disabled={isDetails} ></input>
                    <label for="floatingInputLibelle">Libelle</label>
                </form>
                <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "40%" }}>
                    <input type="date" className="form-control w-100" id="floatingInputLibelle" placeholder={'Date'} value={dateCommande} onChange={(event) => { setDateCommande(event.target.value) }} disabled={isDetails}></input>
                    <label for="floatingInputLibelle">Date</label>
                </form>
            </div>
        </div>

        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "50px" }}><h1>Liste des lignes</h1></div>
            <div className="d-flex flex-column align-items-center w-100 mt-5">
                {listePiece.map((elem, index) => {
                    console.log(elem);
                    return (<>
                        <div key={index} className="d-flex align-items-center bg-body-secondary list carte my-1 justify-content-between" style={{ width: "85%", height: '15%' }}>
                            <div className="mx-3 d-flex align-items-center w-75">
                                {provenance !== "update" && provenance !== "details" &&
                                    <div className="mx-3 border-end border-2 px-3 listId text-truncate">
                                        <input onChange={(event) => { addListePiece(elem, event.target.checked, index) }} id={`check` + index} class="form-check-input p-2 m-2" type="checkbox" />
                                    </div>}
                                <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>{elem.id}</b></div>
                                <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.libelle}</div>
                                <div className="mx-3 border-end border-2 px-3 listQte text-truncate">{elem.quantite}</div>
                                <div className="mx-3 border-end border-2 px-3 listQte text-truncate">{elem.unite}</div>
                                <div className="mx-3 border-end border-2 px-3 listQte text-truncate">{elem.prix_vente} €</div>
                            </div>
                            {provenance !== "details" ? <div className="mx-3 w-25 d-flex justify-content-end">
                                <button onClick={() => { deleteLigneVente(elem) }} className="btn border border-2 mx-1 button bg-danger" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                    data-bs-title="Supprimer"><FontAwesomeIcon icon="fa-solid fa-trash" style={{ color: "#ffffff", }} /></button>
                            </div> : ""}
                        </div>
                    </>)
                })}

            </div>
            {provenance === "update" && <div className="d-flex flex-column align-items-center w-100 mt-5">
                {listePieceWithoutCommande.map((elem, index) => {
                    return (<>
                        <div key={index} className="d-flex align-items-center bg-body-secondary list carte my-1 justify-content-between" style={{ width: "85%", height: '15%' }}>
                            <div className="mx-3 d-flex align-items-center w-75">
                                <div className="mx-3 border-end border-2 px-3 listId text-truncate">
                                    <input onChange={(event) => { addListePiece2(elem, event.target.checked, index) }} id={`check` + index} class="form-check-input p-2 m-2" type="checkbox" />
                                </div>
                                <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>{elem.id}</b></div>
                                <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.libelle}</div>
                                <div className="mx-3 border-end border-2 px-3 listQte text-truncate">{elem.quantite}</div>
                                <div className="mx-3 border-end border-2 px-3 listQte text-truncate">{elem.unite}</div>
                                <div className="mx-3 border-end border-2 px-3 listQte text-truncate">{elem.prix_vente} €</div>
                            </div>
                        </div>
                    </>)
                })}
            </div>}

        </div>

        <div className='flex-grow-1'>
            <div className="w-100 d-flex justify-content-center mt-5 anim">
                {provenance === "add" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { add() }}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Ajouter une commande de vente</button> : ""}
                {provenance === "update" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { update(id) }}><FontAwesomeIcon icon="fa-solid fa-pen-to-square" style={{ color: "#ffffff", }} />&nbsp;&nbsp; Modifier une commande de vente</button> : ""}
                {provenance === "details" ? "" : ""}
            </div>
        </div>
    </>
    );
}

export default CommandeVente;
