import { useEffect, useState } from 'react';
import '../../Style/App.css';
import Toast from 'bootstrap/js/dist/toast';

function Realisation(props) {

    const [provenance] = useState(sessionStorage.getItem("Provenance"))

    const [refPiece, setRefPiece] = useState("")
    const [libPiece, setLibPiece] = useState("")

    const [id, setId] = useState("")
    const [lib, setLib] = useState("")

    const [desc, setDesc] = useState("")

    const [poste, setPoste] = useState("")
    const [machine, setMachine] = useState("")
    const [temps, setTemps] = useState("")
    const [date, setDate] = useState("")
    const [uti, setUti] = useState("")

    const [infoToast, setInfoToast] = useState("")
    const [statutToast, setStatutToast] = useState("")

    const [rechercheResult, setRechercheResult] = useState()


    useEffect(() => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const IdFromURL = params.get('id');
        setId(IdFromURL)

        fetch(`${process.env.REACT_APP_URL}/realisation/getById`,
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
                    setRefPiece(data[0].id_piece)
                    setLibPiece(data[0].piece_lib)
                    setId(data[0].id)
                    setLib(data[0].libelle)
                    setDesc(data[0].description)
                    setPoste(data[0].poste_lib)
                    setMachine(data[0].machine_lib)
                    setTemps(data[0].temps)
                    setDate(data[0].date)
                    setUti(data[0].nom_uti)
                }
            })
            .catch(error => {
                console.log(error)
            });
    }, [])

    return (<>
        <div className='flex-grow-1'>
            <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Détails des réalisations</h1></div>
            <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
                <div className="d-flex flex-wrap bg-body-secondary justify-content-evenly list carte" style={{ width: "85%", height: '5%' }}>
                    <form className="mx-3 d-flex-wrap align-items-center justify-content-between form-floating" style={{ width: "40%" }}>
                        <input type="text" className="form-control w-100" id="piece" placeholder={'Ref. Pièce'} value={refPiece} disabled={true}></input>
                        <label for="piece">Ref. Pièce</label>
                    </form>
                    <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "40%" }}>
                        <input type="text" className="form-control w-100" id="floatingInputLibelle" placeholder={'Libellé Pièce'} value={libPiece} disabled={true}></input>
                        <label for="floatingInputLibelle">Libellé Pièce</label>
                    </form>
                </div>
            </div>
            <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "15px" }}>
                <div className="d-flex flex-wrap bg-body-secondary justify-content-evenly list carte" style={{ width: "85%", height: '5%' }}>
                    <form className="mx-3 d-flex-wrap align-items-center justify-content-between form-floating" style={{ width: "10%" }}>
                        <input type="text" className="form-control w-100" id="piece" placeholder={'ID'} value={id} disabled={true}></input>
                        <label for="piece">ID</label>
                    </form>
                    <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "60%" }}>
                        <input type="text" className="form-control w-100" id="floatingInputLibelle" placeholder={'Libellé'} value={lib} disabled={true}></input>
                        <label for="floatingInputLibelle">Libellé</label>
                    </form>
                    <form className="mx-3 d-flex align-items-center justify-content-between form-floating" style={{ width: "20%" }}>
                        <input type="text" className="form-control w-100" id="floatingInputLibelle" placeholder={'Utilisateur'} value={uti} disabled={true}></input>
                        <label for="floatingInputLibelle">Utilisateur</label>
                    </form>
                </div>
            </div>
            <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "15px" }}>
                <div className="d-flex flex-wrap bg-body-secondary justify-content-evenly list carte" style={{ width: "85%", height: '5%' }}>
                    <form className="mx-3 d-flex-wrap align-items-center justify-content-between form-floating" style={{ width: "95%" }}>
                        <textarea type="text" className="form-control w-100" id="piece" placeholder={'Description'} value={desc} disabled={true}></textarea>
                        <label for="piece">Description</label>
                    </form>
                </div>
            </div>
            <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "15px" }}>
                <div className="d-flex flex-wrap bg-body-secondary justify-content-evenly list carte" style={{ width: "85%", height: '5%' }}>
                    <form className="mx-3 d-flex-wrap align-items-center justify-content-between form-floating" style={{ width: "20%" }}>
                        <input type="text" className="form-control w-100" id="piece" placeholder={'Poste'} value={poste} disabled={true}></input>
                        <label for="piece">Poste</label>
                    </form>
                    <form className="mx-3 d-flex-wrap align-items-center justify-content-between form-floating" style={{ width: "20%" }}>
                        <input type="text" className="form-control w-100" id="piece" placeholder={'Machine'} value={machine} disabled={true}></input>
                        <label for="piece">Machine</label>
                    </form>
                    <form className="mx-3 d-flex-wrap align-items-center justify-content-between form-floating" style={{ width: "20%" }}>
                        <input type="text" className="form-control w-100" id="piece" placeholder={'Temps'} value={temps} disabled={true}></input>
                        <label for="piece">Temps</label>
                    </form>
                    <form className="mx-3 d-flex-wrap align-items-center justify-content-between form-floating" style={{ width: "20%" }}>
                        <input type="date" className="form-control w-100" id="piece" placeholder={'Date'} value={date} disabled={true}></input>
                        <label for="piece">Date</label>
                    </form>
                </div>
            </div>
        </div>
    </>
    );
}

export default Realisation;
