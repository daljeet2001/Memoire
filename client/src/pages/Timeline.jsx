import { useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api/axios';
import { useEffect, useState } from 'react';

export default function Timeline() {
  const { spaceId } = useParams();
  const [searchParams] = useSearchParams();
  const joinToken = searchParams.get("token"); 

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

  useEffect(() => { 
    setItems([]); 
    setCursor(null); 
    load(); 
  }, [spaceId]);

return (
  <div className="font-chewy flex flex-col items-center text-center">
    <h2 className="text-2xl mb-4">Timeline</h2>

    {/* Invite section */}
    {joinToken && (
      <div className="my-4 p-3">
        <p className="text-indigo-700 flex items-center gap-2 justify-center">
          Invite: 
          <button
            onClick={() => navigator.clipboard.writeText(joinToken)}
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            {joinToken}
          </button>
        </p>
      </div>
    )}
    <a href={`/new/${spaceId}`} className="mb-4 text-indigo-600 underline">
      + New Entry
    </a>

    <ul>
      {items.map(e => (
        <li key={e._id} className="mb-4">
          <p>{new Date(e.date).toDateString()}</p>
          {e.type === 'note' && <p>{e.text}</p>}
          {e.type === 'photo' && e.media?.map((m,i)=>
            <img key={i} src={m.url} alt="" className="max-w-xs mx-auto"/>
          )}
        </li>
      ))}
    </ul>

    {cursor && (
      <button
        disabled={loading}
        onClick={load}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Load more'}
      </button>
    )}


  </div>
);

}
