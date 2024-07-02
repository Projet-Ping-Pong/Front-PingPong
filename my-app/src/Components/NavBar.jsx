import '../Style/App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../Assets/logo.jpg';

function NavBar(props) {

    function logout() {
        localStorage.setItem("Token", "")
        window.location.href = '/';
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg fixed-top border-bottom border-2" style={{
                backgroundColor: "white"
            }}>
                <div className="container-fluid">
                    <img className="imgLangue d-flex" src={logo} style={{ maxWidth: '3%' }} alt='logo'></img>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {props.service === "Atelier" &&
                                <>
                                    <li className="nav-item">
                                        <a href='/accueil' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-house" className='me-3' />Accueil</button></a>
                                    </li>
                                    <li className="nav-item">
                                        <a href='/pieces' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-table-tennis-paddle-ball" className='me-3' />Pièces</button></a>
                                    </li>
                                    <li className="nav-item">
                                        <a href='/gammes' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-list-check" className='me-3' />Gammes</button></a>
                                    </li>
                                    <li className="nav-item">
                                        <a href='/operations' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-gear" className='me-3' />Opérations</button></a>
                                    </li>
                                    <li className="nav-item">
                                        <a href='/postes' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-computer" className='me-3' />Postes</button></a>
                                    </li>
                                    <li className="nav-item">
                                        <a href='/machines' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-desktop" className='me-3' />Machines</button></a>
                                    </li>
                                    <li className="nav-item">
                                        <a href='/realisations' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-screwdriver-wrench" className='me-3' />Réalisations</button></a>
                                    </li>
                                </>
                            }
                            {props.service === "Commerce" &&
                                <>
                                    <li className="nav-item">
                                        <a href='/accueil' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-house" className='me-3' />Accueil</button></a>
                                    </li>
                                    <li className="nav-item">
                                        <a href='/devis' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-file" className='me-3' />Devis</button></a>
                                    </li>
                                    <li className="nav-item">
                                        <a href='/commandesventes' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-cart-flatbed" className='me-3' />Commande de vente</button></a>
                                    </li>
                                    <li className="nav-item">
                                        <a href='/commandesachats' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-cart-plus" className='me-3' />Commande d'achat</button></a>
                                    </li>
                                    <li className="nav-item">
                                        <a href='/clientsfournisseurs' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-users" className='me-3' />Clients / Fournisseurs</button></a>
                                    </li>
                                </>
                            }
                            {props.service === "Admin" &&
                                <>
                                    <li className="nav-item">
                                        <a href='/accueil' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-house" className='me-3' />Accueil</button></a>
                                    </li>
                                    <li className="nav-item">
                                        <div class="dropdown nav-link">
                                            <a class="dropdown-toggle nav-link active border-start px-4 border-2 buttonnav" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <FontAwesomeIcon icon="fa-solid fa-screwdriver-wrench" className='me-3' />Atelier
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li className="dropdown-item">
                                                    <a href='/pieces' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-table-tennis-paddle-ball" className='me-3' />Pièces</button></a>
                                                </li>
                                                <li className="dropdown-item">
                                                    <a href='/gammes' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-list-check" className='me-3' />Gammes</button></a>
                                                </li>
                                                <li className="dropdown-item">
                                                    <a href='/operations' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-gear" className='me-3' />Opérations</button></a>
                                                </li>
                                                <li className="dropdown-item">
                                                    <a href='/postes' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-computer" className='me-3' />Postes</button></a>
                                                </li>
                                                <li className="dropdown-item">
                                                    <a href='/machines' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-desktop" className='me-3' />Machines</button></a>
                                                </li>
                                                <li className="dropdown-item">
                                                    <a href='/realisations' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-screwdriver-wrench" className='me-3' />Réalisations</button></a>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li className="nav-item">
                                        <div class="dropdown nav-link">
                                            <a class="dropdown-toggle nav-link active border-start px-4 border-2 buttonnav" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <FontAwesomeIcon icon="fa-solid fa-screwdriver-wrench" className='me-3' />Commerce
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li className="dropdown-item">
                                                    <a href='/devis' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-file" className='me-3' />Devis</button></a>
                                                </li>
                                                <li className="dropdown-item">
                                                    <a href='/commandesventes' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-cart-flatbed" className='me-3' />Commande de vente</button></a>
                                                </li>
                                                <li className="dropdown-item">
                                                    <a href='/commandesachats' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-cart-plus" className='me-3' />Commande d'achat</button></a>
                                                </li>
                                                <li className="dropdown-item">
                                                    <a href='/clientsfournisseurs' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-users" className='me-3' />Clients / Fournisseurs</button></a>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li className="nav-item">
                                        <a href='/utilisateurs' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-house" className='me-3' />Utilisateurs</button></a>
                                    </li>
                                    <li className="nav-item">
                                        <a href='/droits' className='nav-link'><button className="nav-link active border-start px-4 border-2 buttonnav" aria-current="page"><FontAwesomeIcon icon="fa-solid fa-house" className='me-3' />Droits</button></a>
                                    </li>


                                </>
                            }
                        </ul>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <button className="nav-link active text-body p-2 btn border border-2 button px-4" type="button"><FontAwesomeIcon icon="fa-solid fa-user" />&nbsp;&nbsp; {localStorage.getItem("Nom_uti")}</button>
                        <button className="nav-link active mx-4 text-body border-start ps-4 border-2" aria-current="page" onClick={() => { logout() }}><FontAwesomeIcon icon="fa-solid fa-right-to-bracket" /></button>
                    </div>
                </div>
            </nav>
        </>);
}

export default NavBar;
