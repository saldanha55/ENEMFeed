/**
 * ============================================================================
 * ENEMFeed - Google Apps Script Backend (Gemini AI + Google Sheets)
 * ============================================================================
 * Sincronizado localmente com o projeto ENEMFeed.
 * Atualize este arquivo aqui e sincronize com a nuvem via `clasp push`
 * ou copie e cole no editor do Apps Script da sua planilha.
 */

// Chave da API do Google Gemini (salva em Configurações do Projeto > Propriedades do Script)
// Obtenha sua chave gratuita em: https://aistudio.google.com/
const GEMINI_API_KEY = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");

// Modelo a ser utilizado (ex: gemini-3.6-flash, gemini-3.6-pro)
const GEMINI_MODEL = "gemini-3.6-flash";

/**
 * Função acionada diariamente por acionador (trigger) ou manualmente.
 * Gera o conteúdo do dia e adianta o próximo dia pendente na planilha.
 */
function gerarConteudoDiario() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const dados = sheet.getDataRange().getValues();
  const hoje = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy");
  
  let linhaHojeIndex = -1;
  let geradosHojeCount = 0;

  // 1. Procura a linha de HOJE
  for (let i = 1; i < dados.length; i++) {
    let dataCel = dados[i][0];
    let dataFormatada = dataCel instanceof Date 
      ? Utilities.formatDate(dataCel, "America/Sao_Paulo", "dd/MM/yyyy") 
      : String(dataCel).trim();

    if (dataFormatada === hoje) {
      linhaHojeIndex = i;
      const status = dados[i][4];

      if (status !== "Concluído") {
        Logger.log("⏳ Gerando conteúdo de HOJE (" + dataFormatada + ")...");
        processarLinha(sheet, i, dados[i][2], dados[i][3]);
        geradosHojeCount++;
      } else {
        Logger.log("ℹ️ O conteúdo de HOJE (" + dataFormatada + ") já estava concluído.");
      }
      break;
    }
  }

  // 2. Procura a PRÓXIMA linha pendente na sequência da planilha (o próximo dia de estudo)
  const inicioBusca = linhaHojeIndex !== -1 ? linhaHojeIndex + 1 : 1;

  for (let i = inicioBusca; i < dados.length; i++) {
    const status = dados[i][4];
    let dataCel = dados[i][0];
    let dataFormatada = dataCel instanceof Date 
      ? Utilities.formatDate(dataCel, "America/Sao_Paulo", "dd/MM/yyyy") 
      : String(dataCel).trim();

    if (status !== "Concluído" && dados[i][3]) { // tem tópico e está pendente
      if (geradosHojeCount > 0) Utilities.sleep(2500); // Pausa para não estourar rate limit
      
      Logger.log("⏳ Adiantando próximo dia de estudo (" + dataFormatada + " - " + dados[i][3] + ")...");
      processarLinha(sheet, i, dados[i][2], dados[i][3]);
      Logger.log("✅ Próximo dia adiantado com sucesso!");
      break; // Adiantou 1 dia com sucesso, encerra a execução
    }
  }
}

// Função auxiliar para chamar a IA e gravar na planilha
function processarLinha(sheet, rowIndex, disciplina, topico) {
  try {
    const conteudoJson = chamarGemini(disciplina, topico);
    sheet.getRange(rowIndex + 1, 6).setValue(conteudoJson);
    sheet.getRange(rowIndex + 1, 5).setValue("Concluído");
  } catch (err) {
    Logger.log("❌ Erro ao processar linha " + (rowIndex + 1) + ": " + err.message);
  }
}

/**
 * Chama a API do Gemini com o prompt instruído para o ENEM, incluindo
 * suporte a ilustrações vetoriais (SVG) ou imagens apenas quando relevante.
 */
