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

// const USER_ID = await getUserId();
const USER_ENDPOINT = (userId) => `${ENDPOINT}/${userId}`;

export const getTasks = async (userId) => {
  return fetch(`${USER_ENDPOINT(userId)}/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => data.tasks)
    .catch((error) => {
      if (userId === "") {
        console.log("Component created");
      } else {
        console.error("Error:", error);
      }
    });
};

export const postTask = async (userId, name) => {
  return fetch(`${USER_ENDPOINT(userId)}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name }),
  })
    .then((response) => response.json())
    .then((task) => task)
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const putTask = async (userId, name, id) => {
  return fetch(`${USER_ENDPOINT(userId)}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name }),
  })
    .then((response) => response.json())
    .then((task) => task)
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const delTask = async (userId, id) => {
  await fetch(`${USER_ENDPOINT(userId)}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((error) => {
    console.error("Error:", error);
  });
};
