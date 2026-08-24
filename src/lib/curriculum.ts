import type { DailyContent, Disciplina } from "@/types";
import { parseDateString, isDateSunday, getTodayString } from "@/lib/utils";

export interface ScheduledTopic {
  disciplina: Disciplina;
  topico_principal: string;
  semana: string;
  contexto_visual: string;
  canivete_repertorio: string;
  palavras_do_dia: {
    palavra: string;
    significado: string;
    exemplo: string;
  }[];
  questoes: {
    id: number;
    ano_origem: string;
    enunciado: string;
    alternativas: {
      A: string;
      B: string;
      C: string;
      D: string;
      E: string;
    };
    gabarito: "A" | "B" | "C" | "D" | "E";
    explicacao_descomplicada: string;
  }[];
}

export const CURRICULUM_BANK: ScheduledTopic[] = [
  // 0. Ciências Humanas - Sociologia do Trabalho
  {
    disciplina: "Ciências Humanas",
    topico_principal: "Sociologia do Trabalho: Luta de Classes e Alienação",
    semana: "Ciências Humanas · Semana 1",
    contexto_visual:
      "A prova de Humanas do ENEM aborda frequentemente as relações de trabalho no capitalismo. Entender os conceitos de mais-valia, alienação e luta de classes permite analisar transformações sociais desde a Revolução Industrial até a uberização moderna.",
    canivete_repertorio:
      "Citação coringa de Karl Marx: 'A história de todas as sociedades até hoje existentes é a história da luta de classes'. Ótimo para introduzir temas sobre precarização laboral e desigualdade de renda.",
    palavras_do_dia: [
      {
        palavra: "Luta de Classes",
        significado: "Conflito constante e inevitável entre os proprietários dos meios de produção (burguesia) e os trabalhadores (proletariado).",
        exemplo: "Usado na redação para contextualizar desigualdades econômicas e a luta por direitos trabalhistas.",
      },
      {
        palavra: "Alienação",
        significado: "Processo em que o trabalhador perde o controle e a identificação com o produto de seu trabalho e sua própria humanidade.",
        exemplo: "Perfeito para discutir a precarização do trabalho e o impacto das jornadas excessivas na saúde mental.",
      },
      {
        palavra: "Mais-Valia",
        significado: "Diferença entre o valor total gerado pelo trabalho e o salário (menor) pago ao trabalhador pelo empregador.",
        exemplo: "Conceito essencial para analisar a acumulação de capital e a desigualdade socioeconômica.",
      },
    ],
    questoes: [
      {
        id: 1001,
        ano_origem: "ENEM 2013 (Adaptada)",
        enunciado:
          "Na produção social da sua vida, os homens contraem determinadas relações necessárias e independentes da sua vontade, relações de produção que correspondem a uma determinada fase de desenvolvimento das suas forças produtivas materiais. Segundo o materialismo histórico de Karl Marx, o fator determinante das transformações sociais é a:",
        alternativas: {
          A: "evolução das ideias religiosas e morais da elite.",
          B: "vontade individual dos grandes líderes políticos.",
          C: "base econômica e as relações de produção de cada época.",
          D: "harmonia natural entre as diferentes classes sociais.",
          E: "preservação incondicional das tradições culturais.",
        },
        gabarito: "C",
        explicacao_descomplicada:
          "Para Marx, a base econômica material e o modo de produção determinam a superestrutura jurídica, política e cultural da sociedade.",
      },
      {
        id: 1002,
        ano_origem: "ENEM 2016 (Adaptada)",
        enunciado:
          "O trabalhador torna-se tanto mais pobre quanto mais riqueza produz, quanto mais a sua produção aumenta em poder e extensão. O trabalhador torna-se uma mercadoria tão mais barata quanto mais mercadorias cria. Esse texto de Marx descreve o conceito de:",
        alternativas: {
          A: "mais-valia relativa.",
          B: "alienação do trabalho.",
          C: "solidariedade orgânica.",
          D: "anomia social.",
          E: "mobilidade social ascendente.",
        },
        gabarito: "B",
        explicacao_descomplicada:
          "A alienação ocorre quando o trabalhador se torna mero apêndice da máquina, dissociado do fruto do seu trabalho.",
      },
      {
        id: 1003,
        ano_origem: "ENEM 2021 (Adaptada)",
        enunciado:
          "A burguesia não pode existir sem revolucionar continuamente os instrumentos de produção e, com elas, todas as relações sociais. A necessidade de um mercado cada vez mais amplo para seus produtos impele a burguesia por todo o globo. Esse processo relaciona-se diretamente à:",
        alternativas: {
          A: "descentralização completa do poder estatal.",
          B: "globalização e expansão contínua de mercados consumidores.",
          C: "extinção natural da desigualdade entre as nações.",
          D: "redução da dependência tecnológica industrial.",
          E: "valorização exclusiva do trabalho artesanal e local.",
        },
        gabarito: "B",
        explicacao_descomplicada:
          "Marx e Engels descreveram a expansão mundial do capitalismo e a busca incessante por novos mercados, fenômeno base da globalização.",
      },
    ],
  },

  // 1. Matemática - Razão, Proporção e Escala
  {
    disciplina: "Matemática",
    topico_principal: "Razão, Proporção e Escalas no ENEM",
    semana: "Matemática · Semana 1",
    contexto_visual:
      "A proporcionalidade direta e inversa é o conteúdo mais cobrado em toda a prova de Matemática do ENEM. Dominar escalas de mapas, conversão de unidades e regras de três garante de 6 a 10 questões rápidas no exame.",
    canivete_repertorio:
      "Dica de ouro: Em problemas de escala (1:E), lembre-se que para áreas a proporção é ao quadrado (1:E²) e para volumes é ao cubo (1:E³).",
    palavras_do_dia: [
      {
        palavra: "Grandeza",
        significado: "Tudo aquilo que pode ser medido, comparado ou contado (tempo, massa, distância, vazão).",
        exemplo: "A vazão de uma torneira e o tempo de enchimento de uma piscina são grandezas inversamente proporcionais.",
      },
      {
        palavra: "Escala Cartográfica",
        significado: "Razão constante entre a medida linear no desenho/mapa e a medida correspondente no terreno real.",
        exemplo: "Uma escala de 1:250.000 indica que 1 cm no mapa equivale a 2,5 km no mundo real.",
      },
      {
        palavra: "Inversamente Proporcional",
        significado: "Relação onde a multiplicação de uma grandeza por um fator implica a divisão da outra pelo mesmo fator.",
        exemplo: "Se você dobra a velocidade média, o tempo de viagem cai pela metade.",
      },
    ],
    questoes: [
      {
        id: 1004,
        ano_origem: "ENEM 2022",
        enunciado:
          "Um mapa de escala 1 : 500.000 apresenta duas cidades separadas por uma distância gráfica de 4 cm. Qual é a distância real, em quilômetros, entre essas duas cidades?",
        alternativas: {
          A: "2 km",
          B: "20 km",
          C: "200 km",
          D: "2.000 km",
          E: "20.000 km",
        },
        gabarito: "B",
        explicacao_descomplicada:
          "4 cm × 500.000 = 2.000.000 cm. Convertendo: 2.000.000 cm = 20.000 m = 20 km.",
      },
      {
        id: 1005,
        ano_origem: "ENEM 2021",
        enunciado:
          "Um automóvel percorre um trajeto entre duas cidades em 4 horas com velocidade média constante de 60 km/h. Se a velocidade média aumentasse para 80 km/h, qual seria o tempo gasto?",
        alternativas: {
          A: "2h30min",
          B: "3h",
          C: "3h15min",
          D: "3h30min",
          E: "3h45min",
        },
        gabarito: "B",
        explicacao_descomplicada:
          "Velocidade e tempo são inversamente proporcionais: 60 × 4 = 80 × T → 240 = 80T → T = 3 horas.",
      },
      {
        id: 1006,
        ano_origem: "ENEM 2020",
        enunciado:
          "Uma fábrica produz 1.200 peças funcionando durante 8 horas por dia com 5 máquinas. Quantas peças seriam produzidas em 6 horas por dia se apenas 4 dessas máquinas estivessem operando?",
        alternativas: {
          A: "600 peças",
          B: "720 peças",
          C: "800 peças",
          D: "900 peças",
          E: "1.000 peças",
        },
        gabarito: "B",
        explicacao_descomplicada:
          "Produção por máquina/hora = 1200 / (5 × 8) = 30 peças/hora. Com 4 máquinas em 6h: 4 × 6 × 30 = 720 peças.",
      },
    ],
  },

  // 2. Linguagens - Funções da Linguagem e Estratégias Textuais
  {
    disciplina: "Linguagens",
    topico_principal: "Funções da Linguagem e Intencionalidade Discursiva",
    semana: "Linguagens · Semana 1",
    contexto_visual:
      "A prova de Linguagens avalia se você compreende o objetivo comunicativo do autor: informar (referencial), convencer/persuadir (apelativa), expressar sentimentos (emotiva) ou refletir sobre a própria linguagem (metalinguística).",
    canivete_repertorio:
      "Em campanhas publicitárias e de saúde pública, a função predominante é quase sempre a Conativa/Apelativa (foco no receptor com verbos no imperativo).",
    palavras_do_dia: [
      {
        palavra: "Conotativo",
        significado: "Sentido figurado, subjetivo ou simbólico que ultrapassa o sentido literal do dicionário.",
        exemplo: "Dizer que alguém tem 'olhos de ressaca' é um emprego puramente conotativo.",
      },
      {
        palavra: "Intertextualidade",
        significado: "Relação de diálogo, citação, paródia ou alusão que um texto estabelece com outro previamente existente.",
        exemplo: "A propaganda utilizou intertextualidade com o quadro 'Mona Lisa' para chamar atenção.",
      },
      {
        palavra: "Polifonia",
        significado: "Convivência de múltiplas vozes, perspectivas ou discursos dentro de um mesmo texto.",
        exemplo: "O romance contemporâneo constrói seu enredo através da polifonia de narradores.",
      },
    ],
    questoes: [
      {
        id: 1007,
        ano_origem: "ENEM 2022",
        enunciado:
          "Campanhas de conscientização no trânsito costumam utilizar verbos no modo imperativo ('Respeite a faixa', 'Não use o celular ao volante'). Esse recurso evidencia o predomínio de qual função da linguagem?",
        alternativas: {
          A: "Função emotiva ou expressiva.",
          B: "Função metalinguística.",
          C: "Função conativa ou apelativa.",
          D: "Função fática.",
          E: "Função poética.",
        },
        gabarito: "C",
        explicacao_descomplicada:
          "A função conativa/apelativa é focada em influenciar diretamente a conduta do receptor com ordens, apelos ou sugestões.",
      },
      {
        id: 1008,
        ano_origem: "ENEM 2021",
        enunciado:
          "Quando um dicionário define palavras ou uma canção descreve as dificuldades da composição musical, temos o emprego característico de qual função?",
        alternativas: {
          A: "Função referencial.",
          B: "Função metalinguística.",
          C: "Função fática.",
          D: "Função conativa.",
          E: "Função emotiva.",
        },
        gabarito: "B",
        explicacao_descomplicada:
          "A função metalinguística ocorre quando o código linguístico é usado para explicar ou refletir sobre o próprio código.",
      },
    ],
  },

  // 3. Redação - Competência 5 e Proposta de Intervenção
  {
    disciplina: "Redação",
    topico_principal: "Os 5 Elementos da Proposta de Intervenção (C5)",
    semana: "Redação · Semana 1",
    contexto_visual:
      "A Competência 5 vale 200 pontos e exige uma solução concreta, detalhada e que respeite os direitos humanos. Ela precisa conter obrigatoriamente: Agente, Ação, Modo/Meio, Efeito e Detalhamento.",
    canivete_repertorio:
      "Mnemônico infalível: 'Quem faz o quê, como, para quê, e mais um detalhe'. Lembre-se que o detalhamento de qualquer um dos 4 elementos garante os 200 pontos.",
    palavras_do_dia: [
      {
        palavra: "Exequibilidade",
        significado: "Condição daquilo que é viável, praticável e realizável no mundo real.",
        exemplo: "A proposta de intervenção deve apresentar plena exequibilidade governamental e orçamentária.",
      },
      {
        palavra: "Estigmatização",
        significado: "Ato de rotular, desvalorizar ou marginalizar socialmente um indivíduo ou grupo por suas características.",
        exemplo: "O estigma associado às doenças mentais prejudica a busca por ajuda especializada.",
      },
      {
        palavra: "Inalienável",
        significado: "Direito ou atributo fundamental que não pode ser vendido, cedido ou retirado do cidadão.",
        exemplo: "O direito à educação pública e de qualidade é inalienável segundo a Carta Magna.",
      },
    ],
    questoes: [
      {
        id: 1009,
        ano_origem: "ENEM Matriz C5",
        enunciado:
          "Na avaliação da Competência 5 da redação do ENEM, para obter a nota máxima (200 pontos), a proposta de intervenção deve conter articulados:",
        alternativas: {
          A: "apenas uma citação filosófica e o pedido de conscientização da sociedade.",
          B: "agente, ação, meio/modo, efeito e o detalhamento de pelo menos um desses elementos.",
          C: "punições severas e alteração sumária do código penal brasileiro.",
          D: "somente uma crítica contundente à inércia do Poder Executivo.",
          E: "uma reflexão poética sobre o futuro das próximas gerações.",
        },
        gabarito: "B",
        explicacao_descomplicada:
          "A banca do ENEM pontua 40 pontos para cada um dos 5 elementos completos: Agente, Ação, Meio/Modo, Efeito e Detalhamento (40 × 5 = 200).",
      },
      {
        id: 1010,
        ano_origem: "ENEM Guia do Participante",
        enunciado:
          "Ao formular uma proposta de intervenção na redação, o detalhamento pode ser realizado através de:",
        alternativas: {
          A: "um exemplo ilustrativo, uma justificativa ou uma especificação de um dos elementos.",
          B: "uma repetição da tese com outras palavras.",
          C: "um ponto de exclamação no final do parágrafo.",
          D: "uma pergunta retórica direcionada ao corretor.",
          E: "um novo tema não abordado no texto.",
        },
        gabarito: "A",
        explicacao_descomplicada:
          "O detalhamento enriquece um elemento já citado (ex: detalhar o agente com sua função, ou o meio/modo com exemplos práticos de execução).",
      },
    ],
  },

  // 4. Ciências Humanas - Cidadania e Direitos Humanos
  {
    disciplina: "Ciências Humanas",
    topico_principal: "Cidadania, Constituição de 1988 e Direitos Sociais",
    semana: "Ciências Humanas · Semana 2",
    contexto_visual:
      "A Constituição de 1988 ('Constituição Cidadã') marcou a redemocratização brasileira. O ENEM exige a compreensão da evolução dos direitos: civis (liberdade), políticos (voto) e sociais (saúde, educação, trabalho).",
    canivete_repertorio:
      "Conceito de T.H. Marshall: A cidadania plena é conquistada em 3 fases: direitos civis no século XVIII, políticos no século XIX e sociais no século XX.",
    palavras_do_dia: [
      {
        palavra: "Hegemonia",
        significado: "Predomínio político, cultural ou ideológico exercido por uma classe ou grupo sobre a sociedade.",
        exemplo: "A hegemonia cultural reproduz visões de mundo favoráveis aos grupos dominantes.",
      },
      {
        palavra: "Alteridade",
        significado: "Capacidade de reconhecer, respeitar e valorizar as diferenças do outro em sua totalidade.",
        exemplo: "A prática da alteridade é indispensável para erradicar preconceitos e a intolerância religiosa.",
      },
      {
        palavra: "Isonomia",
        significado: "Princípio jurídico que assegura a igualdade de todos perante a lei, sem privilégios.",
        exemplo: "O princípio da isonomia determina que os cidadãos recebam tratamento igualitário pelo Estado.",
      },
    ],
    questoes: [
      {
        id: 1011,
        ano_origem: "ENEM 2022",
        enunciado:
          "A Carta Magna brasileira de 1988 ficou historicamente conhecida como 'Constituição Cidadã'. Esse título se justifica primordialmente porque o documento:",
        alternativas: {
          A: "restringiu os direitos sindicais para atrair investimentos estrangeiros.",
          B: "ampliou de forma inédita as garantias fundamentais, liberdades civis e direitos sociais.",
          C: "instituiu o voto censitário exclusivo para proprietários de terras.",
          D: "eliminou o direito de voto aos cidadãos analfabetos.",
          E: "concentrou os poderes de decisão no comando militar.",
        },
        gabarito: "B",
        explicacao_descomplicada:
          "A CF/88 consolidou a democracia e estabeleceu a mais ampla rede de proteção aos direitos fundamentais e sociais na história brasileira.",
      },
      {
        id: 1012,
        ano_origem: "ENEM 2020",
        enunciado:
          "Segundo a teoria sociológica de T.H. Marshall sobre a evolução da cidadania moderna, os direitos sociais (saúde, educação e previdência) caracterizam-se por:",
        alternativas: {
          A: "garantir o direito à propriedade privada sem qualquer regulamentação estatal.",
          B: "assegurar um padrão mínimo de bem-estar econômico e segurança para a vida civilizada.",
          C: "restringir a participação eleitoral aos contribuintes de alta renda.",
          D: "eliminar a necessidade de políticas públicas assistenciais.",
          E: "delegar os serviços públicos essenciais exclusivamente à iniciativa privada.",
        },
        gabarito: "B",
        explicacao_descomplicada:
          "Direitos sociais garantem que todos os cidadãos, independentemente de renda, tenham acesso à dignidade, saúde, educação e previdência.",
      },
    ],
  },

  // 5. Matemática - Geometria Plana e Áreas
  {
    disciplina: "Matemática",
    topico_principal: "Geometria Plana: Áreas e Decomposição de Figuras",
    semana: "Matemática · Semana 2",
    contexto_visual:
      "Calcular áreas de figuras irregulares no ENEM consiste em decompor o terreno ou objeto em figuras básicas conhecidas: retângulos, triângulos, trapézios e setores circulares.",
    canivete_repertorio:
      "Dica visual: Ao encontrar figuras complexas na malha quadriculada, divida em retângulos e triângulos retângulos ou calcule a área total do retângulo delimitador e subtraia os espaços vazios.",
    palavras_do_dia: [
      {
        palavra: "Apotema",
        significado: "Distância do centro de um polígono regular até o ponto médio de qualquer um dos seus lados.",
        exemplo: "O apótema do hexágono regular é a altura do triângulo equilátero que o compõe.",
      },
      {
        palavra: "Setor Circular",
        significado: "Fatia de um círculo delimitada por dois raios e um arco de circunferência.",
        exemplo: "A área de uma fatia de pizza de 60 graus equivale a 1/6 da área total do círculo.",
      },
      {
        palavra: "Perímetro",
        significado: "Medida do comprimento total do contorno de uma figura geométrica plana.",
        exemplo: "Calcular a cerca necessária para cercar um terreno retangular exige o cálculo do perímetro.",
      },
    ],
    questoes: [
      {
        id: 1013,
        ano_origem: "ENEM 2021",
        enunciado:
          "Um fazendeiro deseja construir um galpão retangular de 12 metros de comprimento por 8 metros de largura. Na entrada, haverá uma varanda em formato de triângulo retângulo com base de 4 m e altura de 3 m. Qual é a área total construída?",
        alternativas: {
          A: "96 m²",
          B: "102 m²",
          C: "108 m²",
          D: "114 m²",
          E: "120 m²",
        },
        gabarito: "B",
        explicacao_descomplicada:
          "Área do galpão retangular: 12 × 8 = 96 m². Área da varanda triangular: (4 × 3) / 2 = 6 m². Área total = 96 + 6 = 102 m².",
      },
      {
        id: 1014,
        ano_origem: "ENEM 2020",
        enunciado:
          "Para pavimentar uma praça circular de raio 10 metros, a prefeitura utilizará lajotas. Considerando π = 3,14, qual é a área total a ser pavimentada?",
        alternativas: {
          A: "31,4 m²",
          B: "62,8 m²",
          C: "157,0 m²",
          D: "314,0 m²",
          E: "628,0 m²",
        },
        gabarito: "D",
        explicacao_descomplicada:
          "Área do círculo = π × r² = 3,14 × (10)² = 3,14 × 100 = 314 m².",
      },
    ],
  },

  // 6. Linguagens - Variação Linguística e Preconceito Linguístico
  {
    disciplina: "Linguagens",
    topico_principal: "Variação Linguística e Adequação ao Contexto",
    semana: "Linguagens · Semana 2",
    contexto_visual:
      "A língua portuguesa é viva e dinâmica. O ENEM cobra o reconhecimento de variações regionais (diatópicas), sociais (diastráticas), históricas (diacrônicas) e situacionais (diafásicas), combatendo o preconceito linguístico.",
    canivete_repertorio:
      "Conceito de Marcos Bagno: 'Não existe falar certo ou errado, existe o falar adequado ou inadequado ao contexto comunicativo'.",
    palavras_do_dia: [
      {
        palavra: "Idioleto",
        significado: "Forma individual e única que uma pessoa específica tem de utilizar a língua.",
        exemplo: "Cada escritor consagrado possui seu próprio idioleto estilístico.",
      },
      {
        palavra: "Jargão",
        significado: "Vocabulário técnico ou gírias compartilhadas por um grupo profissional específico (médicos, advogados, TI).",
        exemplo: "O uso excessivo de jargão jurídico em documentos públicos dificulta o acesso da população.",
      },
      {
        palavra: "Norma Padrão",
        significado: "Variedade linguística de prestígio social utilizada na escrita formal, leis e ambiente acadêmico.",
        exemplo: "A redação do ENEM exige o domínio da norma padrão da língua portuguesa escrita.",
      },
    ],
    questoes: [
      {
        id: 1015,
        ano_origem: "ENEM 2022",
        enunciado:
          "Ao analisar textos literários regionalistas ou letras de música popular que empregam marcas da oralidade, a perspectiva adotada pelo ENEM reconhece esses registros como:",
        alternativas: {
          A: "erros gramaticais que devem ser banidos da literatura nacional.",
          B: "manifestações legítimas da diversidade cultural e linguística brasileira.",
          C: "formas inferiores de comunicação próprias de populações iletradas.",
          D: "distorções temporárias causadas pela falta de escolas.",
          E: "estratégias exclusivas para pessoas sem acesso à internet.",
        },
        gabarito: "B",
        explicacao_descomplicada:
          "Para a linguística contemporânea e para o ENEM, todas as variedades linguísticas são legítimas, ricas e cumprem plenamente sua função comunicativa.",
      },
    ],
  },

  // 7. Redação - Projeto de Texto e Tese Argumentativa
  {
    disciplina: "Redação",
    topico_principal: "Projeto de Texto e Tese Indiscutível (C2 e C3)",
    semana: "Redação · Semana 2",
    contexto_visual:
      "Um projeto de texto estratégico no ENEM antecipa na introdução os dois argumentos principais (D1 e D2) que serão detalhados no desenvolvimento. Isso garante nota máxima na Competência 3.",
    canivete_repertorio:
      "Fórmula clássica de tese: 'Essa conjuntura perversa persiste no Brasil não apenas pela [Causa 1 - omissão estatal], mas também pelo [Causa 2 - silenciamento social]'.",
    palavras_do_dia: [
      {
        palavra: "Premissa",
        significado: "Proposição ou fato inicial que serve de base para a sustentação de um argumento ou conclusão.",
        exemplo: "A premissa da sustentabilidade é que os recursos naturais do planeta são finitos.",
      },
      {
        palavra: "Lacuna",
        significado: "Falta, omissão ou brecha em uma legislação, política pública ou debate social.",
        exemplo: "A lacuna na fiscalização ambiental favorece o desmatamento ilegal na Amazônia.",
      },
      {
        palavra: "Concomitante",
        significado: "Que acontece ao mesmo tempo; simultâneo ou conjunto.",
        exemplo: "O avanço econômico deve ocorrer de maneira concomitante à justiça distributiva.",
      },
    ],
    questoes: [
      {
        id: 1016,
        ano_origem: "ENEM Competência 3",
        enunciado:
          "Na avaliação da Competência 3 da redação do ENEM, a banca examinadora penaliza textos que apresentam:",
        alternativas: {
          A: "seleção coerente de argumentos em defesa de um ponto de vista claro.",
          B: "projeto de texto com ideias soltas, repertório desarticulado e contradições internas.",
          C: "uso adequado de dados estatísticos e fontes oficiais.",
          D: "desenvolvimento equilibrado dos dois argumentos principais.",
          E: "conectivos interparágrafos bem posicionados.",
        },
        gabarito: "B",
        explicacao_descomplicada:
          "A C3 avalia o planejamento prévio e a coerência lógica: ideias desconexas ou sem projeto claro impedem a pontuação máxima.",
      },
    ],
  },
];

