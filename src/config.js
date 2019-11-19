const apiDomain = process.env.NODE_ENV === 'development' ? '' : 'http://activity-api.nicksynes.com';

export const API_URL_Nick = `${apiDomain}/nick/getActivities`;
export const API_URL_StravaActivities = `${apiDomain}/auth/getAllActivities`;
export const API_URL_StravaStreams = `${apiDomain}/auth/getStreams`;
export const API_URL_StravaPhoto = `${apiDomain}/auth/StravaPhoto`;