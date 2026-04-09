/**
 * Formats the image source URL.
 * If the path starts with /uploads, it returns it as is (expecting the Vite proxy to handle it).
 * If the path is a full URL, it returns it as is.
 * If no path is provided, it returns a placeholder.
 */
export const getCarImage = (path) => {
    if (!path) return 'https://via.placeholder.com/800x600?text=No+Image';

    // If it's a full URL (starts with http)
    if (path.startsWith('http')) return path;

    // If it's a relative path starting with /uploads, return it as is
    // The Vite proxy in vite.config.js will redirect it to the backend
    if (path.startsWith('/uploads')) return path;

    // If it's a local path from the backend but without the leading slash
    if (path.startsWith('uploads')) return '/' + path;

    return path;
};
