# Google Apps Script - ENEMFeed Backend

Este diretório contém o código do backend do **ENEMFeed**, executado no Google Apps Script acoplado à sua planilha do Google Sheets.

Como o arquivo agora mora no nosso projeto em `google-apps-script/Code.js`, o assistente de IA tem acesso imediato a ele em qualquer conversa, podendo melhorá-lo, corrigi-lo e versioná-lo junto com o app!

---

## 🚀 Como Sincronizar com o Google Sheets

Existem duas formas de atualizar o código na sua planilha:

### Método 1: Automático via Google Clasp (Recomendado)

O Clasp é a ferramenta oficial do Google para desenvolvedores sincronizarem arquivos locais diretamente com o Apps Script.

1. **Ative a API do Apps Script (apenas 1 vez na vida)**:
   - Acesse [script.google.com/home/usersettings](https://script.google.com/home/usersettings)
   - Marque a opção **"Google Apps Script API"** como **Ativado (ON)**.

2. **Faça login no terminal da sua máquina (apenas 1 vez)**:
   - No terminal deste projeto, execute:
     ```bash
     npx @google/clasp login
     ```
   - Uma janela do seu navegador se abrirá para você autorizar com a sua conta Google.

3. **Vincule com o Script da sua Planilha**:
   - Abra sua planilha no Google Sheets > **Extensões** > **Apps Script**.
   - Olhe a URL no navegador: ela terá o formato:
     `https://script.google.com/home/projects/<SCRIPT_ID>/edit`
   - Copie esse `<SCRIPT_ID>`.
   - Crie o arquivo `.clasp.json` na raiz deste repositório com o conteúdo:
     ```json
     {
       "scriptId": "COLE_SEU_SCRIPT_ID_AQUI",
       "rootDir": "google-apps-script"
     }
     ```

4. **Pronto! Comandos do dia a dia**:
   - Para enviar alterações da nossa pasta para o Google:
     ```bash
     npm run apps:push
     ```
   - Para puxar alterações feitas diretamente no editor web para cá:
     ```bash
     npm run apps:pull
     ```

---

### Método 2: Manual (Simples e Imediato)

Se não quiser configurar o Clasp agora:
1. Abra `google-apps-script/Code.js` neste projeto.
2. Selecione tudo (`Ctrl + A`) e copie (`Ctrl + C`).
3. Abra sua planilha > **Extensões** > **Apps Script**.
4. No arquivo `Código.gs`, selecione tudo e cole (`Ctrl + V`).
5. Clique no ícone de salvar (💾) e em **Implantar > Gerenciar Implantações > Editar > Nova versão > Implantar**.
