# Visión del Producto — Generador de Portales

**Fecha:** 2026-02-22
**Estado:** Borrador inicial

## Descripción General

Plataforma web que permite crear portales web a través de un editor visual drag-and-drop.
Los usuarios pueden diseñar páginas, secciones y componentes de forma visual, asociar
proyectos a empresas, y reutilizar templates predefinidos o personalizados.

## Usuarios y Roles

| Rol           | Descripción                                               | Permisos principales                                        |
| ------------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| Desarrollador | Crea y configura componentes, templates y lógica avanzada | Acceso completo al editor, código, templates, configuración |
| Editor        | Diseña y edita contenido de los portales                  | Editor visual, gestión de contenido, preview                |
| (Por definir) | Roles adicionales según evolución del proyecto            | Por determinar                                              |

Sistema de permisos: RBAC (Role-Based Access Control)

## Funcionalidades Principales

### 1. Autenticación y Gestión de Usuarios

- Login/registro con sistema de roles
- Gestión de permisos por rol (RBAC)
- Invitación de colaboradores a proyectos

### 2. Dashboard / Menú Principal

- Vista general de proyectos
- Acceso rápido a templates
- Gestión de empresas asociadas

### 3. Editor Visual (Canvas)

- Drag-and-drop de componentes
- Edición de atributos de componentes en tiempo real
- Vista de páginas y secciones
- Preview en tiempo real del portal
- Responsive preview (desktop, tablet, móvil)

### 4. Gestión de Proyectos

- Crear proyectos asociados a empresas
- Organizar portales por proyecto
- Historial de versiones

### 5. Sistema de Templates

- Templates predefinidos para arrancar rápido
- Guardar diseños como templates reutilizables
- Catálogo de templates compartidos

### 6. Generación de Portales

- Exportar portales como sitios web funcionales
- Optimización automática (imágenes, código)
- Deploy integrado (futuro)

### 7. Gestión de Medios

- Upload y organización de imágenes y video
- Procesamiento automático (thumbnails, optimización)
- Biblioteca de medios por proyecto

## Diferenciadores

- Editor visual intuitivo que no requiere conocimientos de código para el rol Editor
- Flexibilidad para desarrolladores que quieren personalizar a nivel de código
- Sistema de templates reutilizables que acelera la creación de nuevos portales
- Asociación proyecto-empresa para gestión organizada
