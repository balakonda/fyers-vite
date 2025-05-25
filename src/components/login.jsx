import { fyersModel } from 'fyers-web-sdk-v3'
import { useEffect } from 'react'

export default function Login() {
  const fyers = new fyersModel()
  console.log(import.meta.env.VITE_FYERS_CLIENT_ID)
  console.log(import.meta.env.VITE_FYERS_REDIRECT_URL)
  fyers.setAppId(import.meta.env.VITE_FYERS_CLIENT_ID)
  fyers.setRedirectUrl(import.meta.env.VITE_FYERS_REDIRECT_URL)

  var generateAuthcodeURL = fyers.generateAuthCode()
  console.log(generateAuthcodeURL)
  // window.open(generateAuthcodeURL);

  const login = () => {
    window.open(generateAuthcodeURL)
  }

  useEffect(() => {}, [])

  return <button onClick={login}>Login</button>
}
