import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMovie } from '../api/movieService';

export default function NewMovie() {
  const [title, setTitle]     = useState('');
  const [release, setRelease] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMovie({ title, release });
    navigate('/');
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Add Movie</h2>
      <label>
        Title: <input value={title} onChange={e => setTitle(e.target.value)} />
      </label><br/>
      <label>
        Release: <input type="date" value={release}
                         onChange={e => setRelease(e.target.value)} />
      </label><br/>
      <button type="submit">Save</button>
    </form>
  );
}
