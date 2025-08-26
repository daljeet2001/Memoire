import { useState } from 'react';
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function JoinSpace() {
  const [token, setToken] = useState('');
  const nav = useNavigate();
  const join = async (e) => {
    e.preventDefault();
    await api.post('/spaces/join', { token });
    nav('/dashboard');
  };
  return (
    <form onSubmit={join}>
      <input placeholder="Invite token" onChange={(e)=>setToken(e.target.value)} />
      <button>Join</button>
    </form>
  );
}

