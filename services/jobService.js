const API_BASE_URL = '/api/jobs';

/**
 * Creates a new job posting.
 * @param {object} jobData 
 * @returns {Promise<any>}
 */
export const createJob = async (jobData) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create job');
  }

  return data;
};

/**
 * Fetches jobs from the API, with optional filters.
 * @param {object} filters
 * @param {string} [filters.category] - e.g., 'Repairs'
 * @param {string} [filters.location] - e.g., 'Manila'
 * @param {string} [filters.q] - e.g., 'fix sink'
 * @returns {Promise<any>} The list of jobs.
 */
export const getJobs = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.location) params.set('location', filters.location);
  if (filters.q) params.set('q', filters.q);

  const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch jobs');
  }

  return data;
};