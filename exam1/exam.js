// Chap1 : présentation et notions de base
// chap2 : Architecture et javascript de base
// chap3 : javascript moderne
// chap4 : interactions serveur
// chap5 : Architecture web

// La ressource retourne le JSON suivant :

// {"movie": {

//     “name”: “Saw”,

//    "image": {
//         "src": "images/saw.png",
//         "name": "saw"
//     }
// }}

fetch("https://umovie.com/movies/1")
  .then((response) => {
    if (!response.ok) {
      if (response.status === 503) {
        throw new Error(
          `Service temporairement indisponible (503). Veuillez réessayer plus tard. ${response.statusText}`
        );
      } else {
        throw new Error(`Error ${response.status} : ${response.statusText}`);
      }
    }
    return response.json();
  })
  .then((data) => {
    const movie = data.movie;
    const movieElement = document.getElementById("movie1");
    movieElement.innerHTML = `
      <h2>${movie.name}</h2>
      <img src="${movie.image.src}" alt="${movie.image.name}" />
    `;
  })
  .catch((error) => {
    console.error(error.message);
  });

const getMovie = new Promise((resolve, reject) => {
  const request = new XMLHttpRequest();
  request.open("GET", "https://umovie.com/movies/1");
  request.onload = () => {
    if (request.status === 200) {
      resolve(request.response);
    } else if (request.status === 503) {
      reject(
        Error(
          `Service temporairement indisponible (503). Veuillez réessayer plus tard. ${request.statusText}`
        )
      );
    } else {
      reject(Error(`Error ${request.status} : ${request.statusText}`));
    }
  };
  request.onerror = () => {
    reject(Error("Error fetching data."));
  };
  request.send();
});

getMovie
  .then((data) => {
    const movie = JSON.parse(data).movie;
    const movieElement = document.getElementById("movie1");
    movieElement.innerHTML = `
    <h2>${movie.name}</h2>
    <img src="${movie.image.src}" alt="${movie.image.name}" />
  `;
  })
  .catch((error) => {
    console.error(error.message);
  });

async function fetchMovieAsync() {
  try {
    const response = await fetch("https://umovie.com/movies/1");
    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else if (response.status === 503) {
      throw new Error(
        `Service temporairement indisponible (503). Veuillez réessayer plus tard. ${response.statusText}`
      );
    } else {
      throw new Error(`Error ${response.status} : ${response.statusText}`);
    }
  } catch (error) {
    throw error;
  }
}

async function displayMovie() {
  try {
    const data = await fetchMovieAsync();
    const movie = data.movie;
    const movieElement = document.getElementById("movie1");
    movieElement.innerHTML = `
        <h2>${movie.name}</h2>
        <img src="${movie.image.src}" alt="${movie.image.name}" />
      `;
  } catch (error) {
    console.error(error.message);
  }
}

displayMovie();

class Book {
  #name;
  #numberOfPages;
  #numberOfChapters;

  constructor(name, numberOfPages, numberOfChapters) {
    this.#name = name;
    this.#numberOfPages = numberOfPages;
    this.#numberOfChapters = numberOfChapters;
  }

  get name() {
    return this.#name;
  }

  getInformation() {
    return `Nom: ${this.#name}, Nombre de pages: ${
      this.#numberOfPages
    }, Nombre de chapitres: ${this.#numberOfChapters}`;
  }

  getAverageNumberOfPagesPerChapter() {
    return this.#numberOfPages / this.#numberOfChapters;
  }
}

const book = new Book("Le Seigneur des Anneaux", 1200, 12);
console.log(book.getInformation());
console.log(book.name);

class Library {
  #borrowedBooks;
  #availableBooks;

  constructor(books = []) {
    this.#borrowedBooks = new Map();
    this.#availableBooks = new Map(books.map((book) => [book.name, book]));
  }

  addBook(book) {
    if (
      this.#availableBooks.has(book.name) ||
      this.#borrowedBooks.has(book.name)
    ) {
      throw new Error(
        `Le livre ${book.name} existe déjà dans la bibliothèque.`
      );
    }
    this.#availableBooks.set(book.name, book);
  }

  borrowBook(name) {
    if (!this.#availableBooks.has(name)) {
      throw new Error(`Le livre ${name} n'est pas disponible ou n'existe pas.`);
    }
    const book = this.#availableBooks.get(name);
    this.#availableBooks.delete(name);
    this.#borrowedBooks.set(name, book);
    return book;
  }

  removeBook(name) {
    if (this.#availableBooks.has(name)) {
      this.#availableBooks.delete(name);
    } else if (this.#borrowedBooks.has(name)) {
      this.#borrowedBooks.delete(name);
    } else {
      throw new Error(`Le livre ${name} n'existe pas dans la bibliothèque.`);
    }
  }
}

class Library {
  #borrowedBooks;
  #availableBooks;

  constructor(books = []) {
    this.#borrowedBooks = [];
    this.#availableBooks = [...books];
  }

  #findBook(name) {
    return (
      this.#availableBooks.some((book) => book.name === name) ||
      this.#borrowedBooks.some((book) => book.name === name)
    );
  }

  addBook(book) {
    if (!this.#findBook(book.name)) {
      this.#availableBooks.push(book);
    }
  }

  borrowBook(name) {
    const bookIndex = this.#availableBooks.findIndex(
      (book) => book.name === name
    );
    if (bookIndex === -1) {
      throw new Error(`Le livre ${name} n'est pas disponible ou n'existe pas.`);
    }
    const removedBook = this.#availableBooks.splice(bookIndex, 1)[0];
    this.#borrowedBooks.push(removedBook);
  }

  removeBook(name) {
    let bookIndex = this.#availableBooks.findIndex(
      (book) => book.name === name
    );
    if (bookIndex !== -1) {
      this.#availableBooks.splice(bookIndex, 1);
    }

    bookIndex = this.#borrowedBooks.findIndex((book) => book.name === name);
    if (bookIndex !== -1) {
      this.#borrowedBooks.splice(bookIndex, 1);
    }
  }
}

const book1 = new Book("Le Seigneur des Anneaux", 1200, 12);
const book2 = new Book("Harry Potter", 800, 10);
const library = new Library([book1, book2]);
library.addBook(new Book("Le Seigneur des Anneaux", 1200, 12)); // Error
library.borrowBook("Le Seigneur des Anneaux");
library.borrowBook("Harry Potter");
library.borrowBook("caca");
library.removeBook("Harry Potter");
library.removeBook("Le Seigneur des Anneaux");
library.removeBook("Le Seigneur des Anneaux"); // Error
