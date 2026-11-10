// Todo el contenido de la presentación vive aquí.
// IMPORTANTE: todas las cifras de ventas, clientes e inventario son FICTICIAS (demo).

import {
  Coffee, Croissant, Cookie, CupSoda, Candy, Wheat, Egg, Milk, Soup, Beef, Banana,
  Citrus, CakeSlice, Popcorn, IceCreamCone, Cherry, Apple, Leaf, Package, Cake, Gift,
  Trophy, ShoppingBasket, Sun, Boxes, Users, Receipt, ChartColumn, ChartLine, Heart,
  Brain, ShoppingCart, Megaphone, Store,
} from 'lucide-react'

export const brand = {
  name: 'Colombian Commerce OS',
  short: 'Commerce OS',
  storeName: 'Mercado Colombia LA',
  price: 4200,
  currency: 'USD',
  // Cambia este enlace por el correo o calendario del equipo comercial.
  ctaHref: 'mailto:?subject=Colombian%20Commerce%20OS%20%E2%80%94%20Comenzar%20proyecto',
}

export const scenes = [
  { id: '01', label: 'El comienzo' },
  { id: '02', label: 'Más que e-commerce' },
  { id: '03', label: 'Experiencia de compra' },
  { id: '04', label: 'Datos y decisiones' },
  { id: '05', label: 'Clientes' },
  { id: '06', label: 'Inventario' },
  { id: '07', label: 'Todo conectado' },
  { id: '08', label: 'La inversión' },
]

// Colores de acento (hue) por familia de producto
export const tones = {
  gold: ['#f6c945', '#b8860b'],
  azure: ['#7d97ff', '#3150c9'],
  ember: ['#ff7a6e', '#b8302d'],
  jade: ['#5fe0b3', '#1f8f69'],
  cocoa: ['#d9a37a', '#7a4a2a'],
  cream: ['#f3e3c3', '#b49a6a'],
}

export const products = [
  { name: 'Café de origen', icon: Coffee, tone: 'cocoa', price: 14.9 },
  { name: 'Arepas', icon: Wheat, tone: 'gold', price: 5.49 },
  { name: 'Pan de bono', icon: Croissant, tone: 'cream', price: 6.99 },
  { name: 'Almojábanas', icon: Croissant, tone: 'gold', price: 6.49 },
  { name: 'Bocadillo', icon: Candy, tone: 'ember', price: 3.99 },
  { name: 'Arequipe', icon: Cake, tone: 'cocoa', price: 7.25 },
  { name: 'Chocolate de mesa', icon: Coffee, tone: 'cocoa', price: 5.99 },
  { name: 'Gaseosa', icon: CupSoda, tone: 'ember', price: 2.49 },
  { name: 'Panela', icon: Boxes, tone: 'gold', price: 3.49 },
  { name: 'Obleas', icon: Cookie, tone: 'cream', price: 4.99 },
  { name: 'Achiras', icon: Cookie, tone: 'gold', price: 3.79 },
  { name: 'Buñuelos', icon: Cookie, tone: 'gold', price: 8.99 },
  { name: 'Natilla', icon: CakeSlice, tone: 'cream', price: 5.49 },
  { name: 'Queso campesino', icon: Milk, tone: 'cream', price: 7.99 },
  { name: 'Kumis', icon: Milk, tone: 'azure', price: 4.29 },
  { name: 'Chicharrón', icon: Beef, tone: 'ember', price: 9.49 },
  { name: 'Plátano', icon: Banana, tone: 'jade', price: 1.29 },
  { name: 'Lulo', icon: Citrus, tone: 'jade', price: 4.49 },
  { name: 'Maracuyá', icon: Citrus, tone: 'gold', price: 4.99 },
  { name: 'Guayaba', icon: Apple, tone: 'ember', price: 3.99 },
  { name: 'Tamal', icon: Soup, tone: 'jade', price: 11.99 },
  { name: 'Ajiaco', icon: Soup, tone: 'gold', price: 12.49 },
  { name: 'Huevos criollos', icon: Egg, tone: 'cream', price: 6.49 },
  { name: 'Maní', icon: Popcorn, tone: 'cocoa', price: 2.99 },
  { name: 'Paleta de mora', icon: IceCreamCone, tone: 'ember', price: 2.49 },
  { name: 'Uchuvas', icon: Cherry, tone: 'gold', price: 5.49 },
  { name: 'Aromática', icon: Leaf, tone: 'jade', price: 3.29 },
  { name: 'Mercado', icon: Package, tone: 'azure', price: 0 },
]

export const growthWords = ['Más productos.', 'Más clientes.', 'Más datos.', 'Más decisiones.']

