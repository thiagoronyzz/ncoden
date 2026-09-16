# NCODE N — Oficina de Jogos

Uma oficina editorial com **400 minijogos originais** jogáveis no navegador.
Cada jogo é uma *peça de bancada* numerada (001–400), com código próprio, mecânica
central clara, recorde individual e progresso salvo localmente.

Identidade **Tech Editorial / Modernismo Tátil**: papel `#F4F1EB`, tinta `#181816`,
terracota `#D94E34`, wasabi `#C4D645`, hairlines de cimento, tipografia
Fraunces / Plus Jakarta Sans / Space Mono, granulação de impressão e sombras duras.

## Jogar

Sem build, sem dependências, sem servidor obrigatório. Sirva a pasta como site
estático e abra `index.html`:

```bash
# qualquer servidor estático, ex:
python3 -m http.server 8080
# → http://localhost:8080/
```

- `index.html` — catálogo: busca, 14 filtros de gênero, favoritos, ordenação
  (nº, A–Z, dificuldade), progresso e tema claro/escuro.
- `play.html#NNN` — palco do jogo nº NNN (ex: `play.html#042`).
- `404.html` — página de erro na identidade do site.

Progresso (jogados, concluídos, recordes, favoritos, tema) fica em
`localStorage` — não há conta nem backend.

## Os 400 jogos

| Faixa     | Gênero             | Peças |
|-----------|--------------------|------:|
| 001–040   | Puzzle & Lógica    |    40 |
| 041–080   | Arcade & Reflexo   |    40 |
| 081–120   | Estratégia & Tática|    40 |
| 121–160   | Simulação          |    40 |
| 161–190   | Física & Sandbox   |    30 |
| 191–210   | Ritmo & Música     |    20 |
| 211–230   | Palavras           |    20 |
| 231–260   | Cartas & Tabuleiro |    30 |
| 261–280   | Stealth            |    20 |
| 281–310   | Corrida & Movimento|    30 |
| 311–340   | Sobrevivência      |    30 |
| 341–360   | Exploração         |    20 |
| 361–380   | Social & Festa     |    20 |
| 381–400   | Timing & Precisão  |    20 |

## Estrutura

```
├── index.html            # catálogo
├── play.html             # palco do jogo (carrega games/gNNN.js via hash)
├── 404.html              # erro 404 na identidade
├── assets/
│   ├── css/main.css      # identidade + kit de UI (.g-*) + responsivo
│   └── js/
│       ├── catalog.js    # catálogo: [id, título, gênero, descrição, controles]
│       ├── app.js        # catálogo: busca, filtros, favoritos, progresso
│       └── shell.js      # motor: registro GREG + API H + palco + áudio + save
├── games/                # g001.js … g400.js — um arquivo por jogo
├── test/
│   ├── harness.js        # teste funcional: roda cada jogo com H simulado
│   └── lint.js           # conformidade: registro, APIs proibidas, unicidade
└── tools/                # geradores gen_NNN_MMM.py (um por faixa, reprodução)
```

## Anatomia de um jogo

Cada arquivo em `games/` registra uma peça com código 100% próprio:

```js
GREG(42, {
  init(root, H){
    // root: palco (HTMLElement) · H: API da oficina
  }
});
```

A API `H` oferece: elementos (`el`, `btn`, `msg`, `hud`), canvas responsivo
(`cvs`, com coordenadas internas), laço (`loop`, `after`, `every`), entrada
(`keys`, `ptr`, `onTap`, `swipe`), áudio sintetizado (`sfx`, `beep`),
aleatório com seed (`rng`, `shuffle`, `pick`), matemática (`clamp`, `lerp`,
`dist`), placar (`score`, `level`, `time`) e fim de jogo (`done`, `restart`).

Regras de conformidade (validadas pelo lint):

- registrar exatamente o próprio id via `GREG(id, …)` com `init(root, H)`;
- usar **apenas** a API `H` — sem `document`, `window`, timers globais,
  `fetch`, storage direto ou qualquer API fora da oficina;
- código único por jogo (hashes duplicados reprovam).

## Verificação

```bash
node test/lint.js            # 400 arquivos únicos e conformes
node test/harness.js 42      # teste funcional de um jogo
for i in $(seq 1 400); do    # suíte completa
  node test/harness.js $i
done
```

Estado atual: **harness 400/400 PASS · lint OK · `node --check` limpo**.

## Stack

HTML5 · CSS3 · JavaScript puro. Zero dependências em produção; fontes via
Google Fonts com fallbacks de sistema. Jogos renderizados em DOM + Canvas 2D.
