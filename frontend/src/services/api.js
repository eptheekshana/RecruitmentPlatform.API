// API client for RecruitmentPlatform API backend

const BASE_URL = '/api';

export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token) => localStorage.setItem('token', token);
export const removeAuthToken = () => localStorage.removeItem('token');

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

async function fetchAPI(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.warn(`[API] ${endpoint} request error:`, err);
    throw err;
  }
}

export const api = {
  auth: {
    login: (email, password) => fetchAPI('/Auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (data) => fetchAPI('/Auth/register', { method: 'POST', body: JSON.stringify(data) }),
  },
  candidate: {
    getProfile: () => fetchAPI('/Candidate/me'),
    updateProfile: (data) => fetchAPI('/Candidate/me', { method: 'PUT', body: JSON.stringify(data) }),
    uploadCV: (fileData) => fetchAPI('/Candidate/me', { method: 'PUT', body: JSON.stringify({ resumeUrl: fileData.name || 'uploaded_resume.pdf' }) }),
  },
  jobs: {
    getAll: () => fetchAPI('/JobPosting'),
    getById: (id) => fetchAPI(`/JobPosting/${id}`),
    create: (data) => fetchAPI('/JobPosting', { method: 'POST', body: JSON.stringify(data) }),
  },
  applications: {
    getAll: (jobId) => fetchAPI(`/Application${jobId ? `?jobId=${jobId}` : ''}`),
    apply: (jobId, coverLetter = '') => fetchAPI('/Application', { method: 'POST', body: JSON.stringify({ jobId, coverLetter }) }),
    updateStatus: (id, status) => fetchAPI(`/Application/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  },
  ai: {
    getStrategies: () => fetchAPI('/Ai/strategies'),
    parseResume: (resumeText, preferredStrategy) => fetchAPI('/Ai/parse-resume', { method: 'POST', body: JSON.stringify({ resumeText, preferredStrategy }) }),
    extractSkills: (content, preferredStrategy) => fetchAPI('/Ai/extract-skills', { method: 'POST', body: JSON.stringify({ content, preferredStrategy }) }),
    rankCandidate: (data) => fetchAPI('/Ai/rank-candidate', { method: 'POST', body: JSON.stringify(data) }),
  },
};

export default api;
