import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelect = () => {
  const navigate = useNavigate();

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f4f7f6',
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
  };

  const cardContainer = {
    display: 'flex',
    gap: '30px',
    marginTop: '40px'
  };

  const cardStyle = {
    width: '240px',
    padding: '50px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderTop: '6px solid transparent'
  };

  const iconStyle = {
    fontSize: '50px',
    marginBottom: '15px'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ color: '#2c3e50', fontSize: '2.5rem', marginBottom: '10px' }}>EEE Dept Leave Portal</h1>
      <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>Welcome! Please choose your login type to manage leave requests.</p>
      
      <div style={cardContainer}>
        {/* Student Card */}
        <div 
          style={{ ...cardStyle, borderTopColor: '#3498db' }}
          onClick={() => navigate('/student-login')}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)';
          }}
        >
          <div style={iconStyle}>🎓</div>
          <h2 style={{ margin: '0', color: '#3498db' }}>Student Login</h2>
          <p style={{ color: '#95a5a6', marginTop: '10px' }}>Apply for leaves and track your status.</p>
        </div>

        {/* Admin Card */}
        <div 
          style={{ ...cardStyle, borderTopColor: '#27ae60' }}
          onClick={() => navigate('/admin-login')}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)';
          }}
        >
          <div style={iconStyle}>🛡️</div>
          <h2 style={{ margin: '0', color: '#27ae60' }}>Admin Login</h2>
          <p style={{ color: '#95a5a6', marginTop: '10px' }}>Review, approve, or reject applications.</p>
        </div>
      </div>
      
      <footer style={{ marginTop: '50px', color: '#bdc3c7', fontSize: '0.9rem' }}>
        &copy; 2026 Leave Management System | All Rights Reserved
      </footer>
    </div>
  );
};

export default RoleSelect;