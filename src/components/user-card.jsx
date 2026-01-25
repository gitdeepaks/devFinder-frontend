import { useEffect, useState } from 'react';

export const UserCard = ({ user }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  const photoUrl = user?.photoUrl;

  // Set image source when photoUrl changes
  useEffect(() => {
    if (photoUrl && typeof photoUrl === 'string' && photoUrl.trim() !== '') {
      setImageSrc(photoUrl.trim());
      setImageError(false);
      setImageLoaded(false);
    } else {
      setImageSrc('');
      setImageError(true);
    }
  }, [photoUrl]);

  if (!user) {
    return null;
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  const about = user.about || 'No description available.';
  const skills = user.skills || [];

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const hasValidImage = imageSrc && !imageError;

  return (
    <div className="card bg-base-100 w-96 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-300 overflow-hidden group">
      {/* Image Section */}
      <figure className="h-64 overflow-hidden bg-gradient-to-br from-base-200 to-base-300 relative">
        {hasValidImage ? (
          <>
            <img
              src={imageSrc}
              alt={fullName}
              className={`w-full h-full object-cover transition-all duration-300 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              } group-hover:scale-105`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24 text-base-content/20 mx-auto mb-2"
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
              <p className="text-xs text-base-content/40">No photo</p>
            </div>
          </div>
        )}
      </figure>

      {/* Card Body */}
      <div className="card-body p-6">
        {/* Name */}
        <div className="mb-3">
          <h2 className="card-title text-xl font-bold text-base-content mb-1">{fullName}</h2>
        </div>

        {/* About Section */}
        <div className="mb-4">
          <p className="text-sm text-base-content/70 line-clamp-3 leading-relaxed">{about}</p>
        </div>

        {/* Skills Section */}
        {skills.length > 0 ? (
          <div className="mb-4">
            <h3 className="text-xs font-semibold mb-2 text-base-content/60 uppercase tracking-wide flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Skills</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 5).map((skill) => {
                const skillKey = typeof skill === 'string' ? skill : String(skill);
                const skillLabel = typeof skill === 'string' ? skill : skill.name || String(skill);
                return (
                  <span key={skillKey} className="badge badge-primary badge-sm font-medium">
                    {skillLabel}
                  </span>
                );
              })}
              {skills.length > 5 && (
                <span className="badge badge-ghost badge-sm font-medium">+{skills.length - 5} more</span>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <span className="text-xs text-base-content/40 italic">No skills listed</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="card-actions justify-between mt-auto pt-4 border-t border-base-300 gap-2">
          <button type="button" className="btn btn-ghost btn-sm flex-1 hover:btn-error transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>Ignore</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Ignore
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm flex-1 hover:btn-primary-focus transition-all shadow-md hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>Send Request</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
};
