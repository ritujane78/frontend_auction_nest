import { Link } from 'react-router-dom';
import './logo.css'
function LogoComponent() {
    return (
        <div >
            <Link to="/">
                <img className="logo-symbol" src="../hammer.png" />
            </Link>
        </div>
    );
}
export default LogoComponent;