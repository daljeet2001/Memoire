import { useState } from 'react';
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const url = isLogin ? '/auth/login' : '/auth/register';
    await api.post(url, form);
    nav('/dashboard');
  };

  return (
    <div className="container">
      <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
      <form onSubmit={submit}>
        {!isLogin && <input placeholder="Name" onChange={e=>setForm({...form, name:e.target.value})} />}
        <input placeholder="Email" onChange={e=>setForm({...form, email:e.target.value})} />
        <input placeholder="Password" type="password" onChange={e=>setForm({...form, password:e.target.value})} />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={()=>setIsLogin(!isLogin)}>
        {isLogin ? "New here? Register" : "Have an account? Login"}
      </button>
    </div>
  );
}

