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

      return await res.json().then(data => {
        console.log('Direkt res', data)
        if(data.success){
         return {
          success: data.success,
          targetName: data.targetName,
          targetField: data.targetPos,
          id: data.id,
          isHit: data.isHit,
          isSunk: data.isSunk,
        };
        } else {
          console.log('Attack failed:', data.message);
          return {
            success: data.success,
            message: data.message
          };
        };

      });
    } catch (err) {
      console.error('Error posting attack:', err);
      return err
    }
  };


  const getAllAttacks = async (
    userId: string,
  ) => {
    try {
      const response = await fetch(`${baseUrl}/attacks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'UserId': userId,
        },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('response', data);
      return data;
    } catch (err) {
      console.error('Error fetching attacks:', err);
      throw err;
    }
  };
  return { postAttack, getAllAttacks };
}
