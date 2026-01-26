import { toast } from '@pheralb/toast';
import axios from 'axios';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BASE_URL } from '../utils/contstants';
import { removeFeed } from '../utils/feed-slice';

export const UserCard = ({ user }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const dispatch = useDispatch();

  // Framer Motion values for drag
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -120, 0, 120, 200], [0, 1, 1, 1, 0]);

  // Labels opacity based on drag distance
  const interestedOpacity = useTransform(x, [120, 200], [0, 1]);
  const ignoreOpacity = useTransform(x, [-200, -120], [1, 0]);

  const photoUrl = user?.photoUrl;

  const handleSendRequest = async (shouldAnimate = true) => {
    if (isExiting) return;
    setIsExiting(true);

    if (shouldAnimate) {
      // Animate card off screen to the right
      await animate(x, 500, { duration: 0.3, ease: 'easeInOut' });
    }

    try {
      const { data } = await axios.post(
        `${BASE_URL}/request/status/interested/${user._id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeFeed(user._id));
      toast.success({
        text: 'Request sent',
        description: data?.message || 'You’re interested! They’ll see it soon.',
      });
    } catch (error) {
      console.error('Error sending request:', error);
      setIsExiting(false);
      x.set(0);
      toast.error({
        text: 'Couldn’t send',
        description: error.response?.data?.message || 'Please try again.',
      });
    }
  };

  const handleIgnoreRequest = async (shouldAnimate = true) => {
    if (isExiting) return;
    setIsExiting(true);

    if (shouldAnimate) {
      // Animate card off screen to the left
      await animate(x, -500, { duration: 0.3, ease: 'easeInOut' });
    }

    try {
      const { data } = await axios.post(
        `${BASE_URL}/request/status/ignored/${user._id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeFeed(user._id));
      toast.success({
        text: 'Passed',
        description: data?.message || 'Moving on.',
      });
    } catch (error) {
      console.error('Error ignoring request:', error);
      setIsExiting(false);
      x.set(0);
      toast.error({
        text: 'Error',
        description: error.response?.data?.message || 'Please try again.',
      });
    }
  };

  const handleDragEnd = (_event, info) => {
    const threshold = 120;
    const velocity = info.velocity.x;

    // Check if dragged beyond threshold or has high velocity
    if (info.offset.x > threshold || velocity > 500) {
      // Swiped right - Interested
      handleSendRequest(true);
    } else if (info.offset.x < -threshold || velocity < -500) {
      // Swiped left - Ignore
      handleIgnoreRequest(true);
    } else {
      // Spring back to center
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
    }
  };

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

  if (!user) return null;

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Developer';
  const about = user.about || 'No bio yet.';
  const skills = user.skills || [];
  const hasValidImage = imageSrc && !imageError;

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Interested Label */}
      <motion.div
        className="absolute top-1/2 right-8 -translate-y-1/2 z-20 pointer-events-none"
        style={{ opacity: interestedOpacity }}
      >
        <div className="bg-success/90 text-success-content px-6 py-3 rounded-2xl font-bold text-xl shadow-lg border-2 border-success-content/20">
          INTERESTED
        </div>
      </motion.div>

      {/* Ignore Label */}
      <motion.div
        className="absolute top-1/2 left-8 -translate-y-1/2 z-20 pointer-events-none"
        style={{ opacity: ignoreOpacity }}
      >
        <div className="bg-error/90 text-error-content px-6 py-3 rounded-2xl font-bold text-xl shadow-lg border-2 border-error-content/20">
          IGNORE
        </div>
      </motion.div>

      <motion.article
        className="card card-hover-shine bg-base-100 overflow-hidden rounded-3xl shadow-2xl border border-base-300/50 cursor-grab active:cursor-grabbing"
        style={{
          x,
          rotate,
          opacity,
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: 'grabbing' }}
      >
        {/* Full-bleed image with gradient overlay — Tinder-style */}
        <figure className="relative aspect-[3/4] min-h-[420px] overflow-hidden bg-gradient-to-br from-base-200 to-base-300">
          {hasValidImage ? (
            <>
              <img
                src={imageSrc}
                alt={fullName}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
                onError={() => {
                  setImageError(true);
                  setImageLoaded(false);
                }}
                onLoad={() => {
                  setImageLoaded(true);
                  setImageError(false);
                }}
                loading="lazy"
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-base-200">
                  <span className="loading loading-spinner loading-lg text-primary" />
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-base-content/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24 mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>No photo</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <p className="text-sm">No photo</p>
              </div>
            </div>
          )}
          {/* Bottom gradient overlay for name & skills */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            aria-hidden
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">{fullName}</h2>
            <p className="text-white/90 text-sm mt-1 line-clamp-2">{about}</p>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {skills.slice(0, 4).map((skill) => {
                  const key = typeof skill === 'string' ? skill : String(skill);
                  const label = typeof skill === 'string' ? skill : skill.name || String(skill);
                  return (
                    <span key={key} className="badge badge-primary badge-sm font-medium border-0 opacity-90">
                      {label}
                    </span>
                  );
                })}
                {skills.length > 4 && (
                  <span className="badge badge-ghost badge-sm text-white/80">+{skills.length - 4}</span>
                )}
              </div>
            )}
          </div>
        </figure>

        {/* Tinder-style action buttons */}
        <div className="card-body p-4 flex-row justify-center gap-6 bg-base-100">
          <button
            type="button"
            className="btn btn-circle btn-lg bg-base-200 hover:bg-error/20 hover:border-error/50 border-2 border-base-300 text-base-content action-pulse transition-all"
            onClick={handleIgnoreRequest}
            aria-label="Pass"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <title>Pass</title>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            type="button"
            className="btn btn-circle btn-lg bg-primary hover:bg-primary-focus text-primary-content shadow-lg shadow-primary/25 action-pulse transition-all"
            onClick={handleSendRequest}
            aria-label="Connect"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <title>Connect</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
        </div>
      </motion.article>
    </div>
  );
};
