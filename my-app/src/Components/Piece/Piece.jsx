import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../Style/App.css';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

function PieceAjout(props) {

    const [disablePrixVente, setDisablePrixVente] = useState(true)
    const [disablePrixAchat, setDisablePrixAchat] = useState(true)

    const [provenance] = useState(sessionStorage.getItem("Provenance"))

    const [infoToast, setInfoToast] = useState("")
    const [statutToast, setStatutToast] = useState("")

    const [isDetails, setIsDetails] = useState(false)

    const [id, setId] = useState()
    const [libelle, setLibelle] = useState("")
    const [prixVente, setPrixVente] = useState()
    const [prixAchat, setPrixAchat] = useState()
    const [quantite, setQuantite] = useState()
    const [unite, setUnite] = useState("")
    const [type, setType] = useState()

    const [qteCompo, setQteCompo] = useState()

    const [rechercheResultGamme, setRechercheResultGamme] = useState([])
    const [rechercheResultGamme2, setRechercheResultGamme2] = useState([])

    const [rechercheResultPiece, setRechercheResultPiece] = useState([])
    const [rechercheResultPiece2, setRechercheResultPiece2] = useState([])

    useEffect(() => {
        const search = window.location.search; // returns the URL query String
        const params = new URLSearchParams(search);
        const IdFromURL = params.get('id');
        setId(IdFromURL)

        if (provenance === "update" || provenance === "details") {
            fetch(`${process.env.REACT_APP_URL}/piece/getId`,
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
                        setRechercheResultPiece(data)
                        setLibelle(data.libelle)
                        setPrixAchat(data.prix_catalogue)
                        setPrixVente(data.prix_vente)
                        setQuantite(data.stock)
                        setUnite(data.unite)
                        setType(data.type)

                        if(data.id_gamme != null){
                            fetch(`${process.env.REACT_APP_URL}/gamme/getId`,
                                {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                                    body: JSON.stringify({
                                        id: data.id_gamme,
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
                                        setRechercheResultGamme2([data])
                                    }
                                })
                                .catch(error => {
                                    console.log(error)
                                });
                        }
                        fetch(`${process.env.REACT_APP_URL}/piececompo/getCompoByIdPiece`,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                                body: JSON.stringify({
                                    id_piece_composant: IdFromURL,
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
                                    console.log(data);
                                    setRechercheResultPiece2(data)
                                }
                            })
                            .catch(error => {
                                console.log(error)
                            });
                    }
                })
                .catch(error => {
                    console.log(error)
                });
        }
        if (provenance === "details") {
            setIsDetails(true)
        }
    }, [])

    function add() {
        if (libelle === "" || libelle === null) {
            setInfoToast("Le libellé est vide")
            setStatutToast('error')
            new Toast(document.querySelector('.toast')).show()
        } else {
            var tabCompo = []
            rechercheResultPiece2.forEach(element => {
                console.log(element);
                const id = document.getElementById(`id`+element.id).innerHTML
                const quantite = document.getElementById(`quantite`+element.id).value!=""?document.getElementById(`quantite`+element.id).value:0
                tabCompo = [...tabCompo,{
                    id: parseInt(id),
                    quantite: parseInt(quantite)
                }]
            })

            fetch(`${process.env.REACT_APP_URL}/piece/add`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        libelle: libelle,
                        prix_vente: prixVente,
                        prix_catalogue: prixAchat,
                        stock: quantite,
                        unite: unite,
                        type: type,
                        id_gamme: rechercheResultGamme2.length>0?rechercheResultGamme2[0].id:null,
                        listCompo: tabCompo
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
                        localStorage.setItem("Toast", "success")
                        window.location.href = '/pieces'
                    }
                })
                .catch(error => {
                    console.log(error);
                });

        }
    }

    function update(id) {
        var tabCompo = []
        rechercheResultPiece2.forEach(element => {
            console.log(element);
            const id = document.getElementById(`id`+element.id).innerHTML
            const quantite = document.getElementById(`quantite`+element.id).value!=""?document.getElementById(`quantite`+element.id).value:0
            tabCompo = [...tabCompo,{
                id: parseInt(id),
                quantite: parseInt(quantite)
            }]
        })

        fetch(`${process.env.REACT_APP_URL}/piece/update/${id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                body: JSON.stringify({
                    libelle: libelle,
                    prix_vente: prixVente,
                    prix_catalogue: prixAchat,
                    stock: quantite,
                    unite: unite,
                    type: type,
                    id_gamme: rechercheResultGamme2.length>0?rechercheResultGamme2[0].id:null,
                    listCompo: tabCompo
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
                    window.location.href = '/pieces'
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    const rechercheGamme = (rechercheLib) => {
        if (rechercheLib !== "") {
            fetch(`${process.env.REACT_APP_URL}/gamme/rechLibelle`,
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
                        var tabGamme = []
                        data.forEach(element => {
                            if(element.id_piece == null){
                                tabGamme.push(element)
                            }
                        });
                        setRechercheResultGamme(tabGamme)
                    }

                })
                .catch(error => {
                    setInfoToast(error)
                    setStatutToast('error')
                    new Toast(document.querySelector('.toast')).show()
                });
        } else {
            setRechercheResultGamme([])
        }
    }

    const recherchePiece = (rechercheLib) => {
        if (rechercheLib !== "") {
            fetch(`${process.env.REACT_APP_URL}/piece/rechLibelle`,
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

    function addListeGamme(id, libelle) {
        if (rechercheResultGamme2.length < 1) {
            const tab = [...rechercheResultGamme2, {
                id: id,
                libelle: libelle
            }]
            setRechercheResultGamme2(tab)
            setRechercheResultGamme([])
        } else {
            setInfoToast("Il n'est pas possible de lier plus d'une gamme")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        }
    }

    function addListePiece(id, libelle) {
        if (rechercheResultPiece2.find((rechercheResultPiece2) => rechercheResultPiece2.id === id) === undefined) {
            const tab = [...rechercheResultPiece2, {
                id: id,
                libelle: libelle
            }]
            setRechercheResultPiece2(tab)
            setRechercheResultPiece([])
        } else {
            setInfoToast("Pièce déjà présente dans la liste")
            setStatutToast('success')
            new Toast(document.querySelector('.toast')).show()
        }
    }

    function deleteListGamme(id) {
        const tab = [...rechercheResultGamme2]
        tab.splice(id, 1)
        setRechercheResultGamme2(tab)
    }

    function deleteListPiece(id, id_piece, id_compo) {
       
        if (window.confirm("Voulez-vous supprimer la pièce avec l'id : " + id_compo + " de la composition ?\nAttention cette action est irreversible")) {
            fetch(`${process.env.REACT_APP_URL}/piececompo/delete`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        id_piece_composant: id_piece,
                        id_piece_compose: id_compo,
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
                        const tab = [...rechercheResultPiece2]
                        tab.splice(id, 1)
                        setRechercheResultPiece2(tab)
                        setInfoToast("Liaison supprimée avec succès")
                        setStatutToast('success')
                        new Toast(document.querySelector('.toast')).show()
                    }
                })
                .catch(error => {
                    console.log(error)
                });
        }
    }

    return (<>
        <ToastAff infoToast={infoToast} statutToast={statutToast}></ToastAff>
        {provenance === "add" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Ajout des pièces</h1></div> : ""}
        {provenance === "update" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Modification des pièces</h1></div> : ""}
        {provenance === "details" ? <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Détails des pièces</h1></div> : ""}

        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap bg-body-secondary list carte mb-3" style={{ width: "85%", height: '5%' }}>
                <div className="mx-3 d-flex align-items-center justify-content-between w-100 mb-3">
                    <input type="text" className="form-control w-25" placeholder={'Référence'} value={id} disabled={true}></input>
                    <input type="text" className="form-control w-25" placeholder={'Prix de vente'} value={prixVente} onChange={(event) => { setPrixVente(event.target.value) }} disabled={disablePrixVente}></input>
                    <input type="text" className="form-control w-25" placeholder={'Quantité'} value={quantite} onChange={(event) => { setQuantite(event.target.value) }} disabled={isDetails}></input>
                </div>
                <div className="mx-3 d-flex align-items-center justify-content-between w-100">
                    <input type="text" className="form-control w-25" placeholder={'Libellé'} value={libelle} onChange={(event) => { setLibelle(event.target.value) }} disabled={isDetails}></input>
                    <input type="text" className="form-control w-25" placeholder={'Prix catalogue'} value={prixAchat} onChange={(event) => { setPrixAchat(event.target.value) }} disabled={disablePrixAchat}></input>
                    <input type="text" className="form-control w-25" placeholder={'Unité'} value={unite} onChange={(event) => { setUnite(event.target.value) }} disabled={isDetails}></input>
                </div>
            </div>
            <div className="d-flex flex-wrap bg-body-secondary list carte" style={{ width: "85%", height: '5%' }}>
                <div className="mx-3 d-flex align-items-center justify-content-between w-100">
                    <select class="form-select w-25" id='selectType' value={type} disabled={isDetails} onChange={() => {
                        setType(document.getElementById('selectType').value)
                        if (document.getElementById('selectType').value == "Type") {
                            setDisablePrixAchat(true); setDisablePrixVente(true)
                        }
                        if (document.getElementById('selectType').value == 1) {
                            setDisablePrixAchat(true); setDisablePrixVente(false)
                        }
                        if (document.getElementById('selectType').value == 2) {
                            setDisablePrixAchat(true); setDisablePrixVente(true)
                        }
                        if (document.getElementById('selectType').value == 3) {
                            setDisablePrixAchat(true); setDisablePrixVente(true)
                        }
                        if (document.getElementById('selectType').value == 4) {
                            setDisablePrixAchat(false); setDisablePrixVente(true)
                        }
                    }}>
                        <option selected>Type</option>
                        <option value="1">Livrable</option>
                        <option value="2">Intermédiaire</option>
                        <option value="3">Matière Première</option>
                        <option value="4">Achetée</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap" style={{ width: "85%" }}>
                <div className="bg-body-secondary d-flex justify-content-between list carte w-25">
                    <div className="d-flex align-items-center justify-content-center w-75">Lier une gamme</div>
                    <button class="btn w-25" type="button" data-bs-toggle="collapse" data-bs-target="#collapseGamme" aria-expanded="false" aria-controls="collapseExample">
                        <FontAwesomeIcon icon="fa-solid fa-chevron-down" />
                    </button>
                </div>
            </div>
        </div>
        <div class="collapse" id="collapseGamme">
            <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%" }}>
                <div className="d-flex flex-wrap bg-body-secondary list carte mb-3" style={{ width: "85%", height: '5%' }}>
                    {provenance !== "details" ? <>
                        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
                            <div className="d-flex align-items-center justify-content-between" style={{ width: "85%", height: '5%' }}>
                                <div className="input-group w-50 anim">
                                    <input type="text" className="form-control w-25" placeholder={'Rechercher'} onChange={debounce((event) => { rechercheGamme(event.target.value) }, 500)}></input>
                                    <span className="input-group-text" id="basic-addon1"><button className="btn" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                        data-bs-title="Rechercher"><FontAwesomeIcon icon="fa-solid fa-plus" /></button></span>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-column align-items-center w-100">
                            <div className="d-flex align-items-center justify-content-between" style={{ width: "85%" }}>
                                {rechercheResultGamme.length > 0 && <div className="input-group w-50 anim border border-2">
                                    {rechercheResultGamme.map((elem, index) => {
                                        return (<>
                                            <div onClick={() => { addListeGamme(elem.id, elem.libelle) }} className="d-flex align-items-center my-1 mx-2 rechercheListe w-100">
                                                <div className='mx-2'><b>{elem.id}</b> - {elem.libelle}</div>
                                            </div></>)
                                    })}
                                </div>}
                            </div>
                        </div></> : ""}
                    <div className="d-flex flex-column align-items-center w-100">
                        {rechercheResultGamme2.map((elem, index) => {
                            return (<>
                                <div className="d-flex align-items-center bg-body-primary list carte my-1 justify-content-between" style={{ width: "85%" }}>
                                    <div className="mx-3 d-flex align-items-center w-75">
                                        <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>{elem.id}</b></div>
                                        <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.libelle}</div>
                                    </div>
                                    {provenance !== "details" ? <div className="mx-3 w-25 d-flex justify-content-end">
                                        <button onClick={() => { deleteListGamme(index) }} className="btn border border-2 mx-1 button bg-danger" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                            data-bs-title="Supprimer"><FontAwesomeIcon icon="fa-solid fa-trash" style={{ color: "#ffffff", }} /></button>
                                    </div> : ""}
                                </div></>)
                        })}
                    </div>
                </div>
            </div>
        </div>
        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap" style={{ width: "85%" }}>
                <div className="bg-body-secondary d-flex justify-content-between list carte w-25">
                    <div className="d-flex align-items-center justify-content-center w-75">Gérer la composition</div>
                    <button class="btn w-25" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCompo" aria-expanded="false" aria-controls="collapseExample">
                        <FontAwesomeIcon icon="fa-solid fa-chevron-down" />
                    </button>
                </div>
            </div>
        </div>
        <div class="collapse" id="collapseCompo">
            <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%" }}>
                <div className="d-flex flex-wrap bg-body-secondary list carte mb-3" style={{ width: "85%", height: '5%' }}>
                    {provenance !== "details" ? <>
                        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
                            <div className="d-flex align-items-center justify-content-between" style={{ width: "85%", height: '5%' }}>
                                <div className="input-group w-50 anim">
                                    <input type="text" className="form-control w-25" placeholder={'Rechercher'} onChange={debounce((event) => { recherchePiece(event.target.value) }, 500)}></input>
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
                                            <div onClick={() => { addListePiece(elem.id, elem.libelle) }} className="d-flex align-items-center my-1 mx-2 rechercheListe w-100">
                                                <div className='mx-2'><b>{elem.id}</b> - {elem.libelle}</div>
                                            </div></>)
                                    })}
                                </div>}
                            </div>
                        </div></> : ""}
                    <div className="d-flex flex-column align-items-center w-100">
                        {rechercheResultPiece2.map((elem, index) => {
                            return (<>
                                <div className="d-flex align-items-center bg-body-primary list carte my-1 justify-content-between" style={{ width: "85%" }}>
                                    <div className="mx-3 d-flex align-items-center w-75">
                                        <div className="mx-3 border-end border-2 px-3 listId text-truncate" id={`id`+elem.id}>{elem.id}</div>
                                        <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate" id={`libelle`+elem.id}>{elem.libelle}</div>
                                        <form class="mx-3 border-end border-2 listLibelle text-truncate form-floating">
                                            <input type="text" className="form-control w-100" id={`quantite`+elem.id} placeholder={'Quantité'} value={qteCompo} onChange={(event) => { setQteCompo(event.target.value) }} disabled={isDetails}></input>
                                            <label for={`quantite`+elem.id}>Quantité</label>
                                        </form>
                                        <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>{elem.unite}</b></div>
                                    </div>
                                    {provenance !== "details" ? <div className="mx-3 w-25 d-flex justify-content-end">
                                        <button onClick={() => { deleteListPiece(index,id,elem.id) }} className="btn border border-2 mx-1 button bg-danger" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                            data-bs-title="Supprimer"><FontAwesomeIcon icon="fa-solid fa-trash" style={{ color: "#ffffff", }} /></button>
                                    </div> : ""}
                                </div></>)
                        })}
                    </div>
                </div>
            </div>
        </div>

        <div className='flex-grow-1'>
            <div className="w-100 d-flex justify-content-center mt-5 anim">
                {provenance === "add" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { add() }}><FontAwesomeIcon icon="fa-solid fa-plus" />&nbsp;&nbsp; Ajouter une pièce</button> : ""}
                {provenance === "update" ? <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { update(id) }}><FontAwesomeIcon icon="fa-solid fa-pen-to-square" style={{ color: "#ffffff", }} />&nbsp;&nbsp; Modifier une pièce</button> : ""}
                {provenance === "details" ? "" : ""}
            </div>
        </div>
    </>
    );
}

export default PieceAjout;
