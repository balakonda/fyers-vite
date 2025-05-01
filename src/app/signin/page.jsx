
import { fyersModel } from "fyers-web-sdk-v3";
import { useEffect } from "react";

export default function Signin() {
  const fyers = new fyersModel();
  console.log(import.meta.env.VITE_FYERS_CLIENT_ID);
  console.log(import.meta.env.VITE_FYERS_CLIENT_ID);
  fyers.setAppId(import.meta.env.VITE_FYERS_CLIENT_ID);
  fyers.setRedirectUrl(import.meta.env.VITE_FYERS_CLIENT_ID);

  var generateAuthcodeURL = fyers.generateAuthCode();
  console.log(generateAuthcodeURL);
  // window.open(generateAuthcodeURL);

  const login = () => {
    window.open(generateAuthcodeURL);
  };

  useEffect(() => {}, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <button onClick={login}>Login</button>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
