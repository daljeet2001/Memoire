import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../api/axios';
import { Link } from 'react-router-dom';
import { useRef,useState } from "react";

export default function Dashboard() {
  const [token,setToken]=useState();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ['spaces'],
    queryFn: async () => (await api.get('/spaces')).data,
  });
  const inputRef = useRef(null);

  const create = useMutation({
    mutationFn: (payload) => api.post('/spaces', payload),
    onSuccess: () => {
      // refresh the spaces list
      queryClient.invalidateQueries(['spaces']);
    },
  });

const join = async (e) => {
  e.preventDefault();
  await api.post('/spaces/join', { token });
  setToken(""); // reset the input field
  queryClient.invalidateQueries(['spaces']); // refresh spaces list
};


  const onCreate = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;

    await create.mutateAsync({ name });
    e.target.reset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-chewy">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
    
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Spaces</h2>


     
    

      {/* Spaces list */}
<ul className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
  {data?.map((s, index) => {
    const images = ["/space1.jpg", "/space2.jpg", "/space5.jpg", "/space4.jpg"];
    const img = images[index % images.length];
    return (
      <li key={s._id} className="bg-white cursor-pointer">
        <Link
          to={`/timeline/${s._id}?token=${s.joinToken}`}
          className="flex flex-col items-center justify-center"
        >
          <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-2xl flex items-center justify-center overflow-hidden mb-3 bg-gray-100 transition">
            <img src={img} alt={s.name} className="w-full h-full object-cover" />
          </div>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 hover:text-indigo-600">
            {s.name}
          </p>
        </Link>
      </li>
    );
  })}

  {/* Create Space Card */}
  <li
    className="flex flex-col items-center justify-center cursor-text"
    onClick={() => inputRef.current?.focus()}
  >
    <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-2xl flex items-center justify-center overflow-hidden mb-3 border-2 border-dashed border-indigo-400 hover:border-indigo-600 transition">
      <span className="text-gray-400 text-xl sm:text-2xl">+</span>
    </div>

    <form
      onSubmit={onCreate}
      className="w-full flex items-center justify-center"
    >
      <input
        ref={inputRef}
        name="name"
        placeholder="New Space..."
        className="w-full text-center text-sm sm:text-base md:text-lg text-gray-700 focus:outline-none placeholder-gray-400"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.form.requestSubmit();
          }
        }}
        required
      />
    </form>
  </li>
</ul>

   {/* Join space */}
        <section className="text-center mt-10">
          {/* <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">Join Space</h3> */}
          <div  className="text-indigo-600  font-medium mb-6">
            Join Space?
          <form onSubmit={join} className="text-center">
      <input placeholder="Invite token" className=" text-center text-sm sm:text-base md:text-lg text-gray-700 focus:outline-none placeholder-gray-400 border rounded border-gray-400" onChange={(e)=>setToken(e.target.value)} />

      <button className="px-3 py-1 mt-2 ml-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Join</button>
    </form>
          </div>
        </section>


      </main>

      <Footer />
    </div>
  );
}
