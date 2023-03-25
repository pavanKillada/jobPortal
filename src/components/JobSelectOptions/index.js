import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const fetchStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failed: 'FAILED',
}

class JobSelectOptions extends Component {
  state = {
    profileDetails: {},
    fetching: fetchStatus.initial,
  }

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({fetching: fetchStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    try {
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok === true) {
        this.setState({
          profileDetails: data.profile_details,
          fetching: fetchStatus.success,
        })
      } else {
        this.setState({fetching: fetchStatus.failed})
      }
    } catch (error) {
      this.setState({fetching: fetchStatus.failed})
    }
  }

  onSelectCheckbox = event => {
    const {onCheckbox} = this.props
    const {checked} = event.target

    onCheckbox(event.target.id, checked)
  }

  onSelectRadio = event => {
    const {onRadio} = this.props
    if (event.target.checked) {
      onRadio(event.target.id)
    }
  }

  renderSelectOptions = () => {
    const {employmentType, salaryRange} = this.props
    return (
      <div className="select-options-container">
        <h1 className="emp-head">Type of Employment</h1>
        <ul className="emp-ul">
          {employmentType.map(eachType => (
            <li className="emp-li" key={eachType.employmentTypeId}>
              <input
                onClick={this.onSelectCheckbox}
                className="checkbox"
                id={eachType.employmentTypeId}
                type="checkbox"
              />
              <label
                className="checkbox-label"
                htmlFor={eachType.employmentTypeId}
              >
                {eachType.label}
              </label>
            </li>
          ))}
        </ul>
        <hr />
        <h1 className="salary-head">Salary Range</h1>
        <ul className="salary-ul">
          {salaryRange.map(eachRange => (
            <li key={eachRange.salaryRangeId} className="salary-li">
              <input
                onClick={this.onSelectRadio}
                className="checkbox"
                id={eachRange.salaryRangeId}
                type="radio"
                name="salary"
              />
              <label
                className="checkbox-label"
                htmlFor={eachRange.salaryRangeId}
              >
                {eachRange.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderSuccessView = () => {
    const {profileDetails} = this.state
    return (
      <>
        <div className="profile-container">
          <img
            className="profile-pic"
            src={profileDetails.profile_image_url}
            alt="profile"
          />
          <h1 className="profile-name">{profileDetails.name}</h1>
          <p className="profile-bio">{profileDetails.short_bio}</p>
        </div>
        <hr />
        {this.renderSelectOptions()}
      </>
    )
  }

  onRetry = () => {
    this.getProfile()
  }

  renderFailedView = () => (
    <>
      <div className="retry-container">
        <button onClick={this.onRetry} className="retry-btn" type="button">
          Retry
        </button>
      </div>
      <hr />
      {this.renderSelectOptions()}
    </>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfile = () => {
    const {fetching} = this.state
    switch (fetching) {
      case 'IN_PROGRESS':
        return this.renderLoader()
      case 'FAILED':
        return this.renderFailedView()
      case 'SUCCESS':
        return this.renderSuccessView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-select-options-container">{this.renderProfile()}</div>
    )
  }
}
export default JobSelectOptions
