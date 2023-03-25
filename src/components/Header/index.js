import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav>
      <Link className="links" to="/login">
        <button className="logo-btn" type="button">
          <img
            className="app-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </button>
      </Link>
      <ul className="nav-ul">
        <Link className="links" to="/">
          <li className="nav-li">
            <p>Home</p>
          </li>
        </Link>
        <Link className="links" to="/jobs">
          <li className="nav-li">
            <p>Jobs</p>
          </li>
        </Link>
        <li className="btn-li nav-li">
          <button onClick={onLogout} className="logout-btn" type="button">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}
export default withRouter(Header)
