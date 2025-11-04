import { useSessionStore } from "../components/SessionStore";

export function useAuth() {
  const { setSession} = useSessionStore();
    console.log('useAuth initialized');
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const login = async (username: string, password: string) => {
    console.log('Login attempt:', { username, password });

    const loginRes = await fetch(`${baseUrl}/login`, {
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

  const teamCreated = async (userId: string) => {
    const res = await fetch (`${baseUrl}/team-created`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'UserId': userId
        },
    })
    .then(res => res.json())
    .then(data => {
      setSession(data.id);
      return data;
    })
    .catch(err => {
      console.error(err);
    });
    return res;
  };

  const createTeam = async (name: string, userId: string) => {
    console.log(name, userId)
    const res = await fetch (`${baseUrl}/update/name`, {
      method: 'PUT',
      headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'userId': userId
        },
      body: JSON.stringify({ name})
      }).then(res => res)
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.error(err);
      return { error: 'Creating a Team failed', details: err };
    });
    return res;

  }

  return { login, teamCreated, createTeam};
}