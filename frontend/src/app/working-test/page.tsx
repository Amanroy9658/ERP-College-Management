export default function WorkingTest() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#9333EA', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Tailwind CSS Test
        </h1>
        <button 
          style={{ 
            backgroundColor: '#9333EA', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#7C3AED'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#9333EA'}
        >
          Purple Button (Inline Styles)
        </button>
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#F3E8FF', borderRadius: '0.375rem', border: '1px solid #E9D5FF' }}>
          <p style={{ color: '#6B21A8' }}>If you can see this, basic styling is working!</p>
        </div>
      </div>
    </div>
  );
}
