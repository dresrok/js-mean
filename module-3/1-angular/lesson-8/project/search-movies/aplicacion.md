# Buscador de películas

## Requerimientos funcionanales

- El usuario debe poder buscar películas por nombre
- El usuario debe poder ver la lista de películas
- El usuario debe poder marcar una película como favorita

## Librerias

- Para la interfaz de usuario se utilizará Angular Material https://material.angular.dev/

## API

- El API de la aplicación se conectará a la API de https://www.omdbapi.com/
- El key de la API es: <apiKey>
- Define tanto el api como el key como variables de entorno en el archivo .env
- Ejemplo de url para buscar películas: https://www.omdbapi.com/?apikey=<apiKey>&s=avengers&page=1
- Ejemplo de la respuesta de la API:
  {
  "Search": [
  {
  "Title": "Avengers: Endgame",
  "Year": "2019",
  "imdbID": "tt4154756",
  "Type": "movie",
  "Poster": "https://m.media-amazon.com/images/M/MV5BMTc5MDE2MjI4OV5BMl5BanBnXkFtZTgwMzI2NzM0NTM@._V1_SX300.jpg"
  }
  ],
  "totalResults": "100",
  "Response": "True"
  }
- Cree un servicio para las consultas a la API

## Variables de entorno

- API_URL=https://www.omdbapi.com/
- API_KEY=<apiKey>

## Arquitectura de la componentes

- Componente de Header, recibe in @Input, que es el nombre de la aplicación "Buscador de películas"
- Componente llamado SearchMovies (debe ser un menu en el header)
  - Este componente debe tener un input de texto para buscar películas
  - Este componente debe tener un botón para buscar películas
  - Debe mostrar la lista de películas encontradas
  - Cada card debe tener un botón para marcar la película como favorita
- Componenete llamado FavoriteMovies (debe ser un menu en el header)
  - Debe mostrar la lista de películas favoritas
  - Debe permitir eliminar una película de favoritos
  - Utiliza local storage para guardar las películas favoritas
  - Cree un servicio para las películas favoritas
