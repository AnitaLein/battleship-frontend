import { useSessionStore } from "../components/SessionStore";

export function useAuth() {
  const { setSession} = useSessionStore();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const login = async (username: string, password: string) => {

    const loginRes = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
      setSession(data);
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
    const res = await fetch (`${baseUrl}/update/name`, {
      method: 'PUT',
      headers: {
            'Content-Type': 'application/json',
            'userId': userId
        },
      body: JSON.stringify({ name})
      }).then(res => res)
    .then(data => {
      return data.ok
    })
    .catch(err => {
      console.error(err);
      return { error: 'Creating a Team failed', details: err };
    });
    return res;

  }

  return { login, teamCreated, createTeam};
}