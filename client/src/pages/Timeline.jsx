import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axios';
import { useEffect, useState } from 'react';


export default function Timeline() {
  const { spaceId } = useParams();
  const [searchParams] = useSearchParams();
  const joinToken = searchParams.get("token"); 
  const [type, setType] = useState('note');
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [media, setMedia] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/entries', { params: { spaceId, cursor } });
    setItems(prev => [...prev, ...data]);
    setCursor(data.nextCursor);
    setLoading(false);
  };

  useEffect(() => { 
    setItems([]); 
    setCursor(null); 
    load(); 
  }, [spaceId]);

  // const uploadToCloudinary = async () => {
  //   setUploading(true);
  //   const { data: sig } = await api.post('/uploads/signature');
  //   const uploaded = [];
  //   for (const file of files) {
  //     const body = new FormData();
  //     body.append('file', file);
  //     body.append('api_key', sig.apiKey);
  //     body.append('timestamp', sig.timestamp);
  //     body.append('upload_preset', sig.uploadPreset);
  //     body.append('signature', sig.signature);
  //     const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`, {
  //       method: 'POST', body
  //     });
  //     const json = await res.json();
  //     console.log( 'json',json)
  //     uploaded.push({
  //       public_id: json.public_id, url: json.secure_url,
  //       width: json.width, height: json.height, format: json.format
  //     });
  //   }
  //   setMedia(uploaded);
  //   setUploading(false);
  // };

const save = async (e) => {
  e.preventDefault();
  let uploadedMedia = media;

  // Upload photos if needed
  if (type === 'photo' && media.length === 0 && files.length) {
    setUploading(true);
    const { data: sig } = await api.post('/uploads/signature');
    uploadedMedia = [];
    for (const file of files) {
      const body = new FormData();
      body.append('file', file);
      body.append('api_key', sig.apiKey);
      body.append('timestamp', sig.timestamp);
      body.append('upload_preset', sig.uploadPreset);
      body.append('signature', sig.signature);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`, {
        method: 'POST',
        body
      });
      const json = await res.json();
      uploadedMedia.push({
        public_id: json.public_id,
        url: json.secure_url,
        width: json.width,
        height: json.height,
        format: json.format
      });
    }
    setUploading(false);
  }

  // Save entry
  const { data: savedEntry } = await api.post('/entries', { spaceId, type, text, media: uploadedMedia });

  // Prepend new entry to timeline immediately
  setItems(prev => [savedEntry, ...prev]);

  // Clear form
  setText('');
  setFiles([]);
  setMedia([]);
  setShowForm(false);
};





  return (
 <div className="font-chewy flex flex-col items-center text-center px-4">
  <h2 className="text-3xl mb-6">Timeline</h2>

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

  {/* Timeline */}
<ul className="relative border-l-2 border-indigo-300 ml-4 w-full max-w-xl">
  {/* Add New Entry button */}
 <li className="mb-8 ml-6 relative">
  {/* Timeline marker */}
  <span className="absolute -left-4 top-0 w-3 h-3 bg-green-600 rounded-full ring-2 ring-white"></span>

  {!showForm ? (
    <button
      onClick={() => setShowForm(true)}
      className="bg-white p-4   w-full text-left transition"
    >
      + Add New Entry
    </button>
  ) : (
    <div className="bg-white p-4  mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">New Entry</h3>
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-500 hover:text-gray-700 font-bold"
        >
          ✕
        </button>
      </div>

      {/* Type */}
      <div className="flex flex-col mb-3">
        <label className="text-gray-700 text-sm mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
        >
          <option value="note">Note</option>
          <option value="photo">Photo</option>
        </select>
      </div>

      {/* Note */}
      {type === "note" && (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm resize-none"
          placeholder="Write your note..."
          rows={3}
        />
      )}

  {/* Photo */}
{type === "photo" && (
  <div className="flex flex-col space-y-2">
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={(e) => setFiles([...e.target.files])}
      className="block w-full text-sm text-gray-600 
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-lg file:border-0
                 file:text-sm file:font-medium
                 file:bg-indigo-50 file:text-indigo-700
                 hover:file:bg-indigo-100"
    />
    <div className="flex flex-wrap gap-2 mt-2">
      {media.map((m, i) => (
        <img
          key={i}
          src={m.url}
          className="w-24 h-24 object-cover rounded"
        />
      ))}
    </div>
  </div>
)}

{/* Submit */}
<button
  onClick={save}
  disabled={uploading || (type === "photo" && !files.length && !media.length)}
  className="mt-3 w-full bg-green-600 text-white py-1 rounded hover:bg-green-700 transition text-sm"
>
  {uploading ? "Uploading..." : "Save"}
</button>

    </div>
  )}
</li>

  {/* Existing timeline items */}
  {items.map((e, idx) => (
    <li key={e._id} className="mb-8 ml-6 relative">
      <span className="absolute -left-4 top-0 w-3 h-3 bg-indigo-600 rounded-full ring-2 ring-white"></span>

      <div className="bg-white text-left p-4 ">
        <p className="text-sm text-gray-500">{new Date(e.date).toDateString()}</p>
        <p className="font-semibold mb-2">~{e.author.name}</p>

        {e.type === 'note' && <p>{e.text}</p>}
        {e.type === 'photo' &&
          e.media?.map((m, i) => (
            <img key={i} src={m.url} alt="" className="max-w-xs my-2 rounded"/>
          ))
        }
      </div>
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
