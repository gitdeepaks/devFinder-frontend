import { useState } from 'react';

export const ProfileCard = ({ user }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!user) return null;

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  const photoUrl = user.photoUrl;
  const emailId = user.emailId || '—';
  const gender = user.gender || '—';
  const age = user.age ?? '—';
  const about = user.about || 'No bio yet.';
  const skills = user.skills || [];

  return (
    <div className="card card-hover-shine bg-base-100 rounded-3xl shadow-xl border border-base-300/50 overflow-hidden">
      <figure className="relative aspect-square max-h-80 bg-gradient-to-br from-base-200 to-base-300">
        {photoUrl && !imageError ? (
          <>
            <img
              src={photoUrl}
              alt={fullName}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
              onError={() => setImageError(true)}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary" />
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-base-300 flex items-center justify-center">
              <span className="text-3xl font-bold text-base-content/40">
                {user.firstName?.[0]?.toUpperCase() || '?'}
                {user.lastName?.[0]?.toUpperCase() || ''}
              </span>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-base-100 to-transparent" />
      </figure>

      <div className="card-body p-6">
        <h2 className="card-title text-xl font-bold text-base-content">{fullName}</h2>
        <p className="text-sm text-base-content/70">{emailId}</p>

        <div className="flex gap-4 py-2 text-sm">
          <div>
            <span className="text-base-content/50 uppercase tracking-wide">Gender</span>
            <p className="font-medium capitalize">{gender}</p>
          </div>
          <div>
            <span className="text-base-content/50 uppercase tracking-wide">Age</span>
            <p className="font-medium">{age}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-base-content/60 mb-1">About</h3>
          <p className="text-sm text-base-content/80 leading-relaxed bg-base-200/60 rounded-xl p-3">{about}</p>
        </div>

        {skills.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-base-content/60 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => {
                const key = typeof skill === 'string' ? skill : String(skill);
                const label = typeof skill === 'string' ? skill : skill.name || String(skill);
                return (
                  <span key={key} className="badge badge-primary badge-lg font-medium">
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
