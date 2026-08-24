import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de privacidade da AndersDev — como coletamos, usamos e protegemos seus dados pessoais conforme a LGPD.",
  alternates: { canonical: "https://www.andersdev.com.br/privacidade" },
  openGraph: {
    title: "Política de Privacidade — AndersDev",
    description: "Como coletamos, usamos e protegemos seus dados pessoais conforme a LGPD.",
    url: "https://www.andersdev.com.br/privacidade",
  },
};

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen pt-32 pb-24">
      <div className="container-main max-w-3xl">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
          Política de Privacidade
        </h1>
        <p className="text-sm text-gray-500 mb-12">
          Última atualização: 23 de agosto de 2026
        </p>

        <div className="flex flex-col gap-8 text-gray-400 leading-relaxed text-sm">
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              1. Quem somos
            </h2>
            <p>
              AndersDev é a marca de desenvolvimento de software de Daniel Anders,
              inscrito no CPF sob responsabilidade própria, com sede em Passo Fundo, RS.
              Para fins desta política, &quot;nós&quot; refere-se à AndersDev.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              2. Dados que coletamos
            </h2>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>
                <strong className="text-foreground">Formulário de contato:</strong> nome e
                e-mail (obrigatórios), mensagem (opcional).
              </li>
              <li>
                <strong className="text-foreground">Calculadoras:</strong> as respostas que
                você seleciona para gerar a estimativa. Nenhum dado pessoal é exigido.
              </li>
              <li>
                <strong className="text-foreground">Analytics:</strong> dados anônimos de
                navegação (páginas visitadas, duração, origem do tráfego) via Google
                Analytics 4, somente após consentimento explícito.
              </li>
              <li>
                <strong className="text-foreground">Cookies:</strong> utilizamos apenas
                cookies analíticos (GA4) e de funcionalidade (preferência de idioma,
                consentimento). Nenhum cookie de publicidade é usado.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              3. Base legal (LGPD Art. 7°)
            </h2>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>
                <strong className="text-foreground">Consentimento:</strong> para cookies
                analíticos e envio de comunicações por e-mail.
              </li>
              <li>
                <strong className="text-foreground">Legítimo interesse:</strong> para
                responder mensagens enviadas pelo formulário de contato.
              </li>
              <li>
                <strong className="text-foreground">Execução de contrato:</strong> quando
                você contrata nossos serviços de desenvolvimento.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              4. Como usamos seus dados
            </h2>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>Responder sua mensagem ou solicitação de orçamento.</li>
              <li>Enviar estimativas de projeto solicitadas via calculadora.</li>
              <li>Melhorar a experiência do site com base em dados anônimos de uso.</li>
              <li>Cumprir obrigações legais, se aplicável.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              5. Compartilhamento de dados
            </h2>
            <p>
              Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros
              para fins de marketing. Seus dados podem ser processados por:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2 mt-2">
              <li>
                <strong className="text-foreground">Google Analytics:</strong> dados
                anônimos de navegação (servidores nos EUA, com cláusulas contratuais
                padrão).
              </li>
              <li>
                <strong className="text-foreground">Resend:</strong> envio de e-mails
                transacionais.
              </li>
              <li>
                <strong className="text-foreground">NeonDB:</strong> armazenamento seguro
                dos dados do formulário.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              6. Seus direitos (LGPD Art. 18)
            </h2>
            <p>Você pode, a qualquer momento:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2 mt-2">
              <li>Solicitar acesso aos dados que temos sobre você.</li>
              <li>Corrigir dados incompletos ou desatualizados.</li>
              <li>Solicitar a exclusão dos seus dados pessoais.</li>
              <li>Revogar o consentimento para cookies analíticos.</li>
              <li>Solicitar portabilidade dos dados.</li>
            </ul>
            <p className="mt-3">
              Para exercer qualquer direito, envie e-mail para{" "}
              <a
                href="mailto:danielanders76@gmail.com"
                className="text-brand hover:text-brand-bright transition-colors"
              >
                danielanders76@gmail.com
              </a>{" "}
              com o assunto &quot;LGPD&quot;. Responderemos em até 15 dias.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              7. Retenção de dados
            </h2>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>Dados de formulário: mantidos por 2 anos ou até exclusão solicitada.</li>
              <li>Dados de analytics: retidos por 14 meses (padrão GA4), anonimizados.</li>
              <li>Cookies: expiram conforme o tipo (sessão ou até 2 anos).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              8. Segurança
            </h2>
            <p>
              Utilizamos HTTPS em todo o site, banco de dados com conexão criptografada
              (TLS), rate limiting em todas as APIs, e protegemos formulários contra spam
              com honeypot. Credenciais de acesso são armazenadas em variáveis de ambiente,
              nunca no código-fonte.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              9. Alterações nesta política
            </h2>
            <p>
              Esta política pode ser atualizada periodicamente. A data de
              &quot;última atualização&quot; no topo indica a versão vigente. Alterações
              significativas serão comunicadas via banner no site.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              10. Contato
            </h2>
            <p>
              Daniel Anders — AndersDev<br />
              E-mail:{" "}
              <a
                href="mailto:danielanders76@gmail.com"
                className="text-brand hover:text-brand-bright transition-colors"
              >
                danielanders76@gmail.com
              </a>
              <br />
              Passo Fundo, RS — Brasil
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <Link
            href="/"
            className="text-sm text-brand hover:text-brand-bright transition-colors"
          >
            &larr; Voltar ao site
          </Link>
        </div>
      </div>
    </main>
  );
}
