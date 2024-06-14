import '../Style/App.css';

function Footer() {
    return (<>
        <footer className="d-flex flex-wrap justify-content-center align-items-center py-3 border-top border-2 mt-4" style={{backdropFilter: "blur(2px)"}}>
            <p className="col-md-4 mb-0 text-muted border-top d-flex align-items-center py-2 w-50 justify-content-center">© 2024 Ping-Pong</p>
        </footer>
    </>);
}

export default Footer;
