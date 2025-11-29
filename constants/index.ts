export const USER_ROLES = {
  SEEKER: 'seeker',
  POSTER: 'poster',
} as const;

export const JOB_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
} as const;

export const JOB_CATEGORIES = [
  'Repairs',
  'Gardening',
  'Tutoring',
  'Delivery',
  'Errands',
  'Cleaning',
  'Moving',
  'Other',
] as const;

export const SKILLS = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Landscaping',
  'Cleaning',
  'Cooking',
  'Driving',
  'Teaching',
  'Childcare',
  'Pet Care',
  'Computer Skills',
  'Heavy Lifting',
  'Customer Service',
] as const;