import { toast } from '@pheralb/toast';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addConnection } from '../utils/connection-slice';
import { BASE_URL } from '../utils/contstants';

export default function Connections() {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConnections = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/user/connections`, { withCredentials: true });
      const data = response.data?.data || response.data || [];
      dispatch(addConnection(Array.isArray(data) ? data : []));
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast.error({
        text: 'Couldn’t load connections',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: fetch on mount
  useEffect(() => {
    fetchConnections();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="mt-4 text-base-content/60 font-medium">Loading connections…</p>
      </div>
    );
  }

  if (!connections || !Array.isArray(connections) || connections.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-10">
        <header className="text-center mb-10">
          <h1 className="text-2xl font-bold">Connections</h1>
          <p className="text-base-content/60 mt-1">People you’ve connected with</p>
        </header>
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-primary/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>No connections</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-base-content">No connections yet</h2>
          <p className="mt-2 text-base-content/60 max-w-sm">
            Discover developers and tap the heart to connect. Your connections will show up here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <header className="flex flex-wrap items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold">Connections</h1>
        <span className="badge badge-primary badge-lg">{connections.length}</span>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {connections.map((c) => {
          const fullName = `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Developer';
          const about = c.about || 'No bio.';
          const skills = c.skills || [];
          const photoUrl = c.photoUrl;
          const key = c._id || c.id || Math.random();

          return (
            <article
              key={key}
              className="card card-hover-shine bg-base-100 rounded-2xl border border-base-300/50 overflow-hidden"
            >
              <div className="card-body p-5">
                <div className="flex gap-4">
                  <div className="avatar flex-shrink-0">
                    <div className="w-14 h-14 rounded-full ring-2 ring-primary/20 overflow-hidden bg-base-200">
                      {photoUrl ? (
                        <img src={photoUrl} alt={fullName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-base-content/40">
                          {c.firstName?.[0]?.toUpperCase() || '?'}
                          {c.lastName?.[0]?.toUpperCase() || ''}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-base-content truncate">{fullName}</h2>
                    {c.age && <p className="text-sm text-base-content/50">{c.age} years old</p>}
                    <p className="text-sm text-base-content/70 line-clamp-2 mt-1">{about}</p>
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {skills.slice(0, 3).map((s) => {
                          const label = typeof s === 'string' ? s : s.name || String(s);
                          return (
                            <span key={label} className="badge badge-primary badge-sm">
                              {label}
                            </span>
                          );
                        })}
                        {skills.length > 3 && <span className="badge badge-ghost badge-sm">+{skills.length - 3}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
