import { fyersModel } from "fyers-web-sdk-v3";

const fyers = new fyersModel();

fyers.setAppId(import.meta.env.VITE_FYERS_APP_ID);
fyers.setRedirectUrl(import.meta.env.VITE_FYERS_REDIRECT_URL);

let profileData = localStorage.getItem("profile");
const accessToken = localStorage.getItem("access_token");

if (accessToken) {
  fyers.setAccessToken(accessToken);
}

if (profileData) {
  profileData = JSON.parse(profileData);
}

export const setProfile = (profile) => {
  profileData = profile;
};

export const userProfile = () => {
  return profileData;
};

export default fyers;
