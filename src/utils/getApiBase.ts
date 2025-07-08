let cachedApiBase: string | null = null;

async function checkServer(url: string, timeout = 2000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(id);

    return response.ok;
  } catch {
    return false;
  }
}

export async function getApiBase(): Promise<string> {
  if (cachedApiBase) return cachedApiBase;

  if (await checkServer('http://localhost:3001')) {
    cachedApiBase = 'http://localhost:3001/api';
  } else if (await checkServer('http://localhost:8888')) {
    cachedApiBase = 'http://localhost:8888/.netlify/functions';
  } else {
    cachedApiBase = '/.netlify/functions';
  }

  return cachedApiBase;
}
