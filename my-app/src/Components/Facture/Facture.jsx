import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../Style/App.css';
import { usePDF } from 'react-to-pdf';
import { useEffect, useState } from 'react';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';

function Facture() {

    const { toPDF, targetRef } = usePDF({ filename: 'facture.pdf' });
    const [provenance, setProvenance] = useState(sessionStorage.getItem("Provenance"))
    const [infoToast, setInfoToast] = useState("")
    const [statutToast, setStatutToast] = useState("")

    const [id, setId] = useState()
    const [libelleFacture, setLibelleFacture] = useState()
    const [nomClientFouFacture, setNomClientFouFacture] = useState()
    const [nomClientFou, setNomClientFou] = useState()
    const [date, setDate] = useState()
    const [adresse, setAdresse] = useState()
    const [listeAllPiece, setListeAllPiece] = useState([])
    const [prixTot, setPrixTot] = useState()

    useEffect(() => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const IdFromURL = params.get('id');
        setId(IdFromURL)
        if (provenance === "achat") {
            factureAchat()
        } else {
            factureVente()
        }

    }, [id])

    function factureAchat() {
        setLibelleFacture("Facture d'achat n°" + id)
        setNomClientFouFacture("Nom du fournisseur:")
        if (id) {
            fetch(`${process.env.REACT_APP_URL}/commandeachat/getId`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        id: id,
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
                        setNomClientFou(data.commande.fournisseurAll.raison_sociale)
                        setDate(new Date(data.commande.date).toLocaleDateString())
                        setAdresse(data.commande.fournisseurAll.adresse)
                        setListeAllPiece(data.listePiece)
                        let prix = 0
                        data.listePiece.forEach(element => {
                            prix = prix + (element.quantite * element.prix_achat)
                        });
                        setPrixTot(prix)
                        
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    function factureVente() {
        setLibelleFacture("Facture de vente n°" + id)
        setNomClientFouFacture("Nom du client:")
        if (id) {
            fetch(`${process.env.REACT_APP_URL}/commandevente/getId`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        id: id,
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
                        setNomClientFou(data.commande.clientAll.raison_sociale)
                        setDate(new Date(data.commande.date).toLocaleDateString())
                        setAdresse(data.commande.clientAll.adresse)
                        setListeAllPiece(data.listePiece)
                        let prix = 0
                        data.listePiece.forEach(element => {
                            prix = prix + (element.quantite * element.prix_achat)
                        });
                        setPrixTot(prix)
                        
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }


    return (<>
        <ToastAff infoToast={infoToast} statutToast={statutToast}></ToastAff>
        <div className='flex-grow-1' style={{ marginTop: "100px" }}>
            <div class="invoice-container" ref={targetRef}>
                <h1 className='my-3'>{libelleFacture}</h1>
                <div class="invoice-header">
                    <div class="invoice-info">
                        <label for="customerName">{nomClientFouFacture}</label>
                        <div>{nomClientFou}</div>
                    </div>
                    <div class="invoice-info">
                        <label for="date">Date:</label>
                        <div>{date}</div>
                    </div>
                </div>
                <div class="invoice-header">
                    <div class="invoice-info">
                        <label for="customerName">Adresse:</label>
                        <div>{adresse}</div>
                    </div>
                </div>
                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>Article</th>
                            <th>Quantité</th>
                            <th>Prix Unitaire</th>
                            <th>Prix Total</th>
                        </tr>
                    </thead>
                    <tbody id="invoiceItems">
                        {listeAllPiece.map((elem) => {
                            return (<>
                                <tr>
                                    <td> {elem.libelle} </td>
                                    <td> {elem.quantite} </td>
                                    <td> {elem.prix_achat} €</td>
                                    <td> {elem.quantite * elem.prix_achat} €</td>
                                </tr></>)
                        })}
                    </tbody>
                </table>
                <div class="invoice-footer mt-5">
                    <span>Total: <span id="invoiceTotal">{prixTot}</span> €</span>
                </div>
            </div>
            <div className="w-100 d-flex justify-content-center mt-5 anim">
                <button onClick={() => toPDF()} className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }}><FontAwesomeIcon icon="fa-solid fa-file-pdf" />&nbsp;&nbsp; Générer la facture</button>
            </div>
        </div>
    </>
    );
}

export default Facture;
