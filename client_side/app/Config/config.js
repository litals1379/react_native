import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra;

export const API_Somee = extra.API_SOMEE || "https://www.storytimetestsitetwo.somee.com/api/";
export const API_Render_Analyzing = extra.API_RENDER_ANALYZING || "https://storytime-fp9z.onrender.com/analyze";
export const API_SOMEE_USER = extra.API_SOMEE_USER || "https://www.storytimetestsitetwo.somee.com/api/User/";
export const API_SOMEE_USER_REGISTER = extra.API_SOMEE_USER_REGISTER || "https://www.storytimetestsitetwo.somee.com/api/User/register/";
export const API_SOMEE_USER_LOGIN = extra.API_SOMEE_USER_LOGIN || "https://www.storytimetestsitetwo.somee.com/api/User/login";
export const API_SOMEE_USER_GET_BY_EMAIL = extra.API_SOMEE_USER_GET_BY_EMAIL || "https://www.storytimetestsitetwo.somee.com/api/User/GetUserByEmail/";
export const API_SOMEE_USER_ADD_CHILD = extra.API_SOMEE_USER_ADD_CHILD || "https://www.storytimetestsitetwo.somee.com/api/User/addChild/";
export const API_SOMEE_USER_GET_USER_ID = extra.API_SOMEE_USER_GET_USER_ID || "https://www.storytimetestsitetwo.somee.com/api/User/GetUserById/";
export const API_SOMEE_USER_ALL = extra.API_SOMEE_USER_ALL || "https://www.storytimetestsitetwo.somee.com/api/User/all";
export const API_SOMEE_USER_DELETE = extra.API_SOMEE_USER_DELETE || "https://www.storytimetestsitetwo.somee.com/api/User/DeleteUser/";
export const API_SOMEE_USER_UPDATE = extra.API_SOMEE_USER_UPDATE || "https://www.storytimetestsitetwo.somee.com/api/User/UpdateUser/";
export const API_SOMEE_USER_UPDATE_PROFILE_IMAGE = extra.API_SOMEE_USER_UPDATE_PROFILE_IMAGE || "https://www.storytimetestsitetwo.somee.com/api/User/UpdateProfileImage";
export const API_SOMEE_USER_GET_BY_ID = extra.API_SOMEE_USER_GET_BY_ID || "https://www.storytimetestsitetwo.somee.com/api/User/GetUserById/";
export const API_SOMEE_STORY_GENERATE = extra.API_SOMEE_STORY_GENERATE || "https://www.storytimetestsitetwo.somee.com/api/Story/generate";
export const API_SOMEE_STORY_GET_AVAILABLE = extra.API_SOMEE_STORY_GET_AVAILABLE || "https://www.storytimetestsitetwo.somee.com/api/Story/GetAvailableStoriesForChild/";
export const API_SOMEE_STORY_GET_BY_ID = extra.API_SOMEE_STORY_GET_BY_ID || "https://www.storytimetestsitetwo.somee.com/api/Story/GetStoryById/";
export const API_SOMEE_STORY_GET_FOR_CHILD = extra.API_SOMEE_STORY_GET_FOR_CHILD || "https://www.storytimetestsitetwo.somee.com/api/Story/GetStoryForChild/";
export const API_SOMEE_STORY_RATE = extra.API_SOMEE_STORY_RATE || "https://www.storytimetestsitetwo.somee.com/api/Story/RateStory";
export const API_SOMEE_STORY_GET_BOOKS_READ = extra.API_SOMEE_STORY_GET_BOOKS_READ || "https://www.storytimetestsitetwo.somee.com/api/Story/GetBooksReadByChild/";
export const API_SOMEE_READING_SESSION_REPORT = extra.API_SOMEE_READING_SESSION_REPORT || "https://www.storytimetestsitetwo.somee.com/api/ReadingSessionReport";
export const API_SOMEE_READING_SESSION_REPORT_FILTER = extra.API_SOMEE_READING_SESSION_REPORT_FILTER || "https://www.storytimetestsitetwo.somee.com/api/ReadingSessionReport/filter";
export const API_SOMEE_RANDOM_WORDS = extra.API_SOMEE_RANDOM_WORDS || "https://www.storytimetestsitetwo.somee.com/api/randomwords";