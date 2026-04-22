# VigilIA — Drone Nacional Asa Fixa Solar

Site estático do projeto VigilIA. Sem build step, sem bundler.

## Como rodar localmente

**Opção 1 — VS Code Live Server (recomendado)**
1. Instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Abra a pasta raiz do projeto no VS Code e clique em *Go Live*
3. Acesse `http://127.0.0.1:5500` — o `index.html` da raiz redireciona automaticamente para o site

**Opção 2 — Python**
```
python -m http.server 5500
```
Acesse `http://localhost:5500`

> Abrir `Site-Drone-VigilIA/index.html` diretamente no browser via `file://` também funciona
> para leitura, mas algumas fontes e assets externos podem não carregar.

## Estrutura de arquivos

```
index.html            — página principal (single-page)

css/
  base.css            — reset, ~20 design tokens (:root), tipografia base
  layout.css          — containers, grids, padding de seções, fade-in
  components.css      — navbar, botões, cards, tabelas, charts, timeline
  sections.css        — visual do hero (drone, HUD overlay com pseudo-elementos)
  utilities.css       — animações keyframe, .sr-only, classes de estado
  responsive.css      — media queries (carrega por último, ≤900/600/480/380px)

js/
  main.js             — typewriter, scroll, navbar scrolled-state, telemetria, contadores animados
  matrix.js           — efeito matrix canvas de fundo
  timeline.js         — timeline expansível + abas de componentes + nós do roadmap clicáveis
  charts.js           — 5 gráficos canvas com DPR/Retina, ResizeObserver, reduced-motion
  mission.js          — simulador de missão interativo com DPR/Retina e ResizeObserver

assets/
  drone.svg           — diagrama técnico SVG do drone (wireframe top-view)
```

## Canvas e DPR (Retina / alta densidade)

Todos os `<canvas>` são dimensionados para o Device Pixel Ratio do display:

- **`charts.js`** — `setupHiDPICanvas(canvas)` lê `offsetWidth`, lê o atributo `height`,
  define `canvas.width/height` em pixels físicos e aplica `ctx.setTransform(dpr,0,0,dpr,0,0)`.
  Todas as coordenadas de desenho permanecem em pixels CSS.
- **`mission.js`** — `renderPhase()` lê `offsetWidth`/`offsetHeight` antes de cada animação
  e atualiza `canvas.width/height`. Cada função de desenho aplica `ctx.setTransform(dpr,…)`.
- **ResizeObserver** — ambos registram um observer com debounce de 150ms no elemento pai
  para redesenhar ao redimensionar a janela ou girar o dispositivo.

## Ponto de entrada

`Site-Drone-VigilIA/index.html` é a única página. Todos os links internos são âncoras (`#secao-1`, `#secao-op`, etc.).
O `index.html` na raiz do repositório redireciona automaticamente para ela.
