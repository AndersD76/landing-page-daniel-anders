import type { GrupoChecklist } from "@/components/ferramentas/ChecklistIsca";

/**
 * Itens das iscas de checklist. As explicações vão no relatório por e-mail.
 * Referência legal só onde o texto da lei foi conferido:
 * Lei 13.709/2018 (LGPD) — https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
 */

export const CHECKLIST_LANCAMENTO: GrupoChecklist[] = [
  {
    titulo: "Domínio, hospedagem e segurança",
    itens: [
      { id: "dominio-cnpj", peso: 3, texto: "O domínio está registrado no nome (CPF/CNPJ) da empresa, não do fornecedor", explicacao: "Quem é titular no Registro.br controla o site. Domínio no nome do fornecedor vira refém quando a relação acaba. Consulte o titular no whois do registro.br e peça a transferência antes de lançar." },
      { id: "https", peso: 3, texto: "O site abre com HTTPS (cadeado) em todas as páginas", explicacao: "Navegadores marcam páginas HTTP como 'não seguras' e o Google usa HTTPS como sinal. Certificado gratuito (Let's Encrypt) resolve; confira também o redirecionamento de http:// para https://." },
      { id: "www-redirect", peso: 1, texto: "Com e sem www levam ao mesmo endereço (um redireciona para o outro)", explicacao: "Duas versões do mesmo site dividem sinais de busca. Escolha uma e redirecione a outra com 301." },
      { id: "backup", peso: 2, texto: "Existe backup automático e você sabe como restaurar", explicacao: "Backup que nunca foi restaurado é hipótese. Faça um teste de restauração antes do lançamento e anote onde ficam as cópias." },
      { id: "acessos", peso: 2, texto: "Você tem os acessos de administrador (hospedagem, domínio, painel do site, e-mail)", explicacao: "Liste os acessos num cofre de senhas da empresa. Sem eles, qualquer ajuste depende de uma pessoa só." },
      { id: "email-dominio", peso: 1, texto: "E-mail profissional com o domínio funcionando (e com SPF e DKIM configurados)", explicacao: "Sem SPF/DKIM os e-mails do formulário e do domínio caem no spam. O provedor de e-mail mostra os registros DNS a criar." },
    ],
  },
  {
    titulo: "Conteúdo e conversão",
    itens: [
      { id: "proposta-clara", peso: 3, texto: "A primeira tela diz o que a empresa faz, para quem e onde", explicacao: "Quem chega pelo Google decide em segundos. Título com o serviço + cidade/região + um botão de contato resolve a maior parte." },
      { id: "contato-visivel", peso: 3, texto: "Telefone/WhatsApp e endereço visíveis em todas as páginas", explicacao: "O rodapé com nome, endereço e telefone iguais aos do Perfil da Empresa no Google ajuda a busca local e evita perder contato." },
      { id: "formulario-testado", peso: 3, texto: "O formulário de contato foi testado e o e-mail chega", explicacao: "Formulário que falha em silêncio é o erro mais caro de um site novo. Envie um teste de outro e-mail e confira a caixa de entrada e o spam." },
      { id: "whatsapp-link", peso: 2, texto: "Botão de WhatsApp abre a conversa com mensagem pronta", explicacao: "Link wa.me com texto pré-preenchido identifica que o contato veio do site e reduz o atrito para a primeira mensagem." },
      { id: "paginas-servico", peso: 2, texto: "Cada serviço principal tem uma página própria", explicacao: "Uma página por serviço permite responder a busca específica ('conserto de câmbio automático') em vez de uma página genérica que não ranqueia para nada." },
      { id: "sem-lorem", peso: 1, texto: "Não sobrou texto de exemplo, link quebrado ou imagem de banco genérica no lugar errado", explicacao: "Rode um verificador de links e leia o site inteiro no celular antes de divulgar." },
    ],
  },
  {
    titulo: "Google e medição",
    itens: [
      { id: "title-description", peso: 2, texto: "Cada página tem título e descrição únicos", explicacao: "É o que aparece no resultado do Google. Títulos repetidos confundem quem busca e o buscador." },
      { id: "search-console", peso: 3, texto: "Site verificado no Google Search Console com o sitemap enviado", explicacao: "É por onde você descobre se as páginas foram indexadas e por quais buscas aparecem. Sem ele, você não sabe se o site existe para o Google." },
      { id: "sitemap-robots", peso: 2, texto: "sitemap.xml e robots.txt publicados e sem bloquear o site", explicacao: "Um robots.txt com 'Disallow: /' esquecido do ambiente de testes tira o site inteiro do Google." },
      { id: "sem-noindex", peso: 3, texto: "Nenhuma página importante está com noindex", explicacao: "Construtores e temas costumam marcar 'não indexar' durante o desenvolvimento. Confira o código-fonte das páginas principais." },
      { id: "perfil-empresa", peso: 2, texto: "Perfil da Empresa no Google criado e com o link do site", explicacao: "Para busca local ('perto de mim', 'em Passo Fundo') o perfil pesa tanto quanto o site." },
      { id: "analytics-consentimento", peso: 1, texto: "Medição de visitas instalada, respeitando o consentimento de cookies", explicacao: "Sem medição não dá para saber de onde vêm os contatos. Ferramentas com cookie devem esperar o consentimento do visitante." },
      { id: "redirecionamentos", peso: 2, texto: "Se havia site antigo, os endereços antigos redirecionam (301) para os novos", explicacao: "Trocar de site sem redirecionar joga fora o histórico de busca acumulado e gera erros 404 para quem tinha o link salvo." },
    ],
  },
  {
    titulo: "Celular, velocidade e acessibilidade",
    itens: [
      { id: "mobile", peso: 3, texto: "O site funciona bem no celular (texto legível, botões fáceis de tocar)", explicacao: "A maior parte das visitas de PME vem do celular. Teste em pelo menos um Android e um iPhone reais." },
      { id: "velocidade", peso: 2, texto: "As páginas principais carregam rápido no celular (teste no PageSpeed Insights)", explicacao: "Imagens grandes sem compressão são a causa mais comum. Use formatos modernos (WebP/AVIF) e dimensione as imagens." },
      { id: "alt-imagens", peso: 1, texto: "Imagens com texto alternativo descritivo", explicacao: "Ajuda quem usa leitor de tela e o Google Imagens a entender o conteúdo." },
      { id: "contraste", peso: 1, texto: "Contraste de texto suficiente e fonte de tamanho confortável", explicacao: "Texto cinza claro sobre fundo branco cansa e exclui parte do público. As diretrizes WCAG trazem a referência de contraste." },
    ],
  },
  {
    titulo: "Privacidade (LGPD)",
    itens: [
      { id: "politica-privacidade", peso: 2, texto: "Política de privacidade publicada e linkada no rodapé e nos formulários", explicacao: "A LGPD garante ao titular acesso facilitado às informações sobre o tratamento dos dados (Lei 13.709/2018, art. 9º). A política é onde isso fica." },
      { id: "banner-cookies", peso: 2, texto: "Ferramentas com cookies (Analytics, pixel) só carregam após consentimento", explicacao: "Cookies não necessários dependem de base legal; para medição e publicidade, o caminho usual é o consentimento livre, informado e inequívoco (art. 5º, XII, e art. 8º da LGPD)." },
      { id: "formulario-finalidade", peso: 1, texto: "O formulário pede só o necessário e diz para que serve", explicacao: "Princípios da finalidade e da necessidade (art. 6º da LGPD): colete apenas o que será usado para responder o contato." },
    ],
  },
];

