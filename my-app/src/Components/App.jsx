import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import '../Style/App.css';
import Login from './Login';
import Accueil from './Accueil';
import NavBar from './NavBar';
import Footer from './Footer';
import PieceList from './Piece/PieceList';
import MachineList from './Machine/MachineList';
import Piece from './Piece/Piece';
import { useEffect } from 'react';
import Machine from './Machine/Machine';
import PosteList from './Poste/PosteList';
import Poste from './Poste/Poste';
import OperationList from './Operation/OperationList';
import Operation from './Operation/Operation';
import GammeList from './Gamme/GammeList';
import Gamme from './Gamme/Gamme';


function App() {

  return (
    <>
      {!localStorage.getItem("Token") ? <Login></Login> :
        <div className="d-flex flex-column" style={{ minHeight: "100vh"}}>
          <NavBar />
            <BrowserRouter>
              <Routes>
                <Route path="/accueil" element={<Accueil />} />
                <Route path="/pieces" element={<PieceList />} />
                <Route path="/piecesCRUD" element={<Piece />} />
                <Route path="/machines" element={<MachineList />} />
                <Route path="/machinesCRUD" element={<Machine />} />
                <Route path="/postes" element={<PosteList />} />
                <Route path="/postesCRUD" element={<Poste />} />
                <Route path="/operations" element={<OperationList />} />
                <Route path="/operationsCRUD" element={<Operation />} />
                <Route path="/gammes" element={<GammeList />} />
                <Route path="/gammesCRUD" element={<Gamme />} />
              </Routes>
            </BrowserRouter>
          <Footer />
        </div>}
    </>
  );
}

export default App;
