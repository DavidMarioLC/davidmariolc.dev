---
title: Tale detail - Landing Page
slug: tale-detail
date: 2025-01-21
category: E-commerce & 3D
technologies: [nextjs, typescript, sanity, motion, tailwindcss]
cover: cover.webp
description: Transformación de un diseño de alta fidelidad en una experiencia web dinámica, escalable y administrable por el cliente.
---

Transformación de un diseño de alta fidelidad en una experiencia web dinámica, escalable y administrable por el cliente.

---

## 🔗 Enlaces Rápidos

- [🌐 Ver Sitio en Vivo](https://www.taledetail.design/)

---

## 🎯 El Escenario

Recibí un sistema de diseño en Figma con micro-interacciones y un sistema de grillas asimétricas. Mi responsabilidad fue desarrollar el Frontend y la Estrategia de Contenido en el CMS, asegurando que la visión del equipo de UX/UI se mantuviera intacta en todos los dispositivos.

---

## 🛠️ Stack y Herramientas de Colaboración

| Herramienta      | Uso en el Proyecto                                       |
| :--------------- | :------------------------------------------------------- |
| **Figma**        | Inspección de tokens, espaciado y exportación de assets. |
| **Next.js 15**   | Framework principal con App Router.                      |
| **Sanity CMS**   | Modelado de datos para que el diseño sea dinámico.       |
| **Tailwind CSS** | Estilos visuales.                                        |

---

## 🏗️ Implementación Técnica y Colaboración

### 📏 Implementación "Pixel-Perfect"

Mi prioridad fue la consistencia visual. No usé valores arbitrarios, sino que traduje el **Design System** a código:

- **Tokens de Diseño:** Configuré colores, tipografías y sombras directamente en Tailwind para que coincidan 1:1 con Figma.
- **Componentes Atómicos:** Dividí el diseño en átomos y moléculas para facilitar cambios globales sin afectar la estabilidad del sitio.

### 🧩 Del Canvas al CMS (Modelado de Datos)

- Diseñé esquemas en **Sanity** que permiten al editor cambiar imágenes de las secciones y textos sin romper el diseño asimétrico.

---

## 🧠 Desafíos de Ingeniería

- **Hand-off de Assets:** Las imágenes originales eran de alta resolución.
  - _Solución:_ Implementé el pipeline de Sanity para redimensionar imágenes dinámicamente según el viewport, reduciendo el peso de la página en un 60%.

---

## 🤝 Colaboración Dev-Designer

Mantuve un flujo de comunicación constante con el equipo de UX/UI para:

1. Validar y proponer mejoras visuales que no estaban contemplados en el diseño inicial.
2. Proponer ajustes de **Accesibilidad (a11y)** en los contrastes de color y navegación por teclado.
3. Asegurar que las fuentes personalizadas se cargaran sin causar _Layout Shift_.

---

> **Reflexión Profesional:** Este proyecto fortaleció mi capacidad para trabajar en equipos ágiles, demostrando que puedo ser el puente técnico que convierte una visión creativa en un producto digital funcional y de alto rendimiento.
