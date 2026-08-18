import type { DailyContent } from "@/types";
import { getTodayString } from "@/lib/utils";

export function getFallbackDailyContent(customDate?: string): DailyContent {
  const date = customDate ?? getTodayString();
  return {
    data: date,
    semana: "Semana 1",
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
  };
}
