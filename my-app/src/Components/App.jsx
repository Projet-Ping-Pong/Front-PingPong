import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../Style/App.css';
import Login from './Login';
import Accueil from './Accueil';
import NavBar from './NavBar';
import Footer from './Footer';
import PieceList from './Piece/PieceList';
import MachineList from './Machine/MachineList';
import Piece from './Piece/Piece';
import Machine from './Machine/Machine';
import PosteList from './Poste/PosteList';
import Poste from './Poste/Poste';
import OperationList from './Operation/OperationList';
import Operation from './Operation/Operation';
import GammeList from './Gamme/GammeList';
import Gamme from './Gamme/Gamme';
import Fabrication from './Fabrication/Fabrication';
import RealisationListe from './Realisation/RealisationListe';
import { useEffect, useState } from 'react';
import { useJwt } from "react-jwt";
import Realisation from './Realisation/Realisation';

function App() {

  const { decodedToken, isExpired } = useJwt(localStorage.getItem("Token"));
  const [ utiInfo, setUtiInfo ] = useState({})
  const [ utiDroit, setUtiDroit ] = useState("")
  const [ utiService, setUtiService ] = useState("")

  useEffect(() => {
    setUtiInfo({
      id_uti: decodedToken?decodedToken.id_user:null,
      nom_uti: decodedToken?decodedToken.name_user:null,
      droits: decodedToken?decodedToken.droits:null
    })
    if(decodedToken !== null){
      decodedToken.droits.forEach(element => {
        if(element.libelle === "Atelier" && element.niveau === 1){
          setUtiDroit("Atelier")
          setUtiService("Atelier")
        }
        if(element.libelle === "Atelier" && element.niveau === 2){
          setUtiDroit("RespAtelier")
          setUtiService("Atelier")
        }
        if(element.libelle === "Admin"){
          setUtiDroit("Admin")
        }
        if(element.libelle === "Commerce" && element.niveau === 1){
          setUtiDroit("Commerce")
          setUtiService("Commerce")
        }
      });
    }
    if (isExpired) {
      if(localStorage.getItem("Token") != ""){
        window.location.href = '/login';
      }
      localStorage.setItem("Token", "")
    }
  },[decodedToken])

  function verifyDroit(service){
    if(utiDroit){
      if(service === "Atelier" && (utiDroit !== "Atelier" && utiDroit !== "RespAtelier")){
        window.location.href = '/accueil';
      }
      if(!service === "Commerce" && utiDroit !== "Commerce"){
        window.location.href = '/accueil';
      }
    }
  }

  return (
    <>
      {!localStorage.getItem("Token") ? <Login></Login> :
        <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
          <NavBar service={utiService}/>
          <BrowserRouter>
            <Routes>
              <Route path="/"                   element={<Accueil uti={utiInfo}           droit={utiDroit}    service={utiService} />} />
              <Route path="/accueil"            element={<Accueil uti={utiInfo}           droit={utiDroit}    service={utiService} />} />
              <Route path="/pieces"             element={<PieceList uti={utiInfo}         droit={utiDroit}    verifyDroit={(service) => verifyDroit(service)} />} />
              <Route path="/piecesCRUD"         element={<Piece uti={utiInfo}             droit={utiDroit}    verifyDroit={(service) => verifyDroit(service)} />} />
              <Route path="/machines"           element={<MachineList uti={utiInfo}       droit={utiDroit}    verifyDroit={(service) => verifyDroit(service)} />} />
              <Route path="/machinesCRUD"       element={<Machine uti={utiInfo}           droit={utiDroit}    verifyDroit={(service) => verifyDroit(service)} />} />
              <Route path="/postes"             element={<PosteList uti={utiInfo}         droit={utiDroit}    verifyDroit={(service) => verifyDroit(service)} />} />
              <Route path="/postesCRUD"         element={<Poste uti={utiInfo}             droit={utiDroit}    verifyDroit={(service) => verifyDroit(service)} />} />
              <Route path="/operations"         element={<OperationList uti={utiInfo}     droit={utiDroit}    verifyDroit={(service) => verifyDroit(service)} />} />
              <Route path="/operationsCRUD"     element={<Operation uti={utiInfo}         droit={utiDroit}    verifyDroit={(service) => verifyDroit(service)} />} />
              <Route path="/gammes"             element={<GammeList uti={utiInfo}         droit={utiDroit}    verifyDroit={(service) => verifyDroit(service)} />} />
              <Route path="/gammesCRUD"         element={<Gamme uti={utiInfo}             droit={utiDroit}    verifyDroit={(service) => verifyDroit(service)} />} />
              <Route path="/fabrications"       element={<Fabrication uti={utiInfo}       droit={utiDroit}    verifyDroit={(service) => verifyDroit(service)} />} />
              <Route path="/realisations"       element={<RealisationListe uti={utiInfo}  droit={utiDroit}    verifyDroit={(service) => verifyDroit(service)} />} />
              <Route path="/realisationsCRUD"   element={<Realisation uti={utiInfo}       droit={utiDroit}    verifyDroit={(service) => verifyDroit(service)} />} />
            </Routes>
          </BrowserRouter>
          <Footer />
        </div>}
    </>
  );
}

export default App;