/* ---------- Escena 02 ---------- */
export const ecommerceNodes = [
  { label: 'Inventario', icon: Boxes, tone: 'gold' },
  { label: 'Clientes', icon: Users, tone: 'azure' },
  { label: 'Pedidos', icon: Receipt, tone: 'ember' },
  { label: 'Ventas', icon: ChartColumn, tone: 'jade' },
  { label: 'Analítica', icon: ChartLine, tone: 'azure' },
  { label: 'Fidelización', icon: Heart, tone: 'ember' },
  { label: 'Inteligencia', icon: Brain, tone: 'gold' },
]

/* ---------- Escena 03 ---------- */
export const categories = ['Todo', 'Café', 'Panadería', 'Snacks', 'Bebidas', 'Dulces', 'Despensa', 'Congelados']

export const bundles = [
  {
    id: 'desayuno',
    title: 'Desayuno colombiano',
    caption: 'Arepa, queso y café',
    icon: Sun,
    tone: 'gold',
    items: [
      { name: 'Arepas de maíz', qty: 2, price: 5.49, icon: Wheat, tone: 'gold' },
      { name: 'Queso campesino', qty: 1, price: 7.99, icon: Milk, tone: 'cream' },
      { name: 'Café de origen 500 g', qty: 1, price: 14.9, icon: Coffee, tone: 'cocoa' },
      { name: 'Chocolate de mesa', qty: 1, price: 5.99, icon: Coffee, tone: 'cocoa' },
      { name: 'Pan de bono x6', qty: 1, price: 6.99, icon: Croissant, tone: 'cream' },
    ],
  },
  {
    id: 'antojos',
    title: 'Antojos',
    caption: 'Dulce y salado',
    icon: Candy,
    tone: 'ember',
    items: [
      { name: 'Obleas con arequipe', qty: 2, price: 4.99, icon: Cookie, tone: 'cream' },
      { name: 'Bocadillo', qty: 1, price: 3.99, icon: Candy, tone: 'ember' },
      { name: 'Achiras', qty: 2, price: 3.79, icon: Cookie, tone: 'gold' },
      { name: 'Maní salado', qty: 1, price: 2.99, icon: Popcorn, tone: 'cocoa' },
    ],
  },
  {
    id: 'familiar',
    title: 'Mercado familiar',
    caption: 'La despensa completa',
    icon: ShoppingBasket,
    tone: 'jade',
    items: [
      { name: 'Panela', qty: 2, price: 3.49, icon: Boxes, tone: 'gold' },
      { name: 'Plátano verde', qty: 4, price: 1.29, icon: Banana, tone: 'jade' },
      { name: 'Arepas de maíz', qty: 2, price: 5.49, icon: Wheat, tone: 'gold' },
      { name: 'Huevos criollos', qty: 1, price: 6.49, icon: Egg, tone: 'cream' },
      { name: 'Café de origen 500 g', qty: 1, price: 14.9, icon: Coffee, tone: 'cocoa' },
    ],
  },
  {
    id: 'futbol',
    title: 'Noche de fútbol',
    caption: 'Para ver el partido',
    icon: Trophy,
    tone: 'azure',
    items: [
      { name: 'Chicharrón', qty: 1, price: 9.49, icon: Beef, tone: 'ember' },
      { name: 'Gaseosa 1,5 L', qty: 2, price: 2.49, icon: CupSoda, tone: 'ember' },
      { name: 'Empanadas x12', qty: 1, price: 13.99, icon: Soup, tone: 'gold' },
      { name: 'Maní salado', qty: 2, price: 2.99, icon: Popcorn, tone: 'cocoa' },
    ],
  },
  {
    id: 'navidad',
    title: 'Navidad',
    caption: 'Natilla y buñuelos',
    icon: Gift,
    tone: 'ember',
    items: [
      { name: 'Natilla', qty: 2, price: 5.49, icon: CakeSlice, tone: 'cream' },
      { name: 'Buñuelos', qty: 1, price: 8.99, icon: Cookie, tone: 'gold' },
      { name: 'Arequipe', qty: 1, price: 7.25, icon: Cake, tone: 'cocoa' },
      { name: 'Aromática', qty: 1, price: 3.29, icon: Leaf, tone: 'jade' },
    ],
  },
]

export const featuredProducts = [
  { name: 'Café de origen', meta: 'Huila · 500 g', price: 14.9, was: 17.5, icon: Coffee, tone: 'cocoa', tag: '-15%' },
  { name: 'Pan de bono', meta: 'Horneado hoy · x6', price: 6.99, icon: Croissant, tone: 'cream', tag: 'Nuevo' },
  { name: 'Arequipe', meta: 'Tradicional · 250 g', price: 7.25, icon: Cake, tone: 'gold' },
  { name: 'Bocadillo', meta: 'Veleño · x12', price: 3.99, icon: Candy, tone: 'ember', tag: 'Recompra' },
]

