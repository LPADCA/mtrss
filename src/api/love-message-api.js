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

export const getPostcardRequest = async url => {
  const response = await fetch(`/api/love-message/${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const res = await response.json();
    console.log('getPostcardRequest', res)
    return res;
  }
  throw new Error(response.status);
};