export const CRONOGRAMA_START_DATE = "13/08/2026";

/**
 * Deterministic schedule index calculator based on date string "DD/MM/YYYY"
 */
export function getScheduleIndexForDate(dateStr: string): number {
  try {
    const [dd, mm, yyyy] = dateStr.split("/").map(Number);
    // Base reference: Aug 13, 2026 (Day 1 of study plan)
    const baseDate = new Date(2026, 7, 13);
    const targetDate = new Date(yyyy, mm - 1, dd);
    const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    const positiveIndex = ((diffDays % CURRICULUM_BANK.length) + CURRICULUM_BANK.length) % CURRICULUM_BANK.length;
    return positiveIndex;
  } catch {
    return 0;
  }
}

/**
 * Returns full DailyContent for a given date from the curriculum schedule
 */
export function getCurriculumForDate(dateStr: string): DailyContent {
  const index = getScheduleIndexForDate(dateStr);
  const template = CURRICULUM_BANK[index] ?? CURRICULUM_BANK[0];

  // Calculate week number relative to date
  let semanaLabel = template.semana;
  try {
    const [dd] = dateStr.split("/").map(Number);
    const weekNum = Math.min(Math.max(1, Math.ceil(dd / 7)), 5);
    semanaLabel = `${template.disciplina} · Semana ${weekNum}`;
  } catch {
    // keep default
  }

  return {
    data: dateStr,
    semana: semanaLabel,
    disciplina: template.disciplina,
    topico_principal: template.topico_principal,
    contexto_visual: template.contexto_visual,
    canivete_repertorio: template.canivete_repertorio,
    palavras_do_dia: template.palavras_do_dia,
    questoes: template.questoes,
  };
}

