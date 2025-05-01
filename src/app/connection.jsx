"use client";
import React from "react";
import Accordion from "@mui/material/Accordion";
import fyers, { setProfile, userProfile } from "../components/getFyersAPI";
import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

const Profile = ({ profile }) => {
  return (
    <Accordion>
      <AccordionSummary>
        <Typography variant="p">Profile: {profile?.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Button
          onClick={() => {
            // Open in new tab /signin
            window.open("/signin", "_blank");
          }}
        >
          Sign In
        </Button>
        <Button
          onClick={() => {
            localStorage.clear();
            window.open("/signin", "_blank");
          }}
        >
          Sign Out
        </Button>

        <Divider />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {/* <Typography variant="body1">{profile?.name}</Typography> */}
          <Typography variant="body2">{profile?.fy_id}</Typography>
          <Typography variant="body2">{profile?.email_id}</Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default function InitConnection() {
  const [authResponse, setAuthResponse] = useState(null);
  // http://192.168.137.1:3000/?s=ok&code=200&auth_code=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkubG9naW4uZnllcnMuaW4iLCJpYXQiOjE3NDE0MTU1MzIsImV4cCI6MTc0MTQ0NTUzMiwibmJmIjoxNzQxNDE0OTMyLCJhdWQiOiJbXCJ4OjBcIiwgXCJ4OjFcIiwgXCJ4OjJcIiwgXCJkOjFcIiwgXCJkOjJcIiwgXCJ4OjFcIiwgXCJ4OjBcIl0iLCJzdWIiOiJhdXRoX2NvZGUiLCJkaXNwbGF5X25hbWUiOiJGSDAzNjUiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiI0ODc0ZmEzOTQyYzRhNjg5OWNhMTRhOTFiMWIwOTJiZTU5ZTNjN2YyMzhiMDMyY2M5ODE4N2Q5NSIsImlzRGRwaUVuYWJsZWQiOiJOIiwiaXNNdGZFbmFibGVkIjoiTiIsIm5vbmNlIjoiIiwiYXBwX2lkIjoiS0hCRFRGSEVTWSIsInV1aWQiOiIyNjgwYmMwNjMxN2I0YmQzOWI1OTc5YTFjZjYwZjllNiIsImlwQWRkciI6IjAuMC4wLjAiLCJzY29wZSI6IiJ9.L9mJ4w2EnMHg93J5uUOqgrIMzJ_KBHgzG3vdKiBo1iw&state=sample_state

  const searchParams = useSearchParams();

  // console.log(searchParams);
  const authCode = searchParams?.get("auth_code");

  // console.log(authCode)@
  const profileData = useMemo(() => JSON.parse(localStorage.getItem("profile")), []);
  const accessToken = useMemo(() => localStorage.getItem("access_token"), []);

  useEffect(() => {
    const getAccessToken = async () => {
      const response = await fyers.generate_access_token({
        auth_code: authCode,
        secret_key: import.meta.env.VITE_FYERS_APP_SECRET,
        client_id: import.meta.env.VITE_FYERS_CLIENT_ID,
      });
      console.log(response);
      setAuthResponse(response);
      if (response.access_token) {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        fyers.setAccessToken(response.access_token);
        const newProfileData = await fyers.get_profile();
        console.log(newProfileData);
        localStorage.setItem("profile", JSON.stringify(newProfileData.data));
        setProfile(newProfileData.data);

        window.location.href = "/";
      }
    };
    if (authCode && fyers) {
      getAccessToken();
    }
    if (accessToken) {
      fyers.setAccessToken(accessToken);
    }
    if (profileData) {
      setProfile(profileData);
    }

    const getProfile = async () => {
      const newProfileData = await fyers.get_profile();
      console.log(newProfileData);
      localStorage.setItem("profile", JSON.stringify(newProfileData.data));
      setProfile(newProfileData.data);
    };

    if (accessToken && !profileData) {
      getProfile();
    }
  }, [authCode, accessToken, profileData]);

  return (
    <>
      <Profile profile={userProfile()} />
      <Divider sx={{ my: 1 }} />
    </>
  );
}
