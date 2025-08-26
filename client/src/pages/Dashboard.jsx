import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../api/axios';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  // ✅ useQuery v5 syntax
  const { data } = useQuery({
    queryKey: ['spaces'],
    queryFn: async () => (await api.get('/spaces')).data,
  });

  // ✅ useMutation v5 syntax
  const create = useMutation({
    mutationFn: (payload) => api.post('/spaces', payload),
  });

  const onCreate = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const relationshipStart = e.target.relationshipStart.value;
    await create.mutateAsync({ name, relationshipStart });
  };

  return (
    <div>
      <h2>Your Spaces</h2>
      <ul>
        {data?.map((s) => (
          <li key={s._id}>
            <Link to={`/timeline/${s._id}`}>{s.name}</Link>
          </li>
        ))}
      </ul>

      <h3>Create Space</h3>
      <form onSubmit={onCreate}>
        <input name="name" placeholder="Space Name" />
        <input name="relationshipStart" type="date" />
        <button>Create</button>
      </form>

      <h3>Join Space</h3>
      <Link to="/join">Have an invite link?</Link>
    </div>
  );
}