/* ---------- Escena 04 (DEMO) ---------- */
export const kpis = [
  { label: 'Ventas hoy', value: 18420, prefix: '$', delta: '+12,4%', tone: 'jade', spark: [8, 11, 9, 13, 12, 15, 14, 18, 17, 21] },
  { label: 'Pedidos', value: 326, delta: '+8,1%', tone: 'azure', spark: [5, 7, 6, 8, 9, 8, 11, 10, 12, 13] },
  { label: 'Ticket promedio', value: 56.5, prefix: '$', decimals: 2, delta: '+3,2%', tone: 'gold', spark: [9, 9, 10, 9, 11, 10, 11, 12, 11, 12] },
  { label: 'Margen bruto', value: 7840, prefix: '$', delta: '+9,7%', tone: 'ember', spark: [6, 7, 7, 9, 8, 10, 9, 11, 12, 12] },
]

export const salesByDay = [
  { d: 'L', v: 12.4 }, { d: 'M', v: 13.1 }, { d: 'M', v: 12.2 }, { d: 'J', v: 14.8 },
  { d: 'V', v: 16.9 }, { d: 'S', v: 21.3 }, { d: 'D', v: 19.6 }, { d: 'L', v: 14.2 },
  { d: 'M', v: 15.1 }, { d: 'M', v: 14.6 }, { d: 'J', v: 16.4 }, { d: 'V', v: 18.9 },
  { d: 'S', v: 23.8 }, { d: 'Hoy', v: 18.4 },
]

export const salesByCategory = [
  { label: 'Café', v: 92, tone: 'cocoa' },
  { label: 'Panadería', v: 74, tone: 'cream' },
  { label: 'Snacks', v: 61, tone: 'gold' },
  { label: 'Bebidas', v: 48, tone: 'azure' },
  { label: 'Dulces', v: 39, tone: 'ember' },
]

export const topProducts = [
  { name: 'Café colombiano', units: 412 },
  { name: 'Arepas', units: 368 },
  { name: 'Chocolates', units: 291 },
  { name: 'Panadería', units: 247 },
  { name: 'Snacks', units: 198 },
]

/* ---------- Escena 05 (DEMO) ---------- */
export const customer = {
  name: 'María González',
  initials: 'MG',
  since: 'Cliente desde 2023',
  orders: 14,
  lifetime: 742,
  ticket: 53,
  daysStart: 18,
  daysEnd: 45,
  favorites: ['Café de origen', 'Arepas', 'Pan de bono'],
  frequency: 'Cada 12 días',
  categories: [
    { label: 'Café', v: 38, tone: 'cocoa' },
    { label: 'Panadería', v: 27, tone: 'cream' },
    { label: 'Despensa', v: 21, tone: 'gold' },
    { label: 'Dulces', v: 14, tone: 'ember' },
  ],
  history: [32, 41, 38, 52, 47, 58, 61, 55, 66, 72],
}

export const segments = ['VIP', 'Fiel', 'Potencial', 'En riesgo', 'Inactivo']

/* ---------- Escena 06 (DEMO) ---------- */
export const inventoryAlerts = [
  { value: 12, label: 'productos necesitan reposición', tone: 'gold', icon: 'restock' },
  { value: 8, label: 'productos con baja rotación', tone: 'azure', icon: 'slow' },
  { value: 24, label: 'productos próximos a vencer', tone: 'ember', icon: 'expiry' },
  { value: 5, label: 'productos con sobreinventario', tone: 'jade', icon: 'over' },
]

/* ---------- Escena 07 ---------- */
export const ecosystem = [
  { label: 'E-commerce', icon: Store, tone: 'gold' },
  { label: 'Inventario', icon: Boxes, tone: 'gold' },
  { label: 'Pedidos', icon: Receipt, tone: 'azure' },
  { label: 'Clientes', icon: Users, tone: 'azure' },
  { label: 'Analítica', icon: ChartLine, tone: 'jade' },
  { label: 'Fidelización', icon: Heart, tone: 'ember' },
  { label: 'Marketing', icon: Megaphone, tone: 'ember' },
  { label: 'Inteligencia', icon: Brain, tone: 'gold' },
]

export const flowSteps = [
  { label: 'Cliente compra', icon: ShoppingCart },
  { label: 'Venta registrada', icon: Receipt },
  { label: 'Inventario actualizado', icon: Boxes },
  { label: 'Datos analizados', icon: ChartLine },
  { label: 'Cliente identificado', icon: Users },
  { label: 'Recomendación generada', icon: Brain },
  { label: 'Nueva oportunidad de venta', icon: Megaphone },
]

/* ---------- Escena 08 ---------- */
export const included = [
  'E-commerce',
  'Catálogo de +1.500 productos',
  'Gestión de inventario',
  'Gestión de pedidos',
  'Dashboard de ventas',
  'Inteligencia de clientes',
  'Fidelización',
  'Recomendaciones inteligentes',
  'Diseño responsive',
  'Implementación y lanzamiento',
]
