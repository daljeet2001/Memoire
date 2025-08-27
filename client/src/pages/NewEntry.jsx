import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../api/axios';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function NewEntry() {
  const { spaceId } = useParams();
  const nav = useNavigate();
  const [type, setType] = useState('note');
  const [text, setText] = useState('');
  // const [date, setDate] = useState(new Date().toISOString().slice(0,10));
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
      console.log( 'json',json)
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
    await api.post('/entries', { spaceId, type, text, media });
    nav(`/timeline/${spaceId}`);
  };

  return (
    <div className="font-chewy text-center">
      <Navbar/>
   <form 
  onSubmit={save} 
  className="max-w-lg mx-auto bg-white shadow-md rounded-2xl p-6 space-y-4 font-chewy"
>
  <h2 className="text-2xl font-bold text-gray-800 mb-4">New Entry</h2>

  {/* Type */}
  <div className="flex flex-col">
    <label className="text-gray-700 font-medium mb-1">Type</label>
    <select 
      value={type} 
      onChange={e=>setType(e.target.value)} 
      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
    >
      <option value="note">Note</option>
      <option value="photo">Photo</option>
    </select>
  </div>

  {/* Date */}
  {/* <div className="flex flex-col">
    <label className="text-gray-700 font-medium mb-1">Date</label>
    <input 
      type="date" 
      value={date} 
      onChange={e=>setDate(e.target.value)} 
      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
    />
  </div> */}

  {/* Note */}
  {type === 'note' && (
    <div className="flex flex-col">
      <label className="text-gray-700 font-medium mb-1">Text</label>
      <textarea 
        value={text} 
        onChange={e=>setText(e.target.value)} 
        className="border border-gray-300 rounded-lg px-3 py-2 h-32 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
    </div>
  )}

  {/* Photo */}
  {type === 'photo' && (
    <div className="flex flex-col space-y-3">
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        onChange={e=>setFiles([...e.target.files])}
        className="block w-full text-sm text-gray-600 
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-lg file:border-0
                   file:text-sm file:font-medium
                   file:bg-indigo-50 file:text-indigo-700
                   hover:file:bg-indigo-100"
      />

      <button 
        type="button" 
        onClick={uploadToCloudinary} 
        disabled={uploading || !files.length}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
      >
        {uploading ? 'Uploading...' : 'Upload to Cloudinary'}
      </button>

      <div className="flex flex-wrap gap-3">
        {media.map((m,i)=>
          <img key={i} src={m.url} className="w-32 h-32 object-cover" />
        )}
      </div>
    </div>
  )}

  {/* Submit */}
  <button 
    type="submit" 
    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
  >
    Save
  </button>
</form>

    <Footer/>
    </div>
  );
}

