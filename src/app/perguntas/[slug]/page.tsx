import { criarRota } from "@/components/conteudo/rota";

const rota = criarRota("satelite");

/** ISR diário: a onda de publicação libera páginas por data sem novo deploy. */
export const revalidate = 86400;
export const generateStaticParams = rota.generateStaticParams;
export const generateMetadata = rota.generateMetadata;
export default rota.Page;
