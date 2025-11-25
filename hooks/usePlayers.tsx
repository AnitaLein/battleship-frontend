

export function usePlayers(){
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      const getAllEnemies = async (userId: string) => {
        const res = await fetch (`${baseUrl}/enemies`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'UserId': userId
        },
    })
    .then(res => res.json())
    .catch(err => {
      console.error(err);
    });
    return res;
  };

  const loadOwnPlayer = async (userId: string) => {
    const res = await fetch (`${baseUrl}/ownPlayer`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'UserId': userId
    },
})
.then(res => res.json())
.catch(err => {
  console.error(err);
});
return res.name;
}

  return {getAllEnemies, loadOwnPlayer};
}