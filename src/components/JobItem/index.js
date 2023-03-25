import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {ImLocation} from 'react-icons/im'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobItem = props => {
  const {jobItemDetails} = props
  return (
    <Link className="links" to={`/jobs/${jobItemDetails.id}`}>
      <li className="job-item-container">
        <div className="companyLogo-role-container">
          <img
            className="comp-logo"
            src={jobItemDetails.company_logo_url}
            alt="company logo"
          />
          <div className="job-item-role-and-rating">
            <h1 className="job-item-role">{jobItemDetails.title}</h1>
            <div className="job-item-rating-container">
              <AiFillStar className="star-icon" />
              <p className="rating">{jobItemDetails.rating}</p>
            </div>
          </div>
        </div>
        <div className="job-item-location-and-package-container">
          <div className="icons-container">
            <ImLocation className="job-item-icons" />
            <p>{jobItemDetails.location}</p>
          </div>
          <div className="icons-container">
            <BsFillBriefcaseFill className="job-item-icons" />
            <p>{jobItemDetails.employment_type}</p>
          </div>
          <p className="job-item-salary">{jobItemDetails.package_per_annum}</p>
        </div>
        <hr />
        <h1 className="job-item-desc-heading">Description</h1>
        <p className="job-item-desc">{jobItemDetails.job_description}</p>
      </li>
    </Link>
  )
}
export default JobItem