/**
 * Intelligent topic & discipline detection from raw API content
 */
export function inferTopicAndDisciplina(
  raw: Record<string, unknown>,
  fallbackDate: string
): { disciplina: Disciplina; topico_principal: string; semana: string } {
  const scheduled = getCurriculumForDate(fallbackDate);

  // 1. If explicit topico_principal is given and not the old generic fallback
  const explicitTopico =
    (raw.topico_principal as string) ||
    (raw.topico as string) ||
    (raw.tema as string) ||
    (raw.titulo as string) ||
    (raw.title as string);

  if (
    explicitTopico &&
    explicitTopico.trim() !== "" &&
    !explicitTopico.toLowerCase().includes("decomposição de figuras")
  ) {
    const explicitDisciplina = (raw.disciplina as Disciplina) || scheduled.disciplina;
    const explicitSemana = (raw.semana as string) || scheduled.semana;
    return {
      disciplina: explicitDisciplina,
      topico_principal: explicitTopico,
      semana: explicitSemana,
    };
  }

  // 2. Analyze content text (words, questions, contexto)
  const fullText = [
    JSON.stringify(raw.palavras_do_dia ?? ""),
    JSON.stringify(raw.canivete_repertorio ?? ""),
    JSON.stringify(raw.questoes ?? ""),
    JSON.stringify(raw.contexto_visual ?? ""),
  ].join(" ").toLowerCase();

  // Keyword matching
  if (
    fullText.includes("marx") ||
    fullText.includes("luta de classes") ||
    fullText.includes("alienação") ||
    fullText.includes("mais-valia") ||
    fullText.includes("capitalismo") ||
    fullText.includes("trabalhador") ||
    fullText.includes("proletariado")
  ) {
    return {
      disciplina: "Ciências Humanas",
      topico_principal: "Sociologia do Trabalho: Luta de Classes e Alienação",
      semana: "Ciências Humanas · Semana 1",
    };
  }

  if (
    fullText.includes("constituição") ||
    fullText.includes("cidadania") ||
    fullText.includes("direitos humanos") ||
    fullText.includes("marshall") ||
    fullText.includes("república")
  ) {
    return {
      disciplina: "Ciências Humanas",
      topico_principal: "Cidadania, Constituição de 1988 e Direitos Sociais",
      semana: "Ciências Humanas · Semana 2",
    };
  }

  if (
    fullText.includes("proposta de intervenção") ||
    fullText.includes("competência 5") ||
    fullText.includes("repertório sociocultural") ||
    (fullText.includes("agente") && fullText.includes("meio/modo"))
  ) {
    return {
      disciplina: "Redação",
      topico_principal: "Os 5 Elementos da Proposta de Intervenção (C5)",
      semana: "Redação · Semana 1",
    };
  }

  if (
    fullText.includes("função da linguagem") ||
    fullText.includes("metalinguística") ||
    fullText.includes("conativa") ||
    fullText.includes("intertextualidade")
  ) {
    return {
      disciplina: "Linguagens",
      topico_principal: "Funções da Linguagem e Intencionalidade Discursiva",
      semana: "Linguagens · Semana 1",
    };
  }

  if (
    fullText.includes("escala") ||
    fullText.includes("razão") ||
    fullText.includes("proporção") ||
    fullText.includes("regra de três") ||
    fullText.includes("velocidade média")
  ) {
    return {
      disciplina: "Matemática",
      topico_principal: "Razão, Proporção e Escalas no ENEM",
      semana: "Matemática · Semana 1",
    };
  }

  if (
    fullText.includes("área") ||
    fullText.includes("geometria") ||
    fullText.includes("perímetro") ||
    fullText.includes("círculo")
  ) {
    return {
      disciplina: "Matemática",
      topico_principal: "Geometria Plana: Áreas e Decomposição de Figuras",
      semana: "Matemática · Semana 2",
    };
  }

  // 3. Fallback to scheduled topic for that date
  return {
    disciplina: scheduled.disciplina,
    topico_principal: scheduled.topico_principal,
    semana: scheduled.semana,
  };
}

