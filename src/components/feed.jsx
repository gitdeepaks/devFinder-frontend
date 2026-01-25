import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from '@pheralb/toast';
import { BASE_URL } from '../utils/contstants';
import { addFeed } from '../utils/feed-slice';
import { UserCard } from './user-card';

export const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [isLoading, setIsLoading] = useState(false);

  const getFeed = async () => {
    try {
      // Don't fetch if feed already exists
      if (feed && Array.isArray(feed) && feed.length > 0) return;
      
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/user/feed`, { withCredentials: true });
      
      // Ensure response.data is an array
      const feedData = Array.isArray(response.data) ? response.data : response.data?.data || [];
      dispatch(addFeed(feedData));
      console.log('Feed data:', feedData);
    } catch (error) {
      console.error('Error fetching feed:', error);
      toast.error({
        text: 'Feed Error',
        description: 'Failed to load feed. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: reason
  useEffect(() => {
    getFeed();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-10 min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }


  // Check if feed is null, undefined, or not an array
  if (!feed || !Array.isArray(feed) || feed.length === 0) {
    return (
      <div className="flex justify-center items-center my-10 min-h-[400px]">
        <div className="text-center">
          <p className="text-lg text-base-content/70">No users found in feed</p>
          <p className="text-sm text-base-content/50 mt-2">Check back later for new connections</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 my-10 px-4">
      {feed.map((user) => (
        <UserCard user={user} key={user._id || user.id || Math.random()} />
      ))}
    </div>
  );
};
