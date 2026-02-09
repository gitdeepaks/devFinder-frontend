/** Per-route SEO meta. Used by Body + Helmet for document title and meta tags. */
export const ROUTE_META = {
  '/': {
    title: 'DevFinder — Connect with developers',
    description:
      'Swipe to discover and connect with developers. Find your next collaborator, mentor, or co-founder.',
  },
  '/login': {
    title: 'Log in — DevFinder',
    description: 'Log in to DevFinder to discover and connect with developers.',
  },
  '/signup': {
    title: 'Sign up — DevFinder',
    description: 'Create your DevFinder account and start connecting with developers.',
  },
  '/profile': {
    title: 'Profile — DevFinder',
    description: 'View and manage your DevFinder profile.',
  },
  '/connections': {
    title: 'Connections — DevFinder',
    description: 'View your DevFinder connections.',
  },
  '/requests': {
    title: 'Connection requests — DevFinder',
    description: 'Manage your DevFinder connection requests.',
  },
  '/premium': {
    title: 'Premium — DevFinder',
    description: 'Upgrade to DevFinder Premium for more features.',
  },
};

export const DEFAULT_META = {
  title: 'DevFinder — Connect with developers',
  description:
    'Swipe to discover and connect with developers. Find your next collaborator, mentor, or co-founder.',
};
