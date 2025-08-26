import { useParams } from 'react-router-dom';
import { api } from '../api/axios';
import { useEffect, useState } from 'react';

export default function Timeline() {
  const { spaceId } = useParams();
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/entries', { params: { spaceId, cursor } });
    setItems(prev => [...prev, ...data.items]);
    setCursor(data.nextCursor);
    setLoading(false);
  };

  useEffect(() => { setItems([]); setCursor(null); load(); }, [spaceId]);

  return (
    <div>
      <h2>Timeline</h2>
      <a href={`/new/${spaceId}`}>+ New Entry</a>
      <ul>
        {items.map(e => (
          <li key={e._id}>
            <p>{new Date(e.date).toDateString()}</p>
            {e.type === 'note' && <p>{e.text}</p>}
            {e.type === 'photo' && e.media?.map((m,i)=><img key={i} src={m.url} alt="" style={{maxWidth: 360}}/>)}
          </li>
        ))}
      </ul>
      {cursor && <button disabled={loading} onClick={load}>{loading ? 'Loading...' : 'Load more'}</button>}
    </div>
  );
}

