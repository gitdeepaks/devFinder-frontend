import { toast } from '@pheralb/toast';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/contstants';
import { addRequest, removeRequest } from '../utils/request-slice.js';

export const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [isLoading, setIsLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState(new Set());

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/user/request/recieved`, { withCredentials: true });
      const data = response.data?.data || response.data || [];
      dispatch(addRequest(Array.isArray(data) ? data : []));
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error({
        text: 'Couldn’t load requests',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      setProcessingIds((prev) => new Set(prev).add(requestId));
      const response = await axios.post(
        `${BASE_URL}/request/review/accepted/${requestId}`,
        {},
        { withCredentials: true }
      );
      toast.success({
        text: 'Accepted',
        description: response.data?.message || 'You’re now connected!',
      });
      dispatch(removeRequest(requestId));
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error({
        text: 'Couldn’t accept',
        description: error.response?.data?.message || 'Please try again.',
      });
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  const handleReject = async (requestId) => {
    try {
      setProcessingIds((prev) => new Set(prev).add(requestId));
      await axios.post(`${BASE_URL}/request/review/rejected/${requestId}`, {}, { withCredentials: true });
      toast.success({ text: 'Rejected', description: 'Request declined.' });
      dispatch(removeRequest(requestId));
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error({
        text: 'Couldn’t reject',
        description: error.response?.data?.message || 'Please try again.',
      });
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: fetch on mount
  useEffect(() => {
    fetchRequests();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="mt-4 text-base-content/60 font-medium">Loading requests…</p>
      </div>
    );
  }

  if (!requests || !Array.isArray(requests) || requests.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-10">
        <header className="text-center mb-10">
          <h1 className="text-2xl font-bold">Connection Requests</h1>
          <p className="text-base-content/60 mt-1">People who want to connect with you</p>
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
              <title>No requests</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-base-content">No pending requests</h2>
          <p className="mt-2 text-base-content/60 max-w-sm">
            When someone taps the heart on your profile, they’ll appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <header className="flex flex-wrap items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold">Connection Requests</h1>
        <span className="badge badge-primary badge-lg">{requests.length}</span>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {requests.map((req) => {
          const user = req.fromUserId || {};
          const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Developer';
          const about = user.about || 'No bio.';
          const skills = user.skills || [];
          const photoUrl = user.photoUrl;
          const requestId = req._id;
          const isProcessing = processingIds.has(requestId);

          return (
            <article
              key={requestId}
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
                          {user.firstName?.[0]?.toUpperCase() || '?'}
                          {user.lastName?.[0]?.toUpperCase() || ''}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-base-content truncate">{fullName}</h2>
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
                <div className="card-actions justify-end gap-2 mt-4 pt-4 border-t border-base-300/50">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm rounded-xl hover:bg-error/10 hover:text-error"
                    onClick={() => handleReject(requestId)}
                    disabled={isProcessing}
                    aria-label="Reject"
                  >
                    {isProcessing ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden
                        >
                          <title>Pass</title>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Pass
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm rounded-xl"
                    onClick={() => handleAccept(requestId)}
                    disabled={isProcessing}
                    aria-label="Accept"
                  >
                    {isProcessing ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden
                        >
                          <title>Accept</title>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Accept
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
