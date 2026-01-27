import './App.css'
import AuthForm from './components/AuthForm'
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  return (
    <GoogleOAuthProvider clientId="104547372973-dqq8ismlf93uah0h68aks37eihnr4enf.apps.googleusercontent.com">
      <div>
        <AuthForm />
      </div>
    </GoogleOAuthProvider>
  )
}

export default App