function chamarGemini(disciplina, topico) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  
  const systemPrompt = `
Você é o mentor de estudos da Luana para o ENEM. Ela é CLT 6x1 e tem apenas 10 minutos diários.
Matéria do dia: ${disciplina}
Tópico: ${topico}

Instruções importantes:
- Gere ESTRITAMENTE entre 3 a 5 questões reais ou perfeitamente adaptadas do estilo ENEM sobre o tópico do dia.
- Mantenha explicações curtas e didáticas.

DIRETRIZES DE RECURSOS VISUAIS E ECONOMIA INTELIGENTE DE TOKENS:
- O campo "visual" deve trazer suporte visual real (vetorial em SVG ou imagem).
- PRIORIZE A UTILIDADE: Só gere ilustrações visuais quando o tópico ou a questão realmente depender disso (ex: Geometria Plana/Espacial, Funções e Gráficos Cartesianos, Trigonometria, Análise de Gráficos estatísticos de barras/linhas, Decomposição de Forças/Vetores na Física, Circuitos, Óptica, Relevo/Cartografia, Biologia celular/esquemas).
- SE FOR PURAMENTE CONCEITUAL/TEXTUAL (ex: Filosofia teórica, Gramática, Literatura sem figuras): defina "visual": {"tipo": "nenhum", "conteudo": "", "legenda": ""}. NÃO gaste tokens à toa!
- QUANDO GERAR SVG ("tipo": "svg"):
  * Gere código SVG limpo, moderno, com viewBox (ex: viewBox="0 0 400 220"), responsivo para telas de celular.
  * Cores acessíveis (linhas nítidas stroke="#3b82f6" ou stroke="currentColor", stroke-width="2", preenchimentos suaves com transparência, textos legíveis font-size="12" a "14" font-family="sans-serif").
  * Em gráficos, destaque eixos X e Y e pontos de interesse (ex: raízes, vértice, assíntotas).
  * Em geometria, mostre claramente os ângulos retos, cotas, medidas dos lados e decomposição.
- Caso conheça uma imagem pública, histórica ou fotográfica consolidada essencial (ex: foto histórica de revolta, pintura clássica), pode indicar "tipo": "imagem" com a URL e legenda explicativa.

Retorne ESTRITAMENTE um JSON puro (sem markdown \`\`\`json) no seguinte formato:
{
  "palavras_do_dia": [
    {"palavra": "Termo 1", "significado": "Explicação curta e intuitiva", "exemplo": "Como cai ou onde se aplica"},
    {"palavra": "Termo 2", "significado": "...", "exemplo": "..."},
    {"palavra": "Termo 3", "significado": "...", "exemplo": "..."}
  ],
  "contexto_visual": "Texto formatado explicando o conceito por lógica/decomposição, sem fórmulas complexas.",
  "visual": {
    "tipo": "svg",
    "conteudo": "<svg viewBox=\\"0 0 400 220\\" xmlns=\\"http://www.w3.org/2000/svg\\">...</svg>",
    "legenda": "Descrição clara da figura/gráfico"
  },
  "canivete_repertorio": "Dica prática de repertório (Marx, Bourdieu, Carolina Maria de Jesus, Trilha Sonora do Gueto, Consciência Humana, 509-E ou SNJ).",
  "questoes": [
    {
      "id": 1,
      "ano_origem": "ENEM 2022",
      "enunciado": "Enunciado da questão 1",
      "visual": {
        "tipo": "svg",
        "conteudo": "<svg viewBox=\\"0 0 400 200\\" xmlns=\\"http://www.w3.org/2000/svg\\">...</svg>",
        "legenda": "Figura ou gráfico indispensável para responder a questão"
      },
      "alternativas": {
        "A": "...",
        "B": "...",
        "C": "...",
        "D": "...",
        "E": "..."
      },
      "gabarito": "A",
      "explicacao_descomplicada": "Por que essa é a certa em poucas palavras."
    },
    {
      "id": 2,
      "ano_origem": "ENEM 2021",
      "enunciado": "Enunciado da questão 2 (sem necessidade de figura)",
      "visual": {
        "tipo": "nenhum",
        "conteudo": "",
        "legenda": ""
      },
      "alternativas": {
        "A": "...",
        "B": "...",
        "C": "...",
        "D": "...",
        "E": "..."
      },
      "gabarito": "C",
      "explicacao_descomplicada": "Explicação curta da alternativa correta."
    }
  ]
}
`;

  const payload = {
    contents: [{ parts: [{ text: systemPrompt }] }],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    if (responseCode !== 200) {
      Logger.log("❌ Erro na API do Gemini (Código " + responseCode + "): " + responseText);
      throw new Error("Erro da API Gemini: " + responseText);
    }
    
    const json = JSON.parse(responseText);
    
    if (!json.candidates || json.candidates.length === 0) {
      Logger.log("❌ Resposta sem candidates: " + responseText);
      throw new Error("Gemini não retornou nenhum candidato.");
    }
    
    const textoGerado = json.candidates[0].content.parts[0].text;
    return textoGerado;

  } catch (erro) {
    Logger.log("❌ Exceção capturada: " + erro.message);
    throw erro;
  }
}

