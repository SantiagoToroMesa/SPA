# 🚀 User Management System - SPA

Una aplicación de página única (SPA) moderna para la gestión de usuarios, construida con JavaScript vanilla, HTML5 y CSS3.

## ✨ Características

- **🔐 Autenticación de Usuarios**: Sistema de login seguro con roles
- **👥 Gestión de Usuarios**: CRUD completo de usuarios
- **🔒 Control de Acceso**: Roles de administrador y usuario regular
- **📱 Diseño Responsivo**: Funciona en dispositivos móviles y desktop
- **⚡ SPA Moderna**: Navegación sin recarga de página

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: JSON Server (REST API)
- **UI Components**: SweetAlert2
- **Almacenamiento**: LocalStorage, SessionStorage

## 📁 Estructura del Proyecto

```
spa/
├── src/
│   ├── js/
│   │   ├── script.js          # Lógica principal
│   │   └── services.js        # Servicios API
│   ├── css/
│   │   └── styles.css         # Estilos
│   ├── html/
│   │   ├── login.html         # Login
│   │   ├── users.html         # Lista usuarios
│   │   ├── newuser.html       # Crear usuario
│   │   └── about.html         # Información
│   └── images/
│       └── descargar (7).jpg  # Logo
├── db.json                    # Base de datos
├── index.html                 # Punto de entrada
└── README.md                  # Documentación
```

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar el proyecto
```bash
# Opción 1: Ejecutar todo junto
npm run dev

# Opción 2: Ejecutar por separado
npm run server    # Servidor JSON en puerto 3000
npm run start     # Servidor web en puerto 8080
```

### 3. Abrir la aplicación
- Ve a `http://localhost:8080` en tu navegador

## 📖 Uso

### Credenciales de Acceso
- **Administrador**: `admin@example.com` / `admin123`
- **Usuario**: `user@example.com` / `user123`

### Funcionalidades
- **👨‍💼 Administrador**: Ver, crear, editar y eliminar usuarios
- **👤 Usuario Regular**: Solo ver lista de usuarios

## 🔧 Scripts Disponibles

- `npm run server`: Inicia el servidor JSON (puerto 3000)
- `npm run start`: Inicia el servidor web (puerto 8080)
- `npm run dev`: Ejecuta ambos servidores simultáneamente

## 📞 Contacto

- **Versión**: 1.0.0
- **Última Actualización**: Diciembre 2024

---

⭐ ¡Disfruta usando la aplicación!


