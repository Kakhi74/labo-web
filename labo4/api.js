const ENDPOINT = "https://glo3102lab4.herokuapp.com";

export const getUserId = async () => {
  return fetch(`${ENDPOINT}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => data.id);
};

const USER_ID = await getUserId();
const USER_ENDPOINT = `${ENDPOINT}/${USER_ID}`;

export const getTasks = async () => {
  return fetch(`${USER_ENDPOINT}/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => data.tasks);
};

export const postTask = async (name) => {
  return fetch(`${USER_ENDPOINT}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name }),
  })
    .then((response) => response.json())
    .then((task) => task);
};

export const putTask = async (name, id) => {
  return fetch(`${USER_ENDPOINT}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name }),
  })
    .then((response) => response.json())
    .then((task) => task);
};

export const delTask = async (id) => {
  await fetch(`${USER_ENDPOINT}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
