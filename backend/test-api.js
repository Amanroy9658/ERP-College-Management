const fetch = require('node-fetch');

async function testRegistration() {
  try {
    console.log('🔄 Testing registration API...');
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '1234567890',
        password: 'password123',
        role: 'student',
        roleSpecificInfo: {
          course: 'CS',
          semester: 1,
          academicYear: '2024-25'
        }
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Registration API working!');
      console.log('Response:', data);
    } else {
      console.log('❌ Registration API error:');
      console.log('Status:', response.status);
      console.log('Response:', data);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRegistration();
