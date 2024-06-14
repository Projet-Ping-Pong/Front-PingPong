import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../Style/App.css';

function PieceAjout(props) {

    return (<>
        <div className="d-flex flex-column align-items-center w-100 anim" style={{ paddingTop: "100px" }}><h1>Ajout des pièces</h1></div>
        <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
            <div className="d-flex flex-wrap bg-body-secondary list carte mb-3" style={{ width: "85%", height: '5%' }}>
                <div className="mx-3 d-flex align-items-center justify-content-between w-100 mb-3">
                    <input type="text" className="form-control w-25" placeholder={'Référence'}></input>
                    <input type="text" className="form-control w-25" placeholder={'Prix de vente'}></input>
                    <input type="text" className="form-control w-25" placeholder={'Quantité'}></input>
                </div>
                <div className="mx-3 d-flex align-items-center justify-content-between w-100">
                    <input type="text" className="form-control w-25" placeholder={'Libellé'}></input>
                    <input type="text" className="form-control w-25" placeholder={'Prix catalogue'}></input>
                    <input type="text" className="form-control w-25" placeholder={'Unité'}></input>
                </div>
            </div>
            <div className="d-flex flex-wrap bg-body-secondary list carte" style={{ width: "85%", height: '5%' }}>
                <div className="mx-3 d-flex align-items-center justify-content-between w-100">
                    <select class="form-select w-25">
                        <option selected>Responsable</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>

                    <select class="form-select w-25">
                        <option selected>Type</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                    <div className="w-25"></div>
                </div>
            </div>
        </div>

        <div className='flex-grow-1'>
            <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
                <div className="d-flex flex-wrap" style={{ width: "85%" }}>
                    <div className="bg-body-secondary d-flex justify-content-between list carte w-25">
                        <div className="d-flex align-items-center justify-content-center w-75">Gérer la gamme </div>
                        <button class="btn w-25" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                            <FontAwesomeIcon icon="fa-solid fa-chevron-down" />
                        </button>
                    </div>
                </div>
            </div>
            <div class="collapse" id="collapseExample">
                    <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%" }}>
                        <div className="d-flex flex-wrap bg-body-secondary list carte mb-3" style={{ width: "85%", height: '5%' }}>
                            <div className="mx-3 d-flex align-items-center justify-content-between w-100 mb-3">
                                <input type="text" className="form-control w-100" placeholder={'Libellé'}></input>
                            </div>
                            <div className="mx-3 d-flex align-items-center justify-content-between w-100">
                                <textarea type="text" className="form-control w-100" placeholder={'Description'}></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            <div className="d-flex flex-column align-items-center w-100" style={{ width: "85%", paddingTop: "50px" }}>
                <div className="d-flex flex-wrap" style={{ width: "85%" }}>
                    <div className="bg-body-secondary d-flex justify-content-between list carte mb-3 w-25">
                        <div className="d-flex align-items-center justify-content-center w-75">Gérer la composition </div>
                        <button className="btn w-25" type="button"><FontAwesomeIcon icon="fa-solid fa-chevron-down" /></button>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}

export default PieceAjout;
