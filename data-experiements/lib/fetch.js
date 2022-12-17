export const fetchData = async (url, format = 'json') => await (await fetch(url))[format]();
