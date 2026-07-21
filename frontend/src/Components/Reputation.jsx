import { Link } from 'react-router-dom';
function ReputationScore({ score }) {
  return (
    <div className="mb-4">
      <h5>Your Reputation</h5>
      <p>{'★'.repeat(Math.floor(score))}☆{Math.ceil(5 - score)} {score.toFixed(1)}/5</p>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${score * 20}%` }}></div>
      </div>
      <Link to="/profile" className="btn btn-outline-secondary btn-sm mt-2">View Feedback</Link>
    </div>
  );
}
export default ReputationScore;