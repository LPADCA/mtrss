export const createPostcardRequest = async args => {
  const response = await fetch(`/api/love-message`, {
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const res = await response.json();
    return res;
  }
  throw new Error(response.status);
};

export const toDataURL = url =>
  fetch(url)
    .then(response => {
      if (response.ok) return response.blob();
      throw new Error(response.status);
    })
    .then(
      blob =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );