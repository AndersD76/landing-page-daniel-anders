# AUDITORIA.md — AndersDev (landing-page-daniel-anders)

> **Data**: 2026-07-18 | **Fase**: 1 (somente analise)
> **Stack**: Next.js 15, Drizzle ORM, NeonDB (PostgreSQL), Mercado Pago, Tailwind CSS
> **Modulos**: Landing page + Plataforma EAD (10 tabelas Drizzle)
> **Rotas**: 23 paginas + 19 API routes (12 EAD)

---

## Resumo por Severidade

| Severidade | Qtd |
|------------|-----|
| CRITICAL   | 15  |
| HIGH       | 10  |
| MEDIUM     | 12  |
| LOW        | 5   |
| **Total**  | **42** |

---

## CRITICAL (15)

### C1 — Player chama endpoint inexistente (Sec 1,2)
- **Arquivo**: src/app/cursos/player/[slug]/page.tsx:68
- **Descricao**: Faz `fetch('/api/ead/courses/${slug}/content')`. Nao existe rota `/api/ead/courses/[slug]/content/route.ts` — so existe `/api/ead/courses/[slug]/route.ts`.
- **Impacto**: 404 sempre. Nenhum aluno consegue abrir o player de aulas.

### C2 — "Marcar como concluida" chama endpoint errado (Sec 1,2)
- **Arquivo**: src/app/cursos/player/[slug]/page.tsx:118
- **Descricao**: Faz `POST /api/ead/progress`. Essa rota nao existe. O endpoint real e `/api/ead/lesson/[id]/complete/route.ts`.
- **Impacto**: Progresso de aula nunca e salvo. Aluno nunca completa o curso.

### C3 — Link da prova final aponta para pagina inexistente (Sec 1)
- **Arquivo**: src/app/cursos/player/[slug]/page.tsx:491
- **Descricao**: Renderiza `<Link href={/cursos/player/${slug}/prova}>`. Nao existe `src/app/cursos/player/[slug]/prova/page.tsx`.
- **Impacto**: 404 ao clicar em "Fazer Prova Final". Quiz API existe mas nunca e chamada.

### C4 — Certificado chama rota com nome errado (Sec 1,2)
- **Arquivo**: src/app/cursos/certificado/[code]/page.tsx:19
- **Descricao**: Faz `fetch('/api/ead/certificates/${code}')` (plural). Rota real e `/api/ead/certificate/[code]/route.ts` (singular).
- **Impacto**: 404 sempre. Certificado publico verificavel nunca abre.

### C5 — Catalogo nunca exibe cursos (Sec 2)
- **Arquivo**: src/app/cursos/page.tsx:39,71 + src/app/api/ead/courses/route.ts:36
- **Descricao**: API retorna `{ courses: [...] }` (objeto). Frontend trata como array: `courses.length` sobre `{courses:[...]}.length` = `undefined`. Sempre cai no estado vazio "Em breve".
- **Impacto**: Catalogo de cursos 100% invisivel, mesmo com cursos cadastrados.

### C6 — Campos divergentes na lista de cursos (Sec 2)
- **Arquivo**: api/ead/courses/route.ts:21-30 + CourseCard.tsx:8-9
- **Descricao**: Backend retorna `moduleCount`/`lessonCount`; frontend espera `modulesCount`/`lessonsCount`. Alem disso, `preco` nao e selecionado na query.
- **Impacto**: Cards de curso sem contagem de modulos e sem preco.

### C7 — Detalhe do curso crasha (Sec 2)
- **Arquivo**: src/app/cursos/[slug]/page.tsx:44,91 + api/ead/courses/[slug]/route.ts:73-87
- **Descricao**: API retorna `{ course: {...}, modules: [...] }` (aninhado). Frontend trata como objeto plano e faz `course.modules.reduce(...)` — TypeError.
- **Impacto**: Pagina de detalhe do curso sempre crasha com erro 500.

### C8 — Token nunca retornado no JSON de registro/login (Sec 2)
- **Arquivo**: api/ead/register/route.ts:84-91, api/ead/login/route.ts:58-69 + cursos/registro/page.tsx:43,72
- **Descricao**: Backend seta JWT como cookie httpOnly, mas nunca inclui no JSON. Frontend faz `localStorage.setItem("ead_token", data.token)` = salva string "undefined".
- **Impacto**: Auth via Bearer header sempre falha. Auth so funciona por cookie em HTTPS (acidente).