import { getStoredAvailableDates } from "@/lib/api";
import { getHistory } from "@/lib/progress";

/**
 * Checks if a date has available study content:
 * - Checks if the date exists in the spreadsheet catalog or user history.
 * - Does NOT use hardcoded date ranges.
 */
export function isDateAvailableForStudy(dateStr: string): boolean {
  try {
    const historyDates = Object.keys(getHistory());
    const spreadsheetDates = getStoredAvailableDates();
    const knownSet = new Set([...historyDates, ...spreadsheetDates]);

    if (knownSet.size > 0) {
      return knownSet.has(dateStr);
    }

    // If nothing synced yet, allow today and yesterday
    const today = getTodayString();
    return dateStr === today;
  } catch {
    return false;
  }
}

/**
 * Returns a list of all calendar days that exist in the spreadsheet or history.
 */
export function getAllCalendarDays(): {
  date: string;
  isSunday: boolean;
  content: DailyContent;
}[] {
  const historyDates = Object.keys(getHistory());
  const spreadsheetDates = getStoredAvailableDates();
  const knownSet = new Set([...historyDates, ...spreadsheetDates]);

  if (knownSet.size === 0) {
    return [];
  }

  const days: {
    date: string;
    isSunday: boolean;
    content: DailyContent;
  }[] = [];

  for (const dStr of knownSet) {
    days.push({
      date: dStr,
      isSunday: isDateSunday(dStr),
      content: getCurriculumForDate(dStr),
    });
  }

  // Return sorted descending (newest first)
  return days.sort((a, b) => {
    const tA = parseDateString(a.date).getTime();
    const tB = parseDateString(b.date).getTime();
    return tB - tA;
  });
}



