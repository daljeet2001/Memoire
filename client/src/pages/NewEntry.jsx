import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../api/axios';

export default function NewEntry() {
  const { spaceId } = useParams();
  const nav = useNavigate();
  const [type, setType] = useState('note');
  const [text, setText] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [media, setMedia] = useState([]);

  const uploadToCloudinary = async () => {
    setUploading(true);
    const { data: sig } = await api.post('/uploads/signature');
    const uploaded = [];
    for (const file of files) {
      const body = new FormData();
      body.append('file', file);
      body.append('api_key', sig.apiKey);
      body.append('timestamp', sig.timestamp);
      body.append('upload_preset', sig.uploadPreset);
      body.append('signature', sig.signature);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`, {
        method: 'POST', body
      });
      const json = await res.json();
      uploaded.push({
        public_id: json.public_id, url: json.secure_url,
        width: json.width, height: json.height, format: json.format
      });
    }
    setMedia(uploaded);
    setUploading(false);
  };

  const save = async (e) => {
    e.preventDefault();
    if (type === 'photo' && media.length === 0 && files.length) await uploadToCloudinary();
    await api.post('/entries', { spaceId, type, text, media, date });
    nav(`/timeline/${spaceId}`);
  };

  return (
    <form onSubmit={save}>
      <h2>New Entry</h2>
      <label>Type</label>
      <select value={type} onChange={e=>setType(e.target.value)}>
        <option value="note">Note</option>
        <option value="photo">Photo</option>
      </select>

      <label>Date</label>
      <input type="date" value={date} onChange={e=>setDate(e.target.value)}/>

      {type === 'note' && (
        <>
          <label>Text</label>
          <textarea value={text} onChange={e=>setText(e.target.value)} />
        </>
      )}

      {type === 'photo' && (
        <><input type="file" multiple accept="image/*" onChange={e=>setFiles([...e.target.files])}/>
          <button type="button" onClick={uploadToCloudinary} disabled={uploading || !files.length}>
            {uploading ? 'Uploading...' : 'Upload to Cloudinary'}
          </button>
          <div>{media.map((m,i)=><img key={i} src={m.url} style={{maxWidth: 180}}/>)}</div>
        </>
      )}
      <button type="submit">Save</button>
    </form>
  );
}

