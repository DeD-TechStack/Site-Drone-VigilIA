# VigilIA — Drone Nacional Asa Fixa Solar

Site estático do projeto VigilIA. Sem build step, sem bundler.

## Como rodar localmente

**Opção 1 — VS Code Live Server (recomendado)**
1. Instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Clique com botão direito em `vigilia.html` → *Open with Live Server*
3. Acesse `http://127.0.0.1:5500/vigilia.html`

**Opção 2 — Python**
```
python -m http.server 5500
```
Acesse `http://localhost:5500/vigilia.html`

> Abrir `vigilia.html` diretamente no browser via `file://` também funciona para leitura,
> mas algumas fontes e assets externos podem não carregar.

## Estrutura de arquivos

```
vigilia.html          — página principal (single-page)

css/
  base.css            — reset, variáveis CSS, tipografia base
  layout.css          — containers, grids, padding de seções, fade-in
  components.css      — navbar, botões, cards, tabelas, charts, timeline
  sections.css        — visual do hero (drone, HUD overlay)
  utilities.css       — animações keyframe, classes de estado
  responsive.css      — media queries (carrega por último)

js/
  main.js             — typewriter, scroll, navbar, telemetria, contadores
  matrix.js           — efeito matrix canvas de fundo
  timeline.js         — timeline expansível + abas de componentes
  charts.js           — todos os gráficos canvas (energético, gantt, donut, etc.)
  mission.js          — simulador de missão interativo

assets/
  drone.png           — imagem do drone no hero
```

## Ponto de entrada

`vigilia.html` é a única página. Todos os links internos são âncoras (`#secao-1`, `#secao-op`, etc.).
