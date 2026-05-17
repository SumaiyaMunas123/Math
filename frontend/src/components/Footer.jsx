import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Navigation</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/community">Community</Link></li>
            <li><Link to="/ask">Ask a Question</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Grades</h4>
          <ul>
            <li><Link to="/grade/9">Grade 9</Link></li>
            <li><Link to="/grade/10">Grade 10</Link></li>
            <li><Link to="/grade/11">Grade 11</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="https://e-thaksalawa.moe.gov.lk/" target="_blank" rel="noreferrer">e-Thaksalawa</a></li>
            <li><a href="https://nie.lk" target="_blank" rel="noreferrer">NIE</a></li>
            <li><a href="https://govdoc.lk" target="_blank" rel="noreferrer">GovDoc</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Community</h4>
          <ul>
            <li><a href="https://t.me/+Tq8wM_0hnnRlNWY1" target="_blank" rel="noreferrer">Telegram</a></li>
            <li><a href="https://chat.whatsapp.com/DxfBQaNfeu4I8FjYzO5sMq" target="_blank" rel="noreferrer">WhatsApp</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Math Classroom. Quiet, simple math help for Sri Lankan students.</p>
      </div>
    </footer>
  )
}
