const getAiServiceUrl = () => (
  process.env.AI_SERVICE_URL || 'http://localhost:8000'
).replace(/\/+$/, '');

export const getAiEndpoint = (path) => `${getAiServiceUrl()}${path}`;
