
export const API_Domain = process.env.NODE_ENV === 'production' ? 'https://activity-api.nicksynes.com' : 'http://localhost:3001';
export const API_URL_NicksActivities = `${API_Domain}/nick/getActivities`;
export const API_URL_NicksStreams = `${API_Domain}/nick/getStreams`;
export const API_URL_StravaActivities = `${API_Domain}/auth/getAllActivities`;
export const API_URL_StravaStreams = `${API_Domain}/auth/getStreams`;
export const API_URL_StravaPhoto = `${API_Domain}/auth/StravaPhoto`;
export const API_URL_GetActivity = `${API_Domain}/auth/getActivity`;
export const API_URL_GetActivityPhotos = `${API_Domain}/auth/getActivityPhotos`;

export const URL_Map_Tiles = process.env.NODE_ENV === 'production' ? 'https://{s}.tile.osm.org/{z}/{x}/{y}.png' : 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';