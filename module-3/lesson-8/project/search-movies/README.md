# 🎬 Buscador de Películas

Una aplicación moderna para buscar películas utilizando la API de OMDB, desarrollada con Angular 20 y Angular Material.

## ✨ Características

- 🔍 **Búsqueda de películas** por nombre con resultados en tiempo real
- ⭐ **Gestión de favoritos** con persistencia en localStorage
- 📱 **Diseño responsive** que se adapta a todos los dispositivos
- 🎨 **Material Design** con Angular Material
- 🔄 **Paginación** de resultados de búsqueda
- 💾 **Persistencia local** para guardar películas favoritas
- 🚀 **Componentes standalone** con la última arquitectura de Angular

## 🛠️ Tecnologías Utilizadas

- **Angular 20.3.0** - Framework principal
- **Angular Material** - Biblioteca de componentes UI
- **TypeScript 5.9.2** - Lenguaje de programación
- **RxJS** - Programación reactiva
- **OMDB API** - Base de datos de películas

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn
- Angular CLI

## 🚀 Instalación

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd search-movies
```

2. Instalar dependencias:

```bash
npm install
```

3. Iniciar el servidor de desarrollo:

```bash
npm start
```

4. Abrir el navegador en `http://localhost:4200`

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── header/              # Componente de navegación
│   │   ├── search-movies/       # Búsqueda de películas
│   │   └── favorite-movies/     # Gestión de favoritos
│   ├── services/
│   │   ├── api.service.ts       # Servicio para OMDB API
│   │   └── favorites.service.ts # Gestión de favoritos
│   ├── models/
│   │   └── movie.interface.ts   # Interfaces TypeScript
│   ├── environments/            # Variables de entorno
│   ├── app.routes.ts           # Configuración de rutas
│   ├── app.config.ts           # Configuración de la app
│   └── app.ts                  # Componente principal
├── styles.css                  # Estilos globales
└── index.html                  # Archivo HTML principal
```

## 🎯 Funcionalidades Principales

### Búsqueda de Películas

- Búsqueda en tiempo real por nombre
- Resultados con información detallada (título, año, tipo)
- Imágenes de posters de alta calidad
- Paginación para navegar entre resultados
- Manejo de errores y estados de carga

### Gestión de Favoritos

- Agregar/quitar películas de favoritos con un clic
- Visualización de todas las películas favoritas
- Persistencia en localStorage
- Función "deshacer" al eliminar
- Opción para limpiar todos los favoritos

### Interfaz de Usuario

- Navegación intuitiva con tabs en el header
- Badge con contador de favoritos
- Estados vacíos informativos
- Notificaciones (snackbars) para feedback
- Animaciones suaves y transiciones
- Diseño responsive y adaptable

## 🔧 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm test` - Ejecuta las pruebas unitarias
- `npm run watch` - Compila en modo watch

## 🌐 API

La aplicación utiliza la [OMDB API](http://www.omdbapi.com/) para obtener información de películas.

**Configuración de la API:**

- URL: `https://www.omdbapi.com/`
- API Key: configurada en `src/environments/environment.ts`

## 📱 Responsive Design

La aplicación está optimizada para:

- 📱 Dispositivos móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Pantallas grandes (1400px+)

## 🎨 Temas y Estilos

- Tema: **Indigo-Pink** de Angular Material
- Fuente principal: **Roboto**
- Colores primarios: Indigo (#3f51b5)
- Colores de acento: Pink/Warn (#e91e63)

## 🔐 Variables de Entorno

Las variables de entorno están configuradas en:

- `src/environments/environment.ts` (desarrollo)
- `src/environments/environment.prod.ts` (producción)

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://www.omdbapi.com/',
  apiKey: '<apiKey>',
};
```

## 📝 Notas de Desarrollo

- La aplicación utiliza componentes standalone (sin módulos)
- Los servicios son singletons con `providedIn: 'root'`
- Se implementa el patrón Observable/Subject para la reactividad
- localStorage se utiliza para la persistencia de favoritos

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Desarrollado como parte de un proyecto educativo.

## 🙏 Agradecimientos

- [Angular Team](https://angular.dev) por el framework
- [OMDB API](http://www.omdbapi.com/) por la base de datos de películas
- [Angular Material](https://material.angular.dev/) por los componentes UI

---

⭐ Si te gusta este proyecto, no olvides darle una estrella!
