/**
 * Utilitários de texto do portão de qualidade e do motor de links: contagem de
 * palavras, tokens de conteúdo e similaridade TF-IDF (cosseno).
 *
 * TF-IDF e não embeddings: roda no build, sem chave de API, é determinístico e
 * é suficiente para pegar o que importa aqui — página que repete outra.
 */

const STOPWORDS = new Set(
  (
    "a o e é de da do das dos em no na nos nas um uma uns umas para pra por com sem que se " +
    "ao aos à às ou mas mais menos muito muita muitos muitas como quando onde qual quais quem " +
    "sua seu suas seus meu minha nosso nossa isso isto esse essa este esta aquele aquela ele ela " +
    "eles elas você vocês voce voces lhe já ja não nao sim também tambem só so ser ter há ha foi " +
    "são sao está esta estão estao pode podem fazer faz feito tem têm sobre entre até ate depois " +
    "antes cada todo toda todos todas outro outra outros outras mesmo mesma bem ainda então entao " +
    "porque pois assim aqui ali lá la seja sejam fica ficar vai vão vao deve devem precisa precisam " +
    "num numa pelo pela pelos pelas dele dela deles delas qualquer quanto quanta tanto tanta tal " +
    "sendo sido tendo tido vez vezes coisa coisas forma parte caso casos exemplo"
  ).split(/\s+/)
);

export function semAcento(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function contarPalavras(texto: string): number {
  return texto.split(/\s+/).filter((w) => w.replace(/[^\p{L}\p{N}]/gu, "").length > 0).length;
}

/** Tokens de conteúdo: minúsculos, sem acento, sem stopword, radical de 6 letras. */
export function tokens(texto: string): string[] {
  return semAcento(texto.toLowerCase())
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t) && !/^\d+$/.test(t))
    .map((t) => (t.length > 6 ? t.slice(0, 6) : t));
}

export function frases(texto: string): string[] {
  return texto
    .split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9"“])/)
    .map((f) => f.trim())
    .filter(Boolean);
}

export type Vetor = Map<string, number>;

/** Monta vetores TF-IDF normalizados para uma coleção de documentos. */
export function vetoresTfIdf(docs: string[]): Vetor[] {
  const tfs = docs.map((d) => {
    const m = new Map<string, number>();
    for (const t of tokens(d)) m.set(t, (m.get(t) ?? 0) + 1);
    return m;
  });
  const df = new Map<string, number>();
  for (const tf of tfs) for (const t of tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  const n = docs.length;
  return tfs.map((tf) => {
    const v: Vetor = new Map();
    let norma = 0;
    for (const [t, f] of tf) {
      const idf = Math.log((n + 1) / ((df.get(t) ?? 0) + 1)) + 1;
      const w = (1 + Math.log(f)) * idf;
      v.set(t, w);
      norma += w * w;
    }
    norma = Math.sqrt(norma) || 1;
    for (const [t, w] of v) v.set(t, w / norma);
    return v;
  });
}

export function cosseno(a: Vetor, b: Vetor): number {
  const [menor, maior] = a.size < b.size ? [a, b] : [b, a];
  let s = 0;
  for (const [t, w] of menor) {
    const x = maior.get(t);
    if (x) s += w * x;
  }
  return s;
}

/** Hash estável e barato (FNV-1a) — escolhe variações sem aleatoriedade. */
export function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
