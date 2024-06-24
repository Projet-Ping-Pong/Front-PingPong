import '../../Style/App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Liste(props) {

    function buttonChangeProv(id) {
        if (props.prov === "machine") {
            return window.location.href = `/machinesCRUD?id=${id}`;
        }
        if (props.prov === "poste") {
            return window.location.href = `/postesCRUD?id=${id}`;
        }
        if (props.prov === "operation") {
            return window.location.href = `/operationsCRUD?id=${id}`;
        }
        if (props.prov === "gamme") {
            return window.location.href = `/gammesCRUD?id=${id}`;
        }
        if (props.prov === "piece") {
            return window.location.href = `/piecesCRUD?id=${id}`;
        }
    }

    function headChangeProv() {
        if (props.prov === "machine" || props.prov === "poste" || props.prov === "operation") {
            return <>
                <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>ID</b></div>
                <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate"><b>Libellé</b></div>
            </>
        }
        if (props.prov === "gamme") {
            return <>
                <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>ID</b></div>
                <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate"><b>Libellé</b></div>
                <div className="mx-3 border-end border-2 px-3 listRefPiece text-truncate"><b>Réf. Pièce</b></div>
                <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate"><b>Lib. Pièce</b></div>
            </>
        }
        if (props.prov === "piece") {
            return <>
                <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>Ref</b></div>
                <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate"><b>Libellé</b></div>
                <div className="mx-3 border-end border-2 px-3 listQte text-truncate"><b>Stock</b></div>
                <div className="mx-3 border-end border-2 px-3 listUnite text-truncate"><b>Unité</b></div>
            </>
        }
        if (props.prov === "realisation") {
            return <>
                <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>ID</b></div>
                <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate"><b>Libellé</b></div>
                <div className="mx-3 border-end border-2 px-3 listQte text-truncate"><b>Temps</b></div>
                <div className="mx-3 border-end border-2 px-3 listUnite text-truncate"><b>Poste</b></div>
                <div className="mx-3 border-end border-2 px-3 listUnite text-truncate"><b>Machine</b></div>
                <div className="mx-3 border-end border-2 px-3 listUnite text-truncate"><b>Date</b></div>
            </>
        }
    }

    return (<>
        <div className='flex-grow-1 d-flex'>
            <div className="d-flex flex-column align-items-center w-100">
                <div className="d-flex align-items-center bg-body-secondary list carte my-1 justify-content-between mb-3 border-bottom border-5" style={{ width: "85%", height: '13%' }}>
                    <div className="mx-3 d-flex align-items-center w-75">
                        {headChangeProv()}
                    </div>
                </div>
                {props.rechercheResult.map((elem, index) => {
                    return (
                        <>
                            <div className="d-flex align-items-center bg-body-secondary list carte my-1 justify-content-between" style={{ width: "85%", height: '15%' }}>
                                <div className="mx-3 d-flex align-items-center w-75">
                                    {
                                        (props.prov === "machine" || props.prov === "poste" || props.prov === "operation") &&
                                        <>
                                            <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>{elem.id}</b></div>
                                            <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.libelle}</div>
                                        </>
                                    }
                                    {
                                        (props.prov === "gamme") &&
                                        <>
                                            <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>{elem.id}</b></div>
                                            <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.libelle}</div>
                                            <div className="mx-3 border-end border-2 px-3 listRefPiece text-truncate">{elem.id_piece}</div>
                                            <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.lib_piece}</div>
                                        </>
                                    }
                                    {
                                        (props.prov === "piece") &&
                                        <>
                                            <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>{elem.id}</b></div>
                                            <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.libelle}</div>
                                            <div className="mx-3 border-end border-2 px-3 listQte text-truncate">{elem.stock}</div>
                                            <div className="mx-3 border-end border-2 px-3 listUnite text-truncate">{elem.unite}</div>
                                        </>
                                    }
                                    {
                                        (props.prov === "realisation") &&
                                        <>
                                            <div className="mx-3 border-end border-2 px-3 listId text-truncate"><b>{elem.id}</b></div>
                                            <div className="mx-3 border-end border-2 px-3 listLibelle text-truncate">{elem.libelle}</div>
                                            <div className="mx-3 border-end border-2 px-3 listQte text-truncate">{elem.temps}</div>
                                            <div className="mx-3 border-end border-2 px-3 listUnite text-truncate">{elem.poste_lib}</div>
                                            <div className="mx-3 border-end border-2 px-3 listUnite text-truncate">{elem.machine_lib}</div>
                                            <div className="mx-3 border-end border-2 px-3 listUnite text-truncate">{elem.date}</div>
                                        </>
                                    }
                                </div>

                                <div className="mx-3 w-25 d-flex justify-content-end">
                                    {
                                        (props.prov === "gamme" || props.prov === "piece") && elem.id_gamme !== null && elem.id_piece !== null &&
                                        <>
                                            <button onClick={
                                                () => {
                                                    if(props.prov === "gamme"){
                                                        window.location.href = `/fabrications?id=${elem.id}`;
                                                        sessionStorage.setItem("Provenance", "fabrication")
                                                    }else{
                                                        window.location.href = `/fabrications?id=${elem.id_gamme}`;
                                                        sessionStorage.setItem("Provenance", "fabrication")
                                                    }
                                                    
                                                }
                                            } className="btn border border-2 mx-1 button bg-primary" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                                data-bs-title="Fabriquer"><FontAwesomeIcon icon="fa-solid fa-screwdriver-wrench" style={{ color: "#ffffff", }} /></button>
                                        </>
                                    }
                                    {props.prov !== "realisation" ? <><button onClick={
                                        () => {
                                            buttonChangeProv(elem.id)
                                            sessionStorage.setItem("Provenance", "details")
                                        }
                                    }
                                        className="btn border border-2 mx-1 button bg-primary" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                        data-bs-title="Détails"><FontAwesomeIcon icon="fa-solid fa-magnifying-glass" style={{ color: "#ffffff", }} /></button>
                                    <button onClick={
                                        () => {
                                            buttonChangeProv(elem.id)
                                            sessionStorage.setItem("Provenance", "update")
                                        }
                                    } className="btn border border-2 mx-1 button bg-primary" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                        data-bs-title="Modifier"><FontAwesomeIcon icon="fa-solid fa-pen-to-square" style={{ color: "#ffffff", }} /></button>
                                    <button onClick={() => { props.deleteElem(elem.id) }} className="btn border border-2 mx-1 button bg-danger" type="button"><FontAwesomeIcon icon="fa-solid fa-trash" style={{ color: "#ffffff", }} /></button>
                                    </>:<button onClick={
                                        () => {
                                            buttonChangeProv(elem.id)
                                            sessionStorage.setItem("Provenance", "details")
                                        }
                                    }
                                        className="btn border border-2 mx-1 button bg-primary" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                        data-bs-title="Détails"><FontAwesomeIcon icon="fa-solid fa-magnifying-glass" style={{ color: "#ffffff", }} /></button>}
                                </div>
                            </div>
                        </>)
                })}
            </div>
        </div>
    </>
    );
}

export default Liste;
