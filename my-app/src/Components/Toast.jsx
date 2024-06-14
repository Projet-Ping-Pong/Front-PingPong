import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../Style/App.css';

function Toast() {
  return (
    <>
      <div className="toast-container position-fixed top-0 d-flex end-0 p-3">
        <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" />
            <div class="alert alert-danger m-0" role="alert">
            A simple danger alert—check it out!
            </div>
        </div>
      </div>
    </>
  );
}

export default Toast;
