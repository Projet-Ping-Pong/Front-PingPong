import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../Style/App.css';

function Toast(props) {
  return (
    <>
      {
        props.statutToast === "error" ?
          <div className="toast-container position-fixed top-0 end-0 p-3">
            <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
              <div className="alert alert-danger m-0 d-flex justify-content-between align-items-center" role="alert">
                <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" className="me-3" size="2xl" style={{color: "#ff0000",}} />
                <div>{props.infoToast}</div>
                <div className="d-flex justify-content-end ms-3"><button type="button" className="btn-close top-0 end-0" data-bs-dismiss="toast" aria-label="Close"></button></div>
              </div>
            </div>
          </div>
          :
          <div className="toast-container position-fixed top-0 end-0 p-3">
            <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
              <div className="alert alert-success m-0 d-flex justify-content-between" role="alert">
                <FontAwesomeIcon icon="fa-solid fa-circle-check" className="me-3" size="2xl" style={{color: "#00ff11",}} />
                <div>{props.infoToast}</div>
                <div className="d-flex justify-content-end ms-3"><button type="button" className="btn-close top-0 end-0" data-bs-dismiss="toast" aria-label="Close"></button></div>
              </div>
            </div>
          </div>
      }

    </>
  );
}

export default Toast;
