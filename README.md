#  FUSA EXPLOR

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-06B6D4)
![Firebase](https://img.shields.io/badge/Firebase-9.0-FFCA28)

Plataforma que promueve el turismo en Fusagasugá, Cundinamarca.

##  Características

-  **Autenticación**: Email/contraseña, Google y Facebook
-  **Lugares Turísticos**: Lista, detalle, búsqueda y filtrado
-  **Comentarios**: Reseñas con puntuación y modo anónimo
-  **Mapa**: Reportes de tránsito en tiempo real
-  **Clima**: Temperatura, pronóstico y comparativa de zonas
-  **Favoritos y Guardados**: Persistencia en localStorage
-  **Modo Oscuro/Claro**: Personalización de la interfaz
-  **Admin**: CRUD completo de lugares
-  **Diseño Responsivo**: Adaptado a móviles y escritorio

##  Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.x | Framework de UI |
| TypeScript | 5.x | Tipado estático |
| Vite | 4.x | Build tool |
| Tailwind CSS | 3.x | Estilos y diseño |
| Firebase Auth | 9.x | Autenticación |
| Firestore | 9.x | Base de datos |
| Leaflet | 1.9.x | Mapas |
| Open-Meteo | API | Clima |
| Framer Motion | 10.x | Animaciones |

## Instalación

### Requisitos Previos

- Node.js 18 o superior
- NPM o Yarn
- Cuenta de Firebase

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/mikeotavo15-lang/Fusa_Explor.git

# 2. Entrar al directorio
cd Fusa_Explor

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno
cp .env.example .env

# 5. Editar .env con tus credenciales de Firebase

# 6. Ejecutar en modo desarrollo
npm run dev

# 7. Abrir en el navegador
# http://localhost:5173