### C9 — Tela "Meus Cursos" crasha (Sec 2)
- **Arquivo**: src/app/cursos/meus-cursos/page.tsx:54,113 + api/ead/my-courses/route.ts:76
- **Descricao**: API retorna `{ courses: [...] }` (objeto). Frontend faz `setCourses(data)` e depois `courses.map(...)` sobre objeto — TypeError.
- **Impacto**: Tela "Meus Cursos" quebra para todo usuario autenticado.

### C10 — Campos incompativeis em "Meus Cursos" (Sec 2)
- **Arquivo**: src/app/cursos/meus-cursos/page.tsx:114,118,134,160,165
- **Descricao**: Backend retorna `progress` (numero). Frontend usa `course.progressPercent` (nao existe = NaN), `course.id` (undefined), `course.certificateCode` (sempre falso).
- **Impacto**: Botao "Ver Certificado" nunca aparece. Barra de progresso sempre NaN%.

### C11 — Race condition na emissao de certificado (Sec 3)
- **Arquivo**: api/ead/quiz/[courseSlug]/route.ts:203-237 + ead-schema.ts:148-158
- **Descricao**: SELECT + INSERT sem transacao. Tabela `ead_certificates` nao tem UNIQUE em `(userId, courseId)` — so tem UNIQUE em `code`.
- **Impacto**: Duplo-clique gera certificados duplicados para o mesmo aluno/curso.

### C12 — Homepage "use client" bloqueia SEO (Sec 13)
- **Arquivo**: src/app/page.tsx
- **Descricao**: Pagina principal marcada com `"use client"`. Conteudo e renderizado inteiramente no client-side via JavaScript.
- **Impacto**: Google nao indexa o conteudo da homepage. Site invisivel no Google.

### C13 — XSS via dangerouslySetInnerHTML (Sec 5)
- **Arquivo**: src/app/cursos/player/[slug]/page.tsx + outros
- **Descricao**: Conteudo de aula renderizado com `dangerouslySetInnerHTML` sem sanitizacao (DOMPurify).
- **Impacto**: Se conteudo de aula contiver `<script>`, executa JS malicioso no navegador do aluno.

### C14 — Secrets expostos no HANDOFF.md (Sec 5,6)
- **Arquivo**: HANDOFF.md
- **Descricao**: Arquivo commitado pode conter API keys e tokens no historico git.
- **Impacto**: Credenciais expostas a qualquer pessoa com acesso ao repo.

### C15 — Zero infraestrutura de testes (Sec 11)
- **Arquivo**: projeto inteiro
- **Descricao**: Nenhum arquivo de teste, nenhum framework configurado.
- **Impacto**: Impossivel validar correcoes sem regressao.

---

## HIGH (10)

### H1 — Matricula nao funciona pela UI (Sec 1)
- **Arquivo**: src/app/cursos/[slug]/page.tsx:273-278
- **Descricao**: Botao "Comecar Curso" linka para `/cursos/registro`, nunca chama `POST /api/ead/enroll`. Rota de enroll existe mas nenhuma tela a chama.
- **Impacto**: Nenhum usuario consegue se matricular em curso algum pela interface.

### H2 — Auth Bearer ignorado pelo backend (Sec 2,5)
- **Arquivo**: src/lib/ead/auth.ts:46-57
- **Descricao**: `getEadUser()` so le `request.cookies`, nunca `Authorization` header. Frontend envia Bearer (que ja e "undefined"). Auth so funciona por cookie same-origin em HTTPS.
- **Impacto**: Autenticacao quebra totalmente em dev local (`http://localhost:3000`) porque cookie e `secure: true`.

### H3 — Enroll nao verifica preco do curso (Sec 3,5)
- **Arquivo**: api/ead/enroll/route.ts:27-38
- **Descricao**: Insere matricula direta sem verificar se curso e pago. Tabela `ead_orders` existe mas nao e usada em nenhum fluxo.
- **Impacto**: Qualquer usuario logado matricula-se de graca em curso pago.

### H4 — JWT expira em 30 dias sem refresh (Sec 5)
- **Arquivo**: src/lib/ead/auth.ts
- **Descricao**: Token EAD valido por 30 dias, sem refresh token, sem revogacao.
- **Impacto**: Token comprometido e valido por 30 dias sem como revogar.

### H5 — Rate limiting em memoria (Sec 5)
- **Arquivo**: src/lib/security.ts
- **Descricao**: Rate limit usa Map em memoria. Em ambiente serverless (Vercel), cada funcao tem instancia separada.
- **Impacto**: Rate limit ineficaz em producao serverless.

