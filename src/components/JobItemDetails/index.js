import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {ImLocation} from 'react-icons/im'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {GoLinkExternal} from 'react-icons/go'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

const fetchStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failed: 'FAILED',
}

class JobItemDetails extends Component {
  state = {jobData: {}, fetching: fetchStatus.initial}

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    await this.setState({fetching: fetchStatus.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    try {
      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok) {
        this.setState({
          jobData: {
            jobDetails: data.job_details,
            similarJobs: data.similar_jobs,
          },
          fetching: fetchStatus.success,
        })
      } else {
        this.setState({fetching: fetchStatus.failed})
      }
    } catch (error) {
      this.setState({fetching: fetchStatus.failed})
    }
  }

  onRetry = () => {
    this.getJobItemDetails()
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="70" width="70" />
    </div>
  )

  renderFailedView = () => (
    <div className="failed-jobs-view">
      <img
        className="failed-jobs-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failed-jobs-main-text">Oops! Something Went Wrong</h1>
      <p className="failed-jobs-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button onClick={this.onRetry} className="retry-btn" type="button">
        Retry
      </button>
    </div>
  )

  renderJobDetails = () => {
    const {jobData} = this.state
    const {jobDetails, similarJobs} = jobData

    return (
      <>
        <div className="job-item-container">
          <div className="companyLogo-role-container">
            <img
              className="comp-logo"
              src={jobDetails.company_logo_url}
              alt="job details company logo"
            />
            <div className="job-item-role-and-rating">
              <h1 className="job-item-role">{jobDetails.title}</h1>
              <div className="job-item-rating-container">
                <AiFillStar className="star-icon" />
                <p className="rating">{jobDetails.rating}</p>
              </div>
            </div>
          </div>
          <div className="job-item-location-and-package-container">
            <div className="icons-container">
              <ImLocation className="job-item-icons" />
              <p>{jobDetails.location}</p>
            </div>
            <div className="icons-container">
              <BsFillBriefcaseFill className="job-item-icons" />
              <p>{jobDetails.employment_type}</p>
            </div>
            <p className="job-item-salary">{jobDetails.package_per_annum}</p>
          </div>
          <hr />
          <div className="desc-head-container">
            <h1 className="job-item-desc-heading">Description</h1>
            <a
              className="job-item-link-icon"
              href={jobDetails.company_website_url}
              rel="noreferrer"
              target="_blank"
            >
              <p>Visit</p> <GoLinkExternal />
            </a>
          </div>
          <p className="job-item-desc">{jobDetails.job_description}</p>
          <h1 className="job-item-desc-heading">Skills</h1>
          <ul className="skill-ul">
            {jobDetails.skills.map(eachSkill => (
              <li key={eachSkill.name} className="skill-li">
                <img
                  className="skill-img"
                  src={eachSkill.image_url}
                  alt={eachSkill.name}
                />
                <p>{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="job-item-desc-heading">Life at Company</h1>
          <div className="life-at-comp-container">
            <p className="life-at-comp-desc">
              {jobDetails.life_at_company.description}
            </p>
            <img
              className="life-at-comp-img"
              src={jobDetails.life_at_company.image_url}
              alt="life at company"
            />
          </div>
        </div>
        <h1 className="job-item-desc-heading">Similar Jobs</h1>
        <ul className="similar-jobs-ul">
          {similarJobs.map(eachJob => (
            <SimilarJobs key={eachJob.id} jobItemDetails={eachJob} />
          ))}
        </ul>
      </>
    )
  }

  renderJobDetailsElement = () => {
    const {fetching} = this.state
    switch (fetching) {
      case 'SUCCESS':
        return this.renderJobDetails()
      case 'IN_PROGRESS':
        return this.renderLoader()
      case 'FAILED':
        return this.renderFailedView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-bg-container">
        <Header />
        <div className="job-details-container">
          {this.renderJobDetailsElement()}
        </div>
      </div>
    )
  }
}
export default JobItemDetails
