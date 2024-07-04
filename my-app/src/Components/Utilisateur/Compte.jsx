import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../Style/App.css';
import { useEffect, useState } from 'react';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';
import { useJwt } from "react-jwt";

function Compte(props) {

    const [infoToast, setInfoToast] = useState("")
    const [statutToast, setStatutToast] = useState("")

    const { decodedToken, isExpired } = useJwt(localStorage.getItem("Token"));
    const [id, setId] = useState()

    const [nom, setNom] = useState("")
    const [prenom, setPrenom] = useState("")
    const [nom_uti, setNomUti] = useState("")
    const [roles, setRoles] = useState("")
    const [ancienMdp, setAncienMdp] = useState("")
    const [mdp, setMdp] = useState("")
    const [mdpConfirm, setMdpConfirm] = useState("")

    const [listeDroit, setListeDroit] = useState([])

    useEffect(() => {
        if (decodedToken) {
            setId(decodedToken.id_user)
            getUti(decodedToken.id_user)
        }
    }, [decodedToken])

    function getUti(id) {
        fetch(`${process.env.REACT_APP_URL}/utilisateur/getId`,
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
                    console.log(data);
                    setNom(data.utilisateur.nom)
                    setPrenom(data.utilisateur.prenom)
                    setNomUti(data.utilisateur.nom_uti)
                    let listeRoles = ""
                    data.droits.forEach(element => {
                        listeRoles += listeRoles===""?element.libelle:", " + element.libelle
                    });
                    setRoles(listeRoles)
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
    function update(id) {
        fetch(`${process.env.REACT_APP_URL}/utilisateur/updatemdp/${id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                body: JSON.stringify({
                    ancienmdp: ancienMdp,
                    mdp: mdp
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
                    setInfoToast("Mot de passe modifié avec succés")
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

    return (<>
        <ToastAff infoToast={infoToast} statutToast={statutToast}></ToastAff>
        <div className='flex-grow-1'>
            <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Informations utilisateur</h1></div>
            <div className="d-flex flex-wrap w-100 justify-content-evenly align-items-center">
                <div className="d-flex flex-column bg-body-secondary justify-content-center align-items-center list carte mt-5" style={{ width: "50%", height: '5%' }}>
                    <form className="mx-3 d-flex flex-wrap align-items-center justify-content-between form-floating my-2" style={{ width: "100%" }}>
                        <input type="text" className="form-control w-100" placeholder={'Nom'} value={nom} disabled={true}></input>
                        <label>Nom</label>
                    </form>
                    <form className="mx-3 d-flex flex-wrap align-items-center justify-content-between form-floating my-2" style={{ width: "100%" }}>
                        <input type="text" className="form-control w-100" placeholder={'Prénom'} value={prenom} disabled={true}></input>
                        <label>Prénom</label>
                    </form>
                    <form className="mx-3 d-flex flex-wrap align-items-center justify-content-between form-floating my-2" style={{ width: "100%" }}>
                        <input type="text" className="form-control w-100" placeholder={'Identifiant'} value={nom_uti} disabled={true}></input>
                        <label>Identifiant</label>
                    </form>
                    <form className="mx-3 d-flex flex-wrap align-items-center justify-content-between form-floating my-2" style={{ width: "100%" }}>
                        <input type="text" className="form-control w-100" placeholder={'Rôles'} value={roles} disabled={true}></input>
                        <label>Rôles</label>
                    </form>
                </div>
                <div className="d-flex flex-column bg-body-secondary justify-content-center align-items-center list carte mt-5" style={{ width: "40%", height: '5%' }}>
                    <h1 className="my-3">Modification du Mot de passe</h1>
                    <form className="mx-3 d-flex flex-wrap align-items-center justify-content-between form-floating my-3" style={{ width: "100%" }}>
                        <input type="password" className="form-control w-100" placeholder={'Ancien Mot de passe'} value={ancienMdp} onChange={(event) => { setAncienMdp(event.target.value) }}></input>
                        <label>Ancien Mot de passe</label>
                    </form>
                    <form className="mx-3 d-flex flex-wrap align-items-center justify-content-between form-floating my-3" style={{ width: "100%" }}>
                        <input type="password" className="form-control w-100" placeholder={'Mot de passe'} value={mdp} onChange={(event) => { setMdp(event.target.value) }}></input>
                        <label>Mot de passe</label>
                    </form>
                    <form className="mx-3 d-flex flex-wrap align-items-center justify-content-between form-floating my-3" style={{ width: "100%" }}>
                        <input type="password" className="form-control w-100" placeholder={'Confirmer le Mot de passe'} value={mdpConfirm} onChange={(event) => { setMdpConfirm(event.target.value) }}></input>
                        <label>Confirmer le Mot de passe</label>
                    </form>
                    <div className="w-100 d-flex justify-content-center mt-5 anim">
                        <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { update(id) }}><FontAwesomeIcon icon="fa-solid fa-pen-to-square" style={{ color: "#ffffff", }} />&nbsp;&nbsp; Modifier le mot de passe</button>
                    </div>
                </div>
            </div>

        </div>
    </>
    );
}

export default Compte;
