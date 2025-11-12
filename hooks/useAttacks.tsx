export function useAttacks() {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const postAttack = async (
    userId: string,
    targetName: string,
    targetField: string
  ) => {
    try {
      const res = await fetch(`${baseUrl}/attacks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'UserId': userId,
        },
        body: JSON.stringify({
          targetName,
          targetField,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.error('Attack failed:', err);
      throw err;
    }
  };

  const getAllAttacks = async (
    userId: string,
  ) => {
      const res = await fetch(`${baseUrl}/attacks`, {
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'UserId': userId,
        },
      })
    .then(res => res.json())
    .catch(err => {
      console.error(err);
    });
    console.log(res)
    return res;
  };
  return { postAttack, getAllAttacks };
}
