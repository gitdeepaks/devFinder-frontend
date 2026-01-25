import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from '@pheralb/toast';
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
      console.log('Connections:', response.data);
      
      // Handle different response structures
      const connectionsData = response.data?.data || response.data || [];
      dispatch(addConnection(connectionsData));
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast.error({
        text: 'Connection Error',
        description: 'Failed to load connections. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: reason
  useEffect(() => {
    fetchConnections();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-10 min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Check if connections is null, undefined, or not an array, or empty
  if (!connections || !Array.isArray(connections) || connections.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-center items-center mb-8">
          <h1 className="text-3xl font-bold">Connections</h1>
        </header>
        <div className="flex justify-center items-center my-10 min-h-[400px]">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-base-content/20 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>No connections</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-lg text-base-content/70 mb-2">No connections found</p>
            <p className="text-sm text-base-content/50">Start connecting with other developers!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Connections</h1>
          <span className="badge badge-primary badge-lg">{connections.length}</span>
        </div>
      </header>

      <div className="bg-base-100 rounded-lg shadow-lg border border-base-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="bg-base-200">
                <th className="font-semibold">Profile</th>
                <th className="font-semibold">About</th>
                <th className="font-semibold">Skills</th>
              </tr>
            </thead>
            <tbody>
              {connections.map((connection) => {
                const fullName = `${connection.firstName || ''} ${connection.lastName || ''}`.trim() || 'User';
                const about = connection.about || 'No description available.';
                const skills = connection.skills || [];
                const photoUrl = connection.photoUrl;

                return (
                  <tr key={connection._id || connection.id || Math.random()} className="hover:bg-base-200/50 transition-colors">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            {photoUrl ? (
                              <img
                                src={photoUrl}
                                alt={fullName}
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextElementSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div
                              className={`w-full h-full flex items-center justify-center bg-base-300 rounded-full ${
                                photoUrl ? 'hidden' : ''
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-base-content/40"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <title>No image</title>
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.5"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-base-content">{fullName}</div>
                          {connection.age && (
                            <div className="text-xs text-base-content/60">
                              {connection.age} years old
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="text-sm text-base-content/70 line-clamp-2 max-w-md">
                        {about}
                      </p>
                    </td>
                    <td>
                      {skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {skills.slice(0, 3).map((skill) => {
                            const skillLabel = typeof skill === 'string' ? skill : skill.name || String(skill);
                            const skillKey = `${connection._id || connection.id}-${skillLabel}`;
                            return (
                              <span key={skillKey} className="badge badge-primary badge-xs">
                                {skillLabel}
                              </span>
                            );
                          })}
                          {skills.length > 3 && (
                            <span className="badge badge-ghost badge-xs">+{skills.length - 3}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-base-content/40 italic">No skills</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
