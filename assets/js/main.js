const API_KEY = "api_key=a5dd5c346531d40b1d39dd3011a2cae5";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&language=es-ES&${API_KEY}`;
const GENRES = [
  {
    id: 28,
    name: "Acción",
  },
  {
    id: 12,
    name: "Aventura",
  },
  {
    id: 16,
    name: "Animación",
  },
  {
    id: 35,
    name: "Comedia",
  },
  {
    id: 80,
    name: "Crimen",
  },
  {
    id: 99,
    name: "Documental",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10_751,
    name: "Familia",
  },
  {
    id: 14,
    name: "Fantasía",
  },
  {
    id: 36,
    name: "Historia",
  },
  {
    id: 27,
    name: "Terror",
  },
  {
    id: 10_402,
    name: "Música",
  },
  {
    id: 9648,
    name: "Misterio",
  },
  {
    id: 10_749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Ciencia ficción",
  },
  {
    id: 10_770,
    name: "Película de televisión",
  },
  {
    id: 53,
    name: "Suspenso",
  },
  {
    id: 10_752,
    name: "Guerra",
  },
  {
    id: 37,
    name: "Western",
  },
];
const $containerMovie = document.querySelector(".content__movies");
const $containerCategories = document.querySelector(".content__categories");
const $containerCart = document.querySelector(".cart__container");
const $heroImageContainer = document.querySelector(".content__image");
const $btnMobile = document.getElementById("btn-hambur");
const $btnCart = document.getElementById("btn-cart");
const $btnCloseCart = document.querySelector(".cart__close");
const $cart = document.querySelector(".cart");
const $btnBuy = document.querySelector(".btn-buy");
const $total = document.querySelector(".cart__total");
const $navLinks = document.querySelector(".navbar__list > ul");
const selectedGenre = [];
let movies = [];

const init = () => {
  window.addEventListener("DOMContentLoaded", async () => {
    makeRequest(API_URL);
    loadGenres();
    refreshCart();
  });

  $btnMobile.addEventListener("click", toggleMenu);
  $btnCart.addEventListener("click", toggleCart);
  $btnCloseCart.addEventListener("click", closeCart);
  $btnBuy.addEventListener("click", makeOrder);
  $navLinks.addEventListener("click", closeOnClick);
  window.addEventListener("scroll", closeOnScroll);
};

const toggleMenu = () => {
  const $menuList = document.querySelector(".navbar .navbar__list ul");
  $menuList.classList.toggle("open-closed");
};

const closeOnClick = (e) => {
  if (!e.target.classList.contains("navbar-link")) return;
  $navLinks.classList.add("open-closed");
};

const closeOnScroll = () => {
  if (
    $navLinks.classList.contains("open-closed") &&
    $cart.classList.contains("open-closed")
  )
    return;
  $navLinks.classList.add("open-closed");
  $cart.classList.add("open-closed");
};

const toggleCart = () => {
  const $cartContainer = document.querySelector(".cart");
  $cartContainer.classList.toggle("open-closed");
};

const closeCart = () => {
  const $cartContainer = document.querySelector(".cart");
  $cartContainer.classList.add("open-closed");
};

const makeRequest = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      renderMovieData(data.results);
      movies = data.results;

      if ($heroImageContainer.hasChildNodes()) {
        return;
      }

      loadHeroImage(data.results[getRandomNumber(0, 19)]);
    });
};

const loadGenres = () => {
  $containerCategories.innerHTML = "";
  GENRES.forEach((genre) => {
    const newElement = document.createElement("button");
    newElement.classList.add("tag");
    newElement.id = genre.id;
    newElement.innerText = genre.name;
    newElement.addEventListener("click", () => {
      if (selectedGenre.length === 0) {
        selectedGenre.push(genre.id);
      } else if (selectedGenre.includes(genre.id)) {
        selectedGenre.forEach((id, curr) => {
          if (id === genre.id) {
            selectedGenre.splice(curr, 1);
          }
        });
      } else {
        selectedGenre.push(genre.id);
      }
      makeRequest(
        `${API_URL}&with_genres=${encodeURI(selectedGenre.join(","))}`
      );
      selectCategory();
    });
    $containerCategories.append(newElement);
  });
};

const renderMovieData = (results) => {
  $containerMovie.innerHTML = "";
  results.forEach((movieData) => {
    $containerMovie.appendChild(createCard(movieData));
  });
};

const createCard = (movie) => {
  const { title, poster_path, id } = movie;
  const newElement = document.createElement("div");
  const IMAGE_URL = `https://image.tmdb.org/t/p/w300${poster_path}`;
  const IMAGE_WIDTH = 230;
  const IMAGE_HEIGHT = 345;
  newElement.innerHTML = `<img width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" src="${IMAGE_URL}" alt="${title}"/> <p>${title}</p> <button onclick="addToCart(${id})">Comprar o alquilar</button>`;
  newElement.className = "animate__animated animate__fadeIn";
  return newElement;
};

const selectCategory = () => {
  const tags = document.querySelectorAll(".tag");
  tags.forEach((tag) => {
    tag.classList.remove("selected");
  });
  if (selectedGenre.length !== 0) {
    selectedGenre.forEach((id) => {
      const selectedTag = document.getElementById(id);
      selectedTag.classList.add("selected");
    });
  }
};

const loadHeroImage = ({ poster_path, title }) => {
  const IMAGE_URL = `https://image.tmdb.org/t/p/w300${poster_path}`;
  const newImage = document.createElement("img");
  newImage.src = IMAGE_URL;
  newImage.alt = title;

  $heroImageContainer.append(newImage);
};

const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Carrito
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

let cart = JSON.parse(localStorage.getItem("Movies")) || [];

const addToCart = (id) => {
  if (cart.some((movie) => movie.id === id)) {
    alert("La película ya está agregada en el carrito.");
    return;
  }
  const movie = movies.find((movie) => movie.id === id);
  cart.push(movie);

  refreshCart();
};

const refreshCart = () => {
  renderCart();
  renderTotal();

  localStorage.setItem("Movies", JSON.stringify(cart));
};

const renderTotal = () => {
  let total = 0;

  cart.forEach((movie) => {
    total += movie.id; // Uso el ID como precio porque la API no tiene precios de las películas.
  });

  $total.innerHTML = `
            <p>Total:</p>
            <span class="total">ARS ${total.toFixed(2)}</span>`;
};

const renderCart = () => {
  $containerCart.innerHTML = "";
  cart.forEach((movie) => {
    $containerCart.appendChild(createCardCart(movie));
  });
};

const createCardCart = (movieData) => {
  const { title, poster_path, id } = movieData;
  const newElement = document.createElement("div");
  const IMAGE_URL = `https://image.tmdb.org/t/p/w300${poster_path}`;
  newElement.innerHTML += `
            <div class="cart__card-movie animate__animated animate__fadeIn">
              <img
                src="${IMAGE_URL}"
                alt=""
              />
              <div class="card-movie__text">
                <p class="card-movie__title">${title}</p>
                </div>
                <div class="card-movie__info">
                  <i class="ri-delete-bin-line" onclick="removeFromCart(${id})"></i>
                </div>
            </div>
  `;
  return newElement;
};

const removeFromCart = (id) => {
  cart = cart.filter((movie) => movie.id !== id);

  refreshCart();
};

const makeOrder = () => {
  if (!cart.length) {
    return;
  }

  alert("Compra realizada con éxito.");
  cart = [];
  refreshCart();
  window.location.reload();
};

init();
