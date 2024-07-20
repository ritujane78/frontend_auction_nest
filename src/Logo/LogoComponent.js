import { Link } from 'react-router-dom';
import './logo.css'
function LogoComponent() {
    return (
        <div >
            <Link to="/">
                <img className="logo" src="../images/hammer-logo-illustration-design-free-vector.jpg" />
            </Link>
        </div>
    );
}
export default LogoComponent;