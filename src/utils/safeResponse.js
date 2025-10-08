// Safe response parsing helper
export async function safeParseResponse(response) {
  if (!response) return { success: false, error: 'No response' };
  const status = response.status;
  const retryAfter = response.headers?.get('retry-after') || null;
  const contentType = response.headers?.get('content-type') || '';

  // 429 handling: surface retryAfter and don't attempt to parse as JSON blindly
  if (status === 429) {
    // try to return a parsed body if JSON, otherwise provide a generic message
    if (contentType.includes('application/json')) {
      try {
        const body = await response.json();
        return { success: false, status, retryAfter, error: body };
      } catch (err) {
        return { success: false, status, retryAfter, error: 'Too many requests' };
      }
    }
    const text = await response.text().catch(() => 'Too many requests');
    return { success: false, status, retryAfter, error: text };
  }

  // Non-OK responses: try to parse JSON, otherwise return text
  if (!response.ok) {
    if (contentType.includes('application/json')) {
      try {
        const body = await response.json();
        return { success: false, status, error: body };
      } catch (err) {
        const text = await response.text().catch(() => response.statusText);
        return { success: false, status, error: text };
      }
    }
    const text = await response.text().catch(() => response.statusText);
    return { success: false, status, error: text };
  }

  // OK responses: parse JSON when possible, otherwise return text
  if (contentType.includes('application/json')) {
    try {
      const data = await response.json();
      return { success: true, status, data };
    } catch (err) {
      const text = await response.text().catch(() => null);
      return { success: true, status, data: text };
    }
  }

  const text = await response.text().catch(() => null);
  return { success: true, status, data: text };
}

export default safeParseResponse;
