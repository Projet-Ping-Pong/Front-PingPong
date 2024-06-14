import '../Style/App.css';

function Accueil(props) {

  return (
    <div className='flex-grow-1 d-flex'>
      <div className="text-body d-flex justify-content-evenly align-items-center anim w-100" style={{ width: "100vw"}}>
        <h1>Bienvenue {localStorage.getItem("Nom_uti")}, sur l’espace Atelier</h1>
      </div>
    </div>
  );
}

export default Accueil;
