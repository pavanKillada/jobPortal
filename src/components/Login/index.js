import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', fetchError: ''}

  submitForm = async event => {
    event.preventDefault()
    const url = 'https://apis.ccbp.in/login'
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.setState({username: '', password: ''})
      Cookies.set('jwt_token', data.jwt_token, {expires: 30, path: '/'})
      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({
        fetchError: data.error_msg,
      })
    }
  }

  usernameChange = event => {
    this.setState({username: event.target.value})
  }

  passwordChange = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, fetchError} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <form onSubmit={this.submitForm}>
          <div className="form-logo-container">
            <img
              className="login-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <label htmlFor="username">USERNAME</label>
          <input
            onChange={this.usernameChange}
            id="username"
            type="text"
            placeholder="Username"
            value={username}
          />
          <label htmlFor="password">PASSWORD</label>
          <input
            onChange={this.passwordChange}
            id="password"
            type="password"
            placeholder="Password"
            value={password}
          />
          {fetchError !== '' && <p className="error-msg">{fetchError}</p>}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    )
  }
}
export default Login
