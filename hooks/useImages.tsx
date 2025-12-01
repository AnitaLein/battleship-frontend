

export function useImages() {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const storeProfilePicture = async(userId: string, image: string) => {
        const res = await fetch(`${baseUrl}/upload-profile`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'UserId': userId
            },
            body: JSON.stringify({ image }),
            });

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.status}`);
    }
    return res.json(); // backend returns { message, url }
  };

  const loadProfilePicture = async () => {
      const userId = sessionStorage.getItem('id');
      if (!userId) return;

      try {
        const res = await fetch(`${baseUrl}/ownProfilePicture`, {
          headers: { userId },
        });
        if (!res.ok) throw new Error('Fehler beim Laden des Profilbildes');
        return await res.json();
      } catch (err) {
        console.error(err);
      }
    };

  const storeAttackPicture = async(userId: string, image: string, attackId: string) => {
    const res = await fetch(`${baseUrl}/attackPicture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'UserId': userId
      },
      body: JSON.stringify({ attackId, image }),
    });

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.status}`);
    }
    return res.json();
  };

  const loadAttackPicture = async (userId: string, attackId: string) => {

    try {
      const res = await fetch(`${baseUrl}/attackPicture/${attackId}`, {
        headers: { userId },
      });
      console.log(res)
      if (!res.ok) throw new Error('Fehler beim Laden des Angriffsbildes');
      return await res.json();

    } catch (err) {
      console.error(err);
    }
  };

  const loadEnemyProfilePicture = async (userId: string, enemyName: string) => {
    try {
      const res = await fetch(`${baseUrl}/enemyProfilePicture/`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'UserId': userId
      },
        body: JSON.stringify({ enemyTeamName: enemyName }),
      });
      if (!res.ok) return;
      return await res.json();
    } catch (err) {
      console.error(err);
    }
  };

  return { storeProfilePicture, loadProfilePicture, storeAttackPicture, loadAttackPicture, loadEnemyProfilePicture };
}