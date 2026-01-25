import { useState } from 'react';

export const ProfileCard = ({ user }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!user) {
    return null;
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  const photoUrl = user.photoUrl;
  const emailId = user.emailId || 'No email provided';
  const gender = user.gender || 'Not specified';
  const age = user.age || 'Not specified';
  const about = user.about || 'No description available.';
  const skills = user.skills || [];

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300">
      {/* Profile Image - Large Figure */}
      <figure className="h-80 overflow-hidden bg-gradient-to-br from-base-200 to-base-300 relative">
        {photoUrl && !imageError ? (
          <>
            <img
              src={photoUrl}
              alt={fullName}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-32 w-32 text-base-content/20"
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
        )}
      </figure>

      {/* Profile Header with Name and Email */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 px-6 pt-6 pb-4">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-base-content mb-1">{fullName}</h2>
          <p className="text-base-content/70 text-sm">{emailId}</p>
        </div>
      </div>

      {/* Profile Body */}
      <div className="card-body">
        {/* Personal Information */}
        <div className="space-y-4">
          {/* Gender and Age */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Gender</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <div>
                <p className="text-xs text-base-content/60 uppercase tracking-wide">Gender</p>
                <p className="font-semibold capitalize">{gender}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Age</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="text-xs text-base-content/60 uppercase tracking-wide">Age</p>
                <p className="font-semibold">{age}</p>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-sm font-semibold mb-2 text-base-content/80 uppercase tracking-wide flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>About</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              About
            </h3>
            <p className="text-sm text-base-content/70 leading-relaxed bg-base-200 p-3 rounded-lg">
              {about}
            </p>
          </div>

          {/* Skills Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-base-content/80 uppercase tracking-wide flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-primary"
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
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => {
                  const skillKey = typeof skill === 'string' ? skill : String(skill);
                  const skillLabel = typeof skill === 'string' ? skill : skill.name || String(skill);
                  return (
                    <span key={skillKey} className="badge badge-primary badge-lg font-medium">
                      {skillLabel}
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-base-content/50 italic">No skills listed</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
