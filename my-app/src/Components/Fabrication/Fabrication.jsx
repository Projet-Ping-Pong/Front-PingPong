import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../Style/App.css';
import { useEffect, useState } from 'react';
import Toast from 'bootstrap/js/dist/toast';
import ToastAff from '../Toast';
import { debounce } from 'lodash';

function Fabrication(props) {

    const [infoToast, setInfoToast] = useState('')
    const [statutToast, setStatutToast] = useState('')

    const [id, setId] = useState()
    const [idPiece, setIdPiece] = useState()
    const [libGamme, setLibGamme] = useState()
    const [libPiece, setLibPiece] = useState()

    const [rechercheResultPoste, setRechercheResultPoste] = useState([])
    const [rechercheResultPosteAff, setRechercheResultPosteAff] = useState([])

    const [rechercheResultMachine, setRechercheResultMachine] = useState([])
    const [rechercheResultMachineAff, setRechercheResultMachineAff] = useState([])

    const [rechercheOpResult, setRechercheOpResult] = useState([])

    const [disbleMachine, setDisableMachine] = useState(true)

    const [tabRea, setTabRea] = useState([])

    useEffect(() => {
        if(rechercheResultPosteAff[0]){
            setDisableMachine(false)
        }else{
            setDisableMachine(true)
        } 
        props.verifyDroit("Atelier")
    })

    useEffect(() => {
        const search = window.location.search; // returns the URL query String
        const params = new URLSearchParams(search);
        const IdFromURL = params.get('id');
        var id_piece = 0
        setId(IdFromURL)

        fetch(`${process.env.REACT_APP_URL}/gamme/getId`,
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
                    setLibGamme(data.gamme.libelle)
                    if(data.piece){
                        setIdPiece(data.piece.id)
                        setLibPiece(data.piece.libelle)
                    }
                    setRechercheOpResult(data.operations)
                }
            })
            .catch(error => {
                console.log(error)
            });
    }, [])

    const recherchePoste = (rechercheLib) => {
        if (rechercheLib !== "") {
            fetch(`${process.env.REACT_APP_URL}/poste/rechPosteByQual`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        id_uti: props.uti.id_uti,
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

    const rechercheMachine = (rechercheLib) => {
        if (rechercheLib !== "") {
            fetch(`${process.env.REACT_APP_URL}/postemachine/rechLibelle`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                    body: JSON.stringify({
                        id_poste: rechercheResultPosteAff[0].id,
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
                        console.log(data);
                        setRechercheResultMachine(data)
                    }

                })
                .catch(error => {
                    setInfoToast(error)
                    setStatutToast('error')
                    new Toast(document.querySelector('.toast')).show()
                });
        } else {
            setRechercheResultMachine([])
        }
    }

    function addListePoste(id, libelle, index) {

        const tab = [{
            id: id,
            libelle: libelle
        }]
        document.getElementById("recherchePoste" + index).value = libelle;
        document.getElementById("recherchePoste" + index).setAttribute("id_poste",id)
        setRechercheResultPosteAff(tab)
        setRechercheResultPoste([])

    }

    function addListeMachine(id, libelle, index) {

        const tab = [{
            id: id,
            libelle: libelle
        }]
        document.getElementById("rechercheMachine" + index).value = libelle;
        document.getElementById("rechercheMachine" + index).setAttribute("id_machine",id)
        setRechercheResultMachineAff(tab)
        setRechercheResultMachine([])

    }

    function finFab(){
        let tabFinFab = []
        for (let i = 0; i < rechercheOpResult.length; i++) {
            let rea = {}
            const poste = parseInt(document.getElementById("recherchePoste"+i).getAttribute("id_poste"))
            const machine = parseInt(document.getElementById("rechercheMachine"+i).getAttribute("id_machine"))
            const temps = document.getElementById("rechercheTemps"+i).value
            let date = document.getElementById("rechercheDate"+i).value
            if(!date){ date = new Date().toISOString().slice(0, 10)}
            rea = {
                libelle: rechercheOpResult[i].libelle,
                temps: temps?temps:rechercheOpResult[i].temps,
                date: date,
                id_piece: idPiece,
                id_poste: poste?poste:rechercheOpResult[i].id_poste,
                id_machine : machine?machine:rechercheOpResult[i].id_machine,
                id_uti : props.uti.id_uti
            }
            tabFinFab.push(rea)
        }
        fetch(`${process.env.REACT_APP_URL}/realisation/add`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Token')}` },
                body: JSON.stringify({
                    listeRea: tabFinFab,
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.erreur != null) {
                    // Erreur, phrase définie dans le back
                    setInfoToast(data.erreur)
                    setStatutToast('error')
                    new Toast(document.querySelector('.toast')).show()
                }else{
                    localStorage.setItem("Toast", "success")
                    window.location.href = '/realisations';
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
        <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Fabrication</h1></div>
        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap bg-body-secondary justify-content-between list carte" style={{ width: "85%", height: '5%' }}>
                <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "20%" }}>
                    <input type="text" className="form-control w-100" id="floatingInputLibelle" placeholder={'Réf. Pièce'} value={idPiece} onChange={(event) => { setIdPiece(event.target.value) }} disabled={true}></input>
                    <label for="floatingInputLibelle">Réf. Pièce</label>
                </form>
                <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "30%" }}>
                    <input type="text" className="form-control w-100" id="floatingInputLibelle" placeholder={'Libellé Pièce'} value={libPiece} onChange={(event) => { setLibPiece(event.target.value) }} disabled={true}></input>
                    <label for="floatingInputLibelle">Libellé Pièce</label>
                </form>
                <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "30%" }}>
                    <input type="text" className="form-control w-100" id="floatingInputLibelle" placeholder={'Libellé Gamme'} value={libGamme} onChange={(event) => { setLibGamme(event.target.value) }} disabled={true}></input>
                    <label for="floatingInputLibelle">Libellé Gamme</label>
                </form>
            </div>
        </div>
        <div className='flex-grow-1'>
            <div className="d-flex flex-column align-items-center w-100 anim mb-5" style={{ paddingTop: "50px" }}><h1>Liste des opérations</h1></div>
            {rechercheOpResult.map((elem, index) => {
                const collapse = `collapse${index}`
                return (<>
                    <div className="d-flex flex-column align-items-center w-100">
                        <button className="btn d-flex align-items-center bg-body-secondary list carte my-1 justify-content-between" data-bs-toggle="collapse" data-bs-target={`#${collapse}`} aria-expanded="false" aria-controls="collapseExample" style={{ width: "85%", height: '15%' }}>
                            <div className="mx-3 d-flex align-items-center w-75">
                                <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>{elem.id}</b></div>
                                <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.libelle}</div>
                                <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.temps}</div>
                                <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.poste ? elem.poste : "N/A"}</div>
                                <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.machine ? elem.machine : "N/A"}</div>
                            </div>
                            <div className="mx-3 w-25 d-flex justify-content-end">
                                <button className="btn w-25" type="button" data-bs-toggle="collapse" data-bs-target={`#${collapse}`} aria-expanded="false" aria-controls="collapseExample">
                                    <FontAwesomeIcon icon="fa-solid fa-chevron-down" />
                                </button>
                            </div>
                        </button>
                    </div>
                    <div className="collapse" id={collapse}>
                        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%" }}>
                            <div className="d-flex flex-wrap bg-body-secondary list carte mb-3" style={{ width: "85%", height: '5%' }}>
                                <div className="d-flex flex-column align-items-center w-100">
                                    <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "93%" }}>
                                        <textarea type="textarea" rows="5" id="floatingInputDescription" className="form-control w-100" placeholder={'Description'} disabled={true}>{elem.description}</textarea>
                                        <label for="floatingInputDescription">Description</label>
                                    </form>
                                </div>
                                <div className="d-flex flex-wrap justify-content-evenly mt-3" style={{ width: "100%", height: '5%' }}>
                                    <form className="mx-3 d-flex flex-wrap align-items-center justify-content-between form-floating" style={{ width: "20%" }}>
                                        <input type="text" className="form-control w-100" id={"recherchePoste" + index} id_poste="" placeholder={'Poste'} onChange={debounce((event) => { recherchePoste(event.target.value) }, 500)}></input>
                                        <label for={"recherchePoste" + index}>Poste</label>
                                        <div className="d-flex flex-column align-items-center w-100">
                                            <div className="d-flex align-items-center justify-content-between" style={{ width: "100%" }}>
                                                {rechercheResultPoste.length > 0 && <div className="input-group anim border border-2">
                                                    {rechercheResultPoste.map((elem) => {
                                                        return (<>
                                                            <div onClick={() => { addListePoste(elem.id, elem.libelle, index) }} className="d-flex align-items-center my-1 mx-2 rechercheListe w-100">
                                                                <div className='mx-2'><b>{elem.id}</b> - {elem.libelle}</div>
                                                            </div></>)
                                                    })}
                                                </div>}
                                            </div>
                                        </div>
                                    </form>

                                    <form className="mx-3 d-flex flex-wrap align-items-center justify-content-between form-floating" style={{ width: "20%" }}>
                                        <input type="text" className="form-control w-100" id={"rechercheMachine" + index} id_machine="" placeholder={'Machine'} onChange={debounce((event) => { rechercheMachine(event.target.value) }, 500)} disabled={disbleMachine}></input> {/* disabled={document.getElementById("recherchePoste" + index).indexHTML?false:true} */}
                                        <label for={"rechercheMachine" + index}>Machine</label>
                                        <div className="d-flex flex-column align-items-center w-100">
                                            <div className="d-flex align-items-center justify-content-between" style={{ width: "100%" }}>
                                                {rechercheResultMachine.length > 0 && <div className="input-group anim border border-2">
                                                    {rechercheResultMachine.map((elem) => {
                                                        return (<>
                                                            <div onClick={() => { addListeMachine(elem.id, elem.libelle, index) }} className="d-flex align-items-center my-1 mx-2 rechercheListe w-100">
                                                                <div className='mx-2'><b>{elem.id}</b> - {elem.libelle}</div>
                                                            </div></>)
                                                    })}
                                                </div>}
                                            </div>
                                        </div>
                                    </form>
                                
                                    <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "20%" }}>
                                        <input type="text" className="form-control w-100" id={"rechercheTemps" + index} placeholder={'Temps'}></input>
                                        <label for={"rechercheTemps" + index}>Temps</label>
                                    </form>
                                    <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "20%" }}>
                                        <input type="date" className="form-control w-100" id={"rechercheDate" + index} placeholder={'Date'} pattern='(?:((?:0[1-9]|1[0-9]|2[0-9])\/(?:0[1-9]|1[0-2])|(?:30)\/(?!02)(?:0[1-9]|1[0-2])|31\/(?:0[13578]|1[02]))\/(?:19|20)[0-9]{2})'></input>
                                        <label for={"rechercheDate" + index}>Date</label>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div></>)
            })}

            <div className="w-100 d-flex justify-content-center mt-5 anim">
               <button className="btn border border-2 px-4 button bg-primary" type="button" style={{ color: "#ffffff", }} onClick={() => { finFab() }}><FontAwesomeIcon icon="fa-solid fa-screwdriver-wrench" style={{ color: "#ffffff", }} />&nbsp;&nbsp; Terminer la fabrication</button>
            </div>
        </div>
    </>
    );
}

export default Fabrication;
