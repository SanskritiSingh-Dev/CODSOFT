import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await api.post('/auth/login', { email, password });
      //save auth info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      alert('Login successful!');

      // Redirect based on role
      if(response.data.user.role === "employer") {
        navigate('/jobs');
      }
      else{
        navigate('/jobs');
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Login failed");
  }
}

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
