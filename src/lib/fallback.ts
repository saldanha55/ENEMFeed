import type { DailyContent } from "@/types";
import { getTodayString } from "@/lib/utils";

export function getFallbackDailyContent(customDate?: string): DailyContent {
  const date = customDate ?? getTodayString();
  
  // Calculate day-of-week or date-based index
  let dayIndex = 0;
  try {
    const [dd, mm, yyyy] = date.split("/").map(Number);
    dayIndex = (dd + mm + yyyy) % 4;
  } catch {
    dayIndex = 0;
  }

  const sampleBank: DailyContent[] = [
    {
      data: date,
      semana: "Matemática · Semana 1",
      disciplina: "Matemática",
      topico_principal: "Razão, Proporção e Regra de Três no ENEM",
      contexto_visual:
        "A proporcionalidade direta e inversa é o tema mais recorrente na prova de Matemática do ENEM. Entender como grandezas se relacionam permite resolver questões de escalas de mapas, conversão de unidades, consumo de combustível e dosagem de medicamentos com rapidez e sem fórmulas complexas.",
      canivete_repertorio:
        "Dica de ouro: Se duas grandezas aumentam juntas no mesmo fator, multiplique cruzado (direta). Se uma aumenta e a outra diminui proporcionalmente (ex: velocidade e tempo), multiplique em linha reta (inversa).",
      palavras_do_dia: [
        {
          palavra: "Grandeza",
          significado: "Tudo aquilo que pode ser medido ou contado (ex: tempo, distância, massa, velocidade).",
          exemplo: "A velocidade média e a distância percorrida são grandezas físicas fundamentais.",
        },
        {
          palavra: "Escala",
          significado: "Razão constante entre as dimensões de um desenho/mapa e as medidas reais do objeto.",
          exemplo: "Uma escala 1:100.000 significa que 1 cm no mapa equivale a 1 km na realidade.",
        },
        {
          palavra: "Inversamente Proporcional",
          significado: "Relação onde o aumento de uma variável provoca a diminuição proporcional da outra.",
          exemplo: "Quanto mais operários na obra, menor o tempo necessário para concluí-la.",
        },
      ],
      questoes: [
        {
          id: 1,
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
            "Escala 1 : 500.000 significa que 1 cm no mapa vale 500.000 cm no mundo real. Multiplicando por 4 cm: 4 × 500.000 = 2.000.000 cm. Convertendo para metros (dividindo por 100) = 20.000 m. Convertendo para quilômetros (dividindo por 1.000) = 20 km.",
        },
        {
          id: 2,
          ano_origem: "ENEM 2021",
          enunciado:
            "Um automóvel percorre um trajeto entre duas cidades em 4 horas mantendo uma velocidade média constante de 60 km/h. Se a velocidade média aumentasse para 80 km/h, qual seria o tempo necessário para percorrer o mesmo trajeto?",
          alternativas: {
            A: "2h30min",
            B: "3h",
            C: "3h15min",
            D: "3h30min",
            E: "5h20min",
          },
          gabarito: "B",
          explicacao_descomplicada:
            "Velocidade e tempo são grandezas inversamente proporcionais: V1 × T1 = V2 × T2. Logo: 60 × 4 = 80 × T2 -> 240 = 80 × T2 -> T2 = 240 / 80 = 3 horas.",
        },
        {
          id: 3,
          ano_origem: "ENEM 2020",
          enunciado:
            "Uma fábrica produz 1.200 peças funcionando durante 8 horas por dia com 5 máquinas. Quantas peças seriam produzidas em 6 horas por dia com o mesmo ritmo se apenas 4 dessas máquinas estivessem operando?",
          alternativas: {
            A: "600 peças",
            B: "720 peças",
            C: "800 peças",
            D: "900 peças",
            E: "1.000 peças",
          },
          gabarito: "B",
          explicacao_descomplicada:
            "Cada máquina em 8h produz 1.200 / 5 = 240 peças. Cada máquina produz por hora: 240 / 8 = 30 peças/hora. Com 4 máquinas em 6 horas: 4 máquinas × 6 horas × 30 peças/hora = 720 peças.",
        },
      ],
    },
    {
      data: date,
      semana: "Linguagens · Semana 1",
      disciplina: "Linguagens",
      topico_principal: "Funções da Linguagem e Estratégias Textuais",
      contexto_visual:
        "O ENEM valoriza intensamente a capacidade de identificar a intenção comunicativa dos textos: informar (referencial), emocionar (emotiva), convencer (apelativa/conativa) ou refletir sobre a própria língua (metalinguística).",
      canivete_repertorio:
        "Dica prática: Em anúncios publicitários e campanhas públicas, a função conativa/apelativa predomina (verbos no imperativo, foco em persuadir o receptor).",
      palavras_do_dia: [
        {
          palavra: "Conotativo",
          significado: "Sentido figurado, subjetivo ou poético das palavras, dependente do contexto.",
          exemplo: "A expressão 'coração de pedra' possui sentido puramente conotativo.",
        },
        {
          palavra: "Intertextualidade",
          significado: "Diálogo implícito ou explícito entre dois ou mais textos.",
          exemplo: "A paródia é uma forma clássica de intertextualidade crítica.",
        },
        {
          palavra: "Polifonia",
          significado: "Presença de múltiplas vozes ou pontos de vista em um mesmo enunciado.",
          exemplo: "O romance moderno constrói narrativas através da polifonia de personagens.",
        },
      ],
      questoes: [
        {
          id: 101,
          ano_origem: "ENEM 2022",
          enunciado:
            "Campanhas de conscientização no trânsito costumam utilizar verbos no modo imperativo ('Respeite o pedestre', 'Não use o celular ao dirigir'). Esse recurso linguístico evidencia o predomínio de qual função da linguagem?",
          alternativas: {
            A: "Função emotiva ou expressiva.",
            B: "Função metalinguística.",
            C: "Função conativa ou apelativa.",
            D: "Função fática.",
            E: "Função poética.",
          },
          gabarito: "C",
          explicacao_descomplicada:
            "A função conativa/apelativa é centrada no receptor, com o objetivo de influenciar seu comportamento, persuadi-lo ou emitir ordens/conselhos, tipicamente com verbos no imperativo.",
        },
        {
          id: 102,
          ano_origem: "ENEM 2021",
          enunciado:
            "Quando um poema descreve o ato de escrever poesia ou uma música fala sobre o processo de composição musical, temos o emprego característico de qual função da linguagem?",
          alternativas: {
            A: "Função referencial.",
            B: "Função metalinguística.",
            C: "Função fática.",
            D: "Função conativa.",
            E: "Função emotiva.",
          },
          gabarito: "B",
          explicacao_descomplicada:
            "A função metalinguística ocorre quando o código linguístico é utilizado para explicar ou refletir sobre o próprio código (a linguagem falando sobre a linguagem).",
        },
      ],
    },
    {
      data: date,
      semana: "Redação · Semana 1",
      disciplina: "Redação",
      topico_principal: "Repertório Sociocultural e Proposta de Intervenção",
      contexto_visual:
        "A nota 1000 na Redação do ENEM depende de uma tese clara nos primeiros parágrafos, conectivos interparágrafos diversificados e uma proposta de intervenção com os 5 elementos obrigatórios: Agente, Ação, Meio/Modo, Detalhamento e Efeito.",
      canivete_repertorio:
        "Citação coringa: Zygmunt Bauman em 'Modernidade Líquida' — útil para discutir a fragilidade dos laços sociais, consumo desenfreado e volatilidade das relações contemporâneas.",
      palavras_do_dia: [
        {
          palavra: "Inalienável",
          significado: "Direito ou condição que não pode ser transferido, revogado ou retirado de alguém.",
          exemplo: "A dignidade humana é um princípio constitucional inalienável.",
        },
        {
          palavra: "Estigmatização",
          significado: "Processo social de atribuir uma marca negativa, preconceito ou discriminação a um grupo.",
          exemplo: "O estigma associado às doenças mentais dificulta a busca por tratamento adequado.",
        },
        {
          palavra: "Exequibilidade",
          significado: "Qualidade daquilo que pode ser concretamente executado ou colocado em prática.",
          exemplo: "A proposta de intervenção deve demonstrar exequibilidade no cenário nacional.",
        },
      ],
      questoes: [
        {
          id: 201,
          ano_origem: "ENEM Competência 5",
          enunciado:
            "Na avaliação da Competência 5 da redação do ENEM, para alcançar a pontuação máxima (200 pontos), o candidato deve elaborar uma proposta de intervenção que contenha articulados:",
          alternativas: {
            A: "Apenas o agente governamental e a punição cabível.",
            B: "Agente, ação, meio/modo, efeito e o detalhamento de pelo menos um desses elementos.",
            C: "Uma citação filosófica e um exemplo histórico detalhado.",
            D: "Apenas conscientização individual e apelo moral à sociedade.",
            E: "Uma crítica aos poderes públicos com linguagem poética.",
          },
          gabarito: "B",
          explicacao_descomplicada:
            "A matriz de referência do ENEM exige estritamente 5 elementos completos na intervenção: Agente (quem faz), Ação (o que fazer), Meio/Modo (como fazer), Efeito (para que fazer) e Detalhamento (explicação extra de um dos 4 anteriores).",
        },
      ],
    },
    {
      data: date,
      semana: "Ciências Humanas · Semana 1",
      disciplina: "Ciências Humanas",
      topico_principal: "Cidadania, Direitos Humanos e Democracia",
      contexto_visual:
        "A prova de Humanas cobra a construção histórica dos direitos (civis, políticos e sociais) e as transformações sociopolíticas no Brasil desde a República Velha até a Constituição Cidadã de 1988.",
      canivete_repertorio:
        "Conceito chave: Marshall define a conquista da cidadania em 3 gerações: direitos civis (século XVIII), direitos políticos (século XIX) e direitos sociais (século XX).",
      palavras_do_dia: [
        {
          palavra: "Hegemonia",
          significado: "Supremacia ou liderança política, cultural ou ideológica exercida por um grupo sobre outros.",
          exemplo: "A hegemonia cultural influencia hábitos de consumo e valores de uma sociedade.",
        },
        {
          palavra: "Alteridade",
          significado: "Reconhecimento, respeito e valorização da diferença em relação ao outro.",
          exemplo: "A prática da alteridade é indispensável para a superação da intolerância.",
        },
      ],
      questoes: [
        {
          id: 301,
          ano_origem: "ENEM 2022",
          enunciado:
            "A Constituição brasileira de 1988 ficou conhecida como 'Constituição Cidadã'. Esse título se justifica principalmente porque a Carta Magna:",
          alternativas: {
            A: "Restringiu os direitos trabalhistas para atrair capitais internacionais.",
            B: "Ampliou consideravelmente as garantias fundamentais e os direitos sociais no país.",
            C: "Instituiu o voto censitário exclusivo para chefes de família.",
            D: "Eliminou o sufrágio universal para analfabetos.",
            E: "Centralizou as decisões executivas exclusivamente no poder militar.",
          },
          gabarito: "B",
          explicacao_descomplicada:
            "A CF/88 consolidou o processo de redemocratização do Brasil, assegurando direitos civis, políticos, sociais, deveres do Estado em saúde e educação públicas e proteção às minorias.",
        },
      ],
    },
  ];

  return sampleBank[dayIndex % sampleBank.length];
}