/**
 * Endpoint HTTP GET do Apps Script Web App.
 * Serve a API consumida pelo frontend Next.js do ENEMFeed.
 */
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const dados = sheet.getDataRange().getValues();
  const hoje = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy");
  
  const rows = [];
  let itemHoje = null;

  // Percorre todas as linhas da planilha (a partir da linha 2)
  for (let i = 1; i < dados.length; i++) {
    const rawData = dados[i][0];
    if (!rawData) continue;

    let dataFormatada = "";
    if (rawData instanceof Date) {
      dataFormatada = Utilities.formatDate(rawData, "America/Sao_Paulo", "dd/MM/yyyy");
    } else {
      dataFormatada = String(rawData).trim();
    }

    // Lê os campos de cada coluna
    const semana = dados[i][1] ? String(dados[i][1]).trim() : "Conteúdo do Dia";
    const disciplina = dados[i][2] ? String(dados[i][2]).trim() : "Matemática";
    const topico = dados[i][3] ? String(dados[i][3]).trim() : "";
    const status = dados[i][4] ? String(dados[i][4]).trim() : "Pendente";
    const jsonStr = dados[i][5];

    let item = {};
    if (jsonStr) {
      try {
        item = JSON.parse(jsonStr);
      } catch (err) {
        item = {};
      }
    }

    // Injeta os dados reais da planilha dentro do objeto
    item.data = dataFormatada;
    item.semana = semana;
    item.disciplina = disciplina;
    item.topico_principal = topico;
    item.status = status;

    // Só adiciona se a linha tiver conteúdo gerado
    if (jsonStr && item.questoes && item.questoes.length > 0) {
      rows.push(item);
      if (dataFormatada === hoje) {
        itemHoje = item;
      }
    }
  }

  // 1. Se o app pedir uma data específica (ex: ?data=18/08/2026)
  if (e && e.parameter && e.parameter.data) {
    const dataAlvo = String(e.parameter.data).trim();
    const encontrado = rows.find(function(r) { return r.data === dataAlvo; });
    if (encontrado) {
      return ContentService.createTextOutput(JSON.stringify(encontrado))
        .setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({ erro: "Conteúdo não encontrado para esta data" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 2. Se o app pedir todas as linhas ou consultar a lista geral
  if (e && e.parameter && e.parameter.all) {
    return ContentService.createTextOutput(JSON.stringify({ rows: rows }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 3. Consulta padrão: retorna o dia de hoje (ou todas as linhas se hoje não existir)
  if (itemHoje) {
    return ContentService.createTextOutput(JSON.stringify(itemHoje))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ rows: rows }))
    .setMimeType(ContentService.MimeType.JSON);
}
