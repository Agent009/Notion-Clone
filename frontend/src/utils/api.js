import qs from "qs";

/**
 * Get full Strapi URL from path
 * @param {string} path Path of the URL
 * @returns {string} Full Strapi URL
 */
export function getStrapiURL(path = "") {
  // console.log(`Path:`, path, `API_URL:`, process.env.NEXT_PUBLIC_API_URL);
  return `${
    process.env.REACT_APP_NEXT_PUBLIC_API_URL || "http://localhost:1337"
  }${path}`;
}

export function getStrapiAPIURL(path = "") {
  // console.log(`Path:`, path, `API_URL:`, process.env.NEXT_PUBLIC_API_URL);
  return (
    `${process.env.REACT_APP_NEXT_PUBLIC_API_URL || "http://localhost:1337"}` +
    `/` +
    process.env.REACT_APP_API_PREFIX +
    `${path}`
  );
}

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path Path of the API route
 * @param {Object} urlParamsObject URL params object, will be stringified
 * @param {Object} options Options passed to fetch
 * @returns Parsed API call response
 */
export async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  // Merge default and user options
  const mergedOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.REACT_APP_BEARER_TOKEN,
    },
    ...options,
  };

  // Build request URL
  const queryString = qs.stringify(urlParamsObject);
  const requestUrl = `${getStrapiURL(
    `/` +
      process.env.REACT_APP_API_PREFIX +
      `${path}${queryString ? `?${queryString}` : ""}`
  )}`;

  // Trigger API call
  let response;

  try {
    response = await fetch(requestUrl, mergedOptions);
  } catch (e) {
    console.error(e);
    throw new Error(`API call failure (` + requestUrl + `).`);
  }

  // Handle response
  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(
      `API call failure (` + requestUrl + `). ` + response.statusText
    );
  }

  return await response.json();
}
