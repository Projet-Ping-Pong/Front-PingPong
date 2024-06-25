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

function App() {

  const { decodedToken, isExpired } = useJwt(localStorage.getItem("Token"));
  const [ utiInfo, setUtiInfo ] = useState({})
  const [ utiDroit, setUtiDroit ] = useState("")

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
        }
        if(element.libelle === "Atelier" && element.niveau === 2){
          setUtiDroit("Resp_Atelier")
        }
        if(element.libelle === "Admin"){
          setUtiDroit("Admin")
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


  return (
    <>
      {!localStorage.getItem("Token") ? <Login></Login> :
        <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
          <NavBar />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Accueil />} />
              <Route path="/accueil" element={<Accueil uti={utiInfo} droit={utiDroit}/>} />
              <Route path="/pieces" element={<PieceList uti={utiInfo} droit={utiDroit}/>} />
              <Route path="/piecesCRUD" element={<Piece uti={utiInfo} droit={utiDroit}/>} />
              <Route path="/machines" element={<MachineList uti={utiInfo} droit={utiDroit}/>} />
              <Route path="/machinesCRUD" element={<Machine uti={utiInfo} droit={utiDroit}/>} />
              <Route path="/postes" element={<PosteList uti={utiInfo} droit={utiDroit}/>} />
              <Route path="/postesCRUD" element={<Poste uti={utiInfo} droit={utiDroit}/>} />
              <Route path="/operations" element={<OperationList uti={utiInfo} droit={utiDroit}/>} />
              <Route path="/operationsCRUD" element={<Operation uti={utiInfo} droit={utiDroit}/>} />
              <Route path="/gammes" element={<GammeList uti={utiInfo} droit={utiDroit}/>} />
              <Route path="/gammesCRUD" element={<Gamme uti={utiInfo} droit={utiDroit}/>} />
              <Route path="/fabrications" element={<Fabrication uti={utiInfo} droit={utiDroit}/>} />
              <Route path="/realisations" element={<RealisationListe uti={utiInfo} droit={utiDroit}/>} />
            </Routes>
          </BrowserRouter>
          <Footer />
        </div>}
    </>
  );
}

export default App;
