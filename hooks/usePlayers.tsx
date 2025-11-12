

export function usePlayers(){
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      const getAllEnemies = async (userId: string) => {
        const res = await fetch (`${baseUrl}/enemies`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'UserId': userId
        },
    })
    .then(res => res.json())
    .catch(err => {
      console.error(err);
    });
    console.log(res)
    return res;
  };
  return {getAllEnemies}
}