### H6 — Logout nao invalida sessao (Sec 2,5)
- **Arquivo**: src/components/ead/EadNavbar.tsx:22-28
- **Descricao**: `handleLogout` so limpa localStorage, nunca chama `POST /api/ead/logout`. Cookie httpOnly de 30 dias continua valido.
- **Impacto**: "Sair" nao revoga acesso. Cookie continua funcionando.

### H7 — Indices faltantes em FKs EAD (Sec 3)
- **Arquivo**: src/lib/db/ead-schema.ts
- **Descricao**: Postgres nao cria indice em FK automaticamente. Sem indice: `ead_modules.course_id`, `ead_lessons.module_id`, `ead_quiz_questions.course_id/module_id`, `ead_orders.user_id/course_id`, `ead_quiz_attempts.user_id/course_id`.
- **Impacto**: Queries ficam lentas com crescimento do catalogo.

### H8 — Rotas orfas nunca chamadas (Sec 1)
- **Arquivo**: src/app/api/ead/
- **Descricao**: 5 rotas API existem mas nenhuma tela as chama: `POST /api/ead/enroll`, `POST /api/ead/logout`, `GET/POST /api/ead/quiz/[courseSlug]`, `GET /api/ead/lesson/[id]`, `GET /api/ead/me`.
- **Impacto**: Funcionalidades implementadas no backend mas inacessiveis pela UI.

### H9 — Certificado: mismatch de shape (Sec 2)
- **Arquivo**: api/ead/certificate/[code]/route.ts:51-60 + cursos/certificado/[code]/page.tsx:6-12
- **Descricao**: Backend retorna `{valid, certificate: {cargaHoraria}}` aninhado. Frontend espera `courseCargaHoraria` plano.
- **Impacto**: Carga horaria nao renderiza no certificado.

### H10 — Sem CSRF protection (Sec 5)
- **Arquivo**: src/app/api/ead/*.ts
- **Descricao**: API routes EAD nao verificam origem da request. Sem CSRF token.
- **Impacto**: Acoes POST podem ser forgadas via site malicioso.

---

## MEDIUM (12)

| # | Sec | Descricao | Arquivo |
|---|-----|-----------|---------|
| M1 | 3 | Race condition em register (UNIQUE mitiga, mas UX ruim — retorna 500 em vez de 409) | api/ead/register/route.ts |
| M2 | 3 | Race condition em enroll (protegido por UNIQUE, mas UX ruim) | api/ead/enroll/route.ts |
| M3 | 5 | CORS nao restritivo em API routes | next.config.ts |
| M4 | 6 | Env vars sem validacao no startup | src/lib/db/index.ts |
| M5 | 7 | Dependencias sem audit recente | package.json |
| M6 | 8 | Componentes EAD sem error boundary | src/app/cursos/*.tsx |
| M7 | 9 | Sem loading states em paginas EAD | src/app/cursos/*.tsx |
| M8 | 9 | Sem responsividade no player de aula | src/app/cursos/player/ |
| M9 | 10 | Sem cache em queries de catalogo | api/ead/courses/route.ts |
| M10 | 12 | URLs de API hardcoded nos fetch calls | src/app/cursos/*.tsx |
| M11 | 13 | Sem sitemap.xml | projeto |
| M12 | 13 | Sem meta tags OG nas paginas EAD | src/app/cursos/*.tsx |

---

## LOW (5)

| # | Sec | Descricao |
|---|-----|-----------|
| L1 | 8 | Imports nao utilizados em paginas EAD |
| L2 | 9 | Sem favicon customizado |
| L3 | 13 | Sem robots.txt otimizado |
| L4 | 8 | Console.log em producao |
| L5 | 6 | Sem healthcheck endpoint |

---

## Causa Raiz

Os endpoints EAD foram reescritos/renomeados no backend (formatos de resposta envelopados, paths singular vs plural) sem atualizar as chamadas no frontend. O fluxo de autenticacao migrou de Bearer-token para cookie httpOnly sem remover o codigo client-side que depende de localStorage/Authorization. Fluxo de pagamento Mercado Pago nao implementado (tabela `ead_orders` existe mas nao e usada). Nenhum teste de integracao cobre o caminho aluno-completo (registro → matricula → aula → prova → certificado), o que explica a cadeia de 404s e crashes nao detectados.
