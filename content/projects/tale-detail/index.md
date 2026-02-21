---
title: Tale detail
slug: tale-detail
date: 2025-01-21
category: E-commerce & 3D
technologies: [angular, clerk, google-cloud]
cover: cover.webp
---

Una Landing page sobre servicios de arquitectura

---

## 🔗 Enlaces Rápidos

- [🚀 Demo en Vivo](https://shop-ar-demo.com)

- [💻 Repositorio GitHub](https://github.com/tuusuario/shop-ar)

- [📦 Documentación API](https://github.com/tuusuario/shop-ar/docs)

---

## 🎯 El Problema

Los usuarios de e-commerce suelen devolver productos de decoración porque "no se ven como esperaban" en su espacio real. Esto genera costos logísticos altos y una tasa de conversión baja en productos de alto valor.

**La Solución:** Una Progressive Web App (PWA) que permite renderizar modelos 3D de los productos directamente en el navegador del usuario, mejorando la confianza en la compra en un 35%.

---

## 🛠️ Stack Tecnológico

| Capa                | Tecnologías                                      |
| ------------------- | ------------------------------------------------ |
| **Frontend**        | React, Next.js (App Router), Tailwind CSS        |
| **3D Engine**       | Three.js, React Three Fiber                      |
| **Backend**         | Node.js, Express, PostgreSQL                     |
| **Infraestructura** | Vercel, AWS S3 (para modelos 3D), GitHub Actions |

---

## 🏗️ Arquitectura y Decisiones Técnicas

### Arquitectura de Componentes

Utilicé una **Arquitectura Atómica** para el frontend, permitiendo que los componentes de la interfaz de usuario sean altamente reutilizables y fáciles de testear de forma aislada.

### Desafíos Técnicos y Soluciones

- **Optimización de Assets:** Los modelos 3D originales pesaban +20MB.
  - _Solución:_ Implementé un pipeline de compresión usando `gltf-pipeline` para convertir archivos `.obj` a `.glb` comprimidos con Draco, reduciendo el peso a <2MB sin pérdida de fidelidad visual.

- **Estado Global Complejo:** El carrito de compras y la configuración de materiales 3D requerían sincronización.
  - _Solución:_ Implementé **Zustand** por su bajo boilerplate y excelente performance en aplicaciones que requieren re-renders frecuentes.

---

## ✨ Características Principales

- **Visualizador 3D:** Rotación, zoom y cambio de texturas en tiempo real.

- **Checkout Seguro:** Integración con la API de Stripe incluyendo Webhooks para validación de pagos.

- **SEO Optimizado:** Uso de _Server-Side Rendering (SSR)_ para las páginas de productos, logrando un Score de 98 en Lighthouse.

- **Dashboard Administrativo:** Gestión de inventario con carga masiva de imágenes a S3.

---

## 📈 Resultados y Aprendizajes

- Aprendí a gestionar la carga asíncrona de recursos pesados mediante **Suspense** y esqueletos de carga personalizados.

- Mejoré mis habilidades en **Matemáticas para 3D** (Vectores y Matrices) para posicionar objetos en el espacio virtual.

- Implementé **Unit Testing** con Vitest para la lógica de cálculo de impuestos y descuentos, asegurando un 0% de errores en el checkout.

---

> **Nota:** Este proyecto fue desarrollado bajo una mentalidad de "Mobile First", asegurando que la experiencia AR funcione perfectamente en dispositivos Android e iOS.
