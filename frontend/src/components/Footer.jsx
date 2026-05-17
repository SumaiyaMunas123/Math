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
          <h4>Contact</h4>
          <p>WhatsApp: <a href="https://wa.me/94777492746?text=Hello%21%20Can%20I%20please%20get%20more%20details%20about%20this%20class%3F" target="_blank" rel="noreferrer">+94 777 492 746</a></p>
          <p style={{fontSize: '13px', marginTop: '8px', opacity: 0.8}}>For inquiries and support</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Math Classroom. Quiet, simple math help for Sri Lankan students.</p>
      </div>
    </footer>
  )
}
