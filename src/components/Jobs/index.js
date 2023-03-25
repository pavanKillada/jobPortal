import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobItem from '../JobItem'
import JobSelectOptions from '../JobSelectOptions'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

// These are the lists used in the application. You can move them to any component needed.
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const fetchStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failed: 'FAILED',
}

class Jobs extends Component {
  state = {
    jobs: [],
    fetching: fetchStatus.initial,
    searchContent: '',
    employmentOptions: [],
    salaryOption: '',
  }

  componentDidMount() {
    this.getJobItem()
  }

  onCheckbox = (checkboxId, checked) => {
    let {employmentOptions} = this.state
    if (checked) {
      this.setState(
        prevState => ({
          employmentOptions: [...prevState.employmentOptions, checkboxId],
        }),
        this.getJobItem,
      )
    } else {
      employmentOptions = employmentOptions.filter(id => id !== checkboxId)
      this.setState({employmentOptions}, this.getJobItem)
    }
  }

  onRadio = id => {
    this.setState({salaryOption: id}, this.getJobItem)
  }

  onRetry = () => {
    this.componentDidMount()
  }

  getJobItem = async () => {
    this.setState({fetching: fetchStatus.inProgress})
    const {searchContent, employmentOptions, salaryOption} = this.state
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentOptions.join(
      ',',
    )}&minimum_package=${salaryOption}&search=${searchContent}`

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
        this.setState({jobs: data.jobs, fetching: fetchStatus.success})
      } else {
        this.setState({fetching: fetchStatus.failed})
      }
    } catch (error) {
      this.setState({fetching: fetchStatus.failed})
    }
  }

  onSearchChange = event => {
    this.setState({searchContent: event.target.value})
  }

  onSearchBtn = () => {
    this.setState({searchContent: ''})
    this.getJobItem()
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsFailedView = () => (
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

  renderJobsSuccessView = () => {
    const {jobs} = this.state
    if (jobs.length === 0) {
      return (
        <div className="no-jobs-container">
          <img
            className="no-jobs-img"
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1 className="no-jobs-head">No Jobs Found</h1>
          <p className="no-jobs-para">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      )
    }
    return (
      <ul className="job-items-ul">
        {jobs.map(eachJob => (
          <JobItem key={eachJob.id} jobItemDetails={eachJob} />
        ))}
      </ul>
    )
  }

  renderJobItems = () => {
    const {fetching} = this.state
    switch (fetching) {
      case 'SUCCESS':
        return this.renderJobsSuccessView()
      case 'IN_PROGRESS':
        return this.renderLoader()
      case 'FAILED':
        return this.renderJobsFailedView()
      default:
        return null
    }
  }

  render() {
    const {searchContent} = this.state
    return (
      <div className="jobs-container">
        <Header />
        <div className="selection-and-job-items-container">
          <JobSelectOptions
            employmentType={employmentTypesList}
            salaryRange={salaryRangesList}
            onCheckbox={this.onCheckbox}
            onRadio={this.onRadio}
          />
          <div className="job-items-container">
            <div className="search-container">
              <input
                onChange={this.onSearchChange}
                className="search-input"
                type="search"
                placeholder="Search"
                value={searchContent}
              />
              <div className="search-btn-container">
                <button
                  onClick={this.onSearchBtn}
                  className="search-btn"
                  type="button"
                  data-testid="searchButton"
                >
                  <BsSearch />
                </button>
              </div>
            </div>
            {this.renderJobItems()}
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
