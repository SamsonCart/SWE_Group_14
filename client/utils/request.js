import { useMessageStore } from '@/store/message';

async function request(type, pureUrl, params = {}, time = null) {
  const baseUrl = import.meta.env.VITE_API_ENDPOINT;
  let url = baseUrl + '/' + pureUrl;
  const { token } = localStorage;

  const headers = {
    'x-access-token': token
  };

  let options = {
    headers,
    method: type?.toUpperCase() || 'GET'
  };

  if (type.toLowerCase() === 'get' && params) {
    // Append query parameters to URL for GET requests
    const urlParams = new URLSearchParams(params).toString();
    url += `?${urlParams}`;
  } else if (['post', 'put', 'patch'].includes(type.toLowerCase())) {
    if (params instanceof FormData) {
      // If params is FormData, do not set content-type (it will be automatically set by the browser)
      options.body = params;
    } else {
      headers['content-type'] = 'application/json';
      options.body = JSON.stringify(params);
    }
  }

  try {
    console.log('Requesting:', url, options);
    const response = await fetch(url, options);
    const data = await response.json();
    console.log('Response:', data);

    const message = data.message || '';

    if (!data.isSuccess) {
      useMessageStore().setError({ error: message, time });
      throw new Error(message);
    } else {
      useMessageStore().setIsSuccess({ message, time });
      return data;
    }
  } catch (err) {
    useMessageStore().setError({ error: err.message, time });
    throw err;
  }
}

export { request };
