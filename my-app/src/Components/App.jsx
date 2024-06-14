import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../Style/App.css';
import Login from './Login';
import Accueil from './Accueil';
import NavBar from './NavBar';
import Footer from './Footer';
import PieceList from './Piece/PieceList';
import PieceAjout from './Piece/PieceAjout';
import { useEffect } from 'react';


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
                <Route path="/piecesAjout" element={<PieceAjout />} />
              </Routes>
            </BrowserRouter>
          <Footer />
        </div>}
    </>
  );
}

export default App;