export const CHECKLIST_LGPD: GrupoChecklist[] = [
  {
    titulo: "Transparência",
    itens: [
      { id: "politica", peso: 3, texto: "Política de privacidade publicada, em linguagem clara, com link em todas as páginas", explicacao: "O art. 9º da LGPD garante ao titular acesso facilitado a finalidade, forma e duração do tratamento, identificação e contato do controlador, compartilhamento, responsabilidades e direitos." },
      { id: "finalidades", peso: 2, texto: "A política lista quais dados coleta, para quê e por quanto tempo guarda", explicacao: "Finalidade específica e informada ao titular é princípio da LGPD (art. 6º, I). 'Melhorar sua experiência' não é finalidade." },
      { id: "compartilhamento", peso: 2, texto: "A política informa com quem os dados são compartilhados (hospedagem, e-mail, CRM, gateway)", explicacao: "Uso compartilhado e suas finalidades estão entre as informações que o titular tem direito de saber (art. 9º, V)." },
      { id: "encarregado-contato", peso: 3, texto: "Há um canal de contato para assuntos de dados pessoais divulgado no site", explicacao: "O art. 41, § 1º, pede que identidade e contato do encarregado sejam divulgados, preferencialmente no site. Agentes de pequeno porte têm regras específicas na Resolução CD/ANPD nº 2/2022, mas o canal com o titular continua necessário." },
    ],
  },
  {
    titulo: "Coleta e consentimento",
    itens: [
      { id: "minimizacao", peso: 2, texto: "Formulários pedem só os dados necessários para a finalidade", explicacao: "Princípio da necessidade (art. 6º, III): CPF, data de nascimento e endereço não cabem num formulário de 'fale conosco'." },
      { id: "cookies-consentimento", peso: 3, texto: "Cookies de analytics e marketing só após consentimento, com opção de recusar tão fácil quanto aceitar", explicacao: "Consentimento é manifestação livre, informada e inequívoca (art. 5º, XII). Banner que só tem 'Aceitar' não oferece escolha." },
      { id: "optin-separado", peso: 2, texto: "Inscrição em e-mail marketing é uma caixa separada e desmarcada", explicacao: "Consentimento deve se referir a finalidades determinadas (art. 8º, § 4º); autorização genérica é nula. Pedir orçamento não é aceitar newsletter." },
      { id: "revogacao", peso: 2, texto: "Todo e-mail de marketing tem descadastro em 1 clique", explicacao: "O consentimento pode ser revogado a qualquer momento, por procedimento gratuito e facilitado (art. 8º, § 5º)." },
      { id: "base-legal", peso: 2, texto: "Você sabe qual base legal sustenta cada uso de dado (contrato, consentimento, obrigação legal, legítimo interesse…)", explicacao: "As bases legais estão no art. 7º. Sem base legal identificada, o tratamento não tem sustentação." },
    ],
  },
  {
    titulo: "Direitos do titular",
    itens: [
      { id: "atender-pedidos", peso: 3, texto: "Existe um procedimento para atender pedidos de acesso, correção e exclusão de dados", explicacao: "O art. 18 lista os direitos (confirmação, acesso, correção, anonimização, portabilidade, eliminação, informação sobre compartilhamento, revogação do consentimento). Defina quem responde e em que prazo." },
      { id: "exclusao-real", peso: 2, texto: "Você consegue excluir os dados de uma pessoa do site, do CRM e das planilhas", explicacao: "Dado espalhado em cópias (planilhas, e-mails, WhatsApp) torna a eliminação impossível na prática. Saiba onde cada dado vive." },
    ],
  },
  {
    titulo: "Segurança e incidentes",
    itens: [
      { id: "https", peso: 3, texto: "Site e sistemas com HTTPS e senhas fortes com autenticação em dois fatores nos painéis", explicacao: "O art. 46 exige medidas de segurança técnicas e administrativas aptas a proteger os dados de acessos não autorizados." },
      { id: "acessos-minimos", peso: 2, texto: "Cada pessoa da equipe acessa só os dados de que precisa", explicacao: "Controle de acesso por perfil reduz o estrago de uma senha vazada e faz parte das medidas do art. 46." },
      { id: "backup-cripto", peso: 2, texto: "Backups existem, são testados e ficam protegidos", explicacao: "Disponibilidade também é segurança: perder a base de clientes é incidente." },
      { id: "plano-incidente", peso: 2, texto: "Há um roteiro do que fazer em caso de vazamento (quem avisa, como, em quanto tempo)", explicacao: "O art. 48 obriga a comunicar à ANPD e ao titular incidente que possa acarretar risco ou dano relevante. A Resolução CD/ANPD nº 15/2024 detalha prazos e conteúdo da comunicação." },
      { id: "fornecedores", peso: 2, texto: "Contratos com fornecedores que tratam dados (hospedagem, CRM, agência) falam de proteção de dados", explicacao: "O operador trata dados em nome do controlador e deve seguir as instruções dele (arts. 37 a 40). O contrato é onde isso fica registrado." },
    ],
  },
  {
    titulo: "Registro e organização",
    itens: [
      { id: "inventario", peso: 2, texto: "Existe um inventário de quais dados pessoais a empresa trata, onde ficam e para quê", explicacao: "O art. 37 pede que controlador e operador mantenham registro das operações de tratamento. Uma planilha bem feita é um bom começo." },
      { id: "retencao", peso: 1, texto: "Há regra de quanto tempo cada dado é guardado e quando é eliminado", explicacao: "O término do tratamento e a eliminação estão nos arts. 15 e 16. Guardar 'para sempre' aumenta o risco sem benefício." },
      { id: "transferencia", peso: 1, texto: "Você sabe se algum serviço guarda dados fora do Brasil (nuvem, e-mail, CRM)", explicacao: "Transferência internacional tem regras próprias (art. 33). A maioria dos serviços em nuvem fica no exterior — saiba quais são e informe na política." },
      { id: "treinamento", peso: 1, texto: "A equipe sabe o que pode e o que não pode fazer com dados de clientes (ex.: print de conversa, planilha no pen drive)", explicacao: "Boa parte dos incidentes começa em hábito, não em ataque. Uma conversa de 30 minutos com regras claras já reduz o risco." },
    ],
  },
];
