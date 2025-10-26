import { useSessionStore } from "../components/SessionStore";

export function useAuth() {
  const { setSession} = useSessionStore();
    console.log('useAuth initialized');
  const login = async (username: string, password: string) => {
    console.log('Login attempt:', { username, password });
    console.log('Sending request to:', process.env.NEXT_PUBLIC_BACKEND_URL + "/battleship/login");

    const loginRes = await fetch('http://localhost:5000/battleship/login', {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
      setSession(data.id);
      return data;
    })
    .catch(err => {
      console.error(err);
      return { error: 'Login failed', details: err };
    });
    return loginRes;
  };




  return { login};
}