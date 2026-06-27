# AI Agent Skills Repository

此 repository 存放全域 AI agent skills，預期放置於 `~/.agents/skills`。Skills 透過 `npx skills` 管理；自製 skills 的資料夾名稱必須以 `haowen-` 開頭，公開/上游 skills 可保留原名稱。每個 skill 可以是資料夾或指向資料夾的 symlink，但都必須解析到 `SKILL.md`。

## Skills 摘要

| Skill | 類型 | 功能摘要 | 依賴工具 |
| --- | --- | --- | --- |
| `architecture-designer` | 公開/上游 | 設計或審查高階系統架構，建立架構圖、ADR、技術取捨分析、元件互動與擴展性規劃。 | Mermaid（建議）、ADR 文件、系統設計與架構參考資料 |
| `defuddle` | 公開/上游 | 使用 Defuddle CLI 從一般網頁擷取乾淨的 Markdown 內容，移除導覽、廣告與雜訊。 | Node.js、`npm`、`defuddle` |
| `educates-course-design` | 公開/上游 | 規劃 Educates 互動式訓練平台課程，將主題組織成多 workshop curriculum、course brief、resources 與 per-workshop plans。 | Educates training platform、Markdown planning files、`educates-workshop-authoring` skill（實作 workshop 時） |
| `excalidraw-diagram-generator` | 公開/上游 | 從自然語言描述產生 Excalidraw 圖表，支援流程圖、關係圖、心智圖與系統架構圖。 | Excalidraw、`.excalidraw` JSON |
| `find-skills` | 公開/上游 | 協助搜尋、評估與安裝 open agent skills 生態系中的可用 skills。 | Node.js、`npm`、`npx skills`、skills.sh |
| `frontend-slides` | 公開/上游 | 從零建立或轉換 PowerPoint 成動畫豐富的單檔 HTML 簡報，強調固定 16:9 舞台、視覺風格探索與瀏覽器播放。 | HTML、CSS、JavaScript、瀏覽器、PowerPoint 檔案（轉換時） |
| `git-commit` | 公開/上游 | 分析 git diff、智慧 staging，並產生 Conventional Commits 格式的 commit message。 | `git` |
| `haowen-html-to-pdf` | 自製 | 使用 headless Chromium 將本機 HTML 檔案或 URL 轉成 PDF，支援一般頁面 print-to-PDF 與 HTML slide deck 多頁輸出。 | Node.js、`npm`、Puppeteer、pdf-lib |
| `haowen-openlibrary-search` | 自製 | 使用 Open Library API 搜尋作品與作者，並取得作品、作者與封面資訊。 | `http`（httpie）、`jq`、Open Library Search API、Open Library Covers API |
| `haowen-webpage-to-markdown` | 自製 | 擷取網頁內容並儲存為以頁面標題命名的 Markdown 檔案。 | `markdownload`、`curl` |
| `here-now` | 公開/上游 | 發佈網站或檔案到 here.now，並使用 Drive 儲存私人雲端檔案。 | `curl`、`file`、`jq`、here.now API、`publish.sh`、`drive.sh` |
| `json-canvas` | 公開/上游 | 建立與編輯 Obsidian JSON Canvas（`.canvas`）檔案，包含節點、連線與群組。 | JSON Canvas、JSON 驗證工具（如 `jq`） |
| `markdown-to-html` | 公開/上游 | 將 Markdown 轉為 HTML，並涵蓋多種 Markdown/靜態網站工具流程。 | Node.js、`npm`、`marked`、DOMPurify、`sanitize-html`、`js-xss`、Pandoc、LaTeX、Go、`gomarkdown/markdown`、`mdtohtml`、Bluemonday、Ruby、RubyGems、GCC、Make、Jekyll、Bundler、Hugo、Git |
| `marp-slide` | 公開/上游 | 建立 Marp 簡報，包含多種主題、範本與圖片排版指引。 | Marp、Marpit、Marp CLI（選用）、VS Code（選用） |
| `md-to-office` | 公開/上游 | 使用 Pandoc 將 Markdown 轉為 Word、PowerPoint、PDF 等 Office/文件格式。 | Pandoc、LaTeX、wkhtmltopdf、Python、pypandoc、office-mcp、`md_to_docx`、`md_to_pptx` |
| `mole-mac-cleaner` | 公開/上游 | 使用 Mole CLI 深度清理與最佳化 macOS，包含快取清理、app 移除、磁碟分析與專案產物清除。 | `mo` / Mole CLI、Homebrew（選用）、`curl`（選用） |
| `nb` | 公開/上游 | 使用 `nb` CLI 建立、列出、搜尋、書籤化與整理 notes，並支援 Git-backed notebooks 與 wiki-style links。 | `nb` CLI、Git、Markdown/plain text notebooks |
| `obsidian-bases` | 公開/上游 | 建立與編輯 Obsidian Bases（`.base`）檔案，包含 views、filters、formulas 與 summaries。 | Obsidian Bases、YAML 驗證工具 |
| `obsidian-cli` | 公開/上游 | 使用官方 Obsidian CLI 讀取、搜尋、建立與編輯 vault notes、tasks、links、properties 與 plugins。 | Obsidian 1.12.7+、`obsidian` CLI、Obsidian app |
| `obsidian-markdown` | 公開/上游 | 建立與編輯 Obsidian Flavored Markdown，包含 wikilinks、embeds、callouts 與 properties。 | Obsidian、Markdown |
| `pptx` | 公開/上游 | 讀取、解析、建立、編輯、合併或拆分 `.pptx` 簡報，涵蓋 templates、layouts、speaker notes 與 comments。 | Python、`markitdown`、PptxGenJS、Office Open XML 工具/scripts |
| `skill-create` | 公開/上游 | 從 templates 建立新的 Agent Skills，產生標準 `SKILL.md`、README、scripts 與 assets 結構。 | Agent Skills templates、Markdown、可選 scripts/assets 目錄 |
| `slides` | 公開/上游 | 使用 PptxGenJS 建立與編輯 `.pptx` 簡報，適合 sales decks、kickoff briefs 與 design-system showcases。 | Node.js、PptxGenJS |
| `youtube-transcript` | 公開/上游 | 擷取 YouTube 影片字幕並輸出含時間戳的逐字稿。 | Node.js >= 18、`npm`、`youtube-transcript-plus`、YouTube 字幕/逐字稿 |

## 維護注意事項

- 公開/上游 skills 可使用 `npx skills update -g` 同步更新。
- 全域同步可能會更新 `~/.agents/skills` 底下的 skill folders，也可能更新全域 lock file：`~/.agents/.skill-lock.json`。
- 自製 skills 請使用 `haowen-` 前綴。
- 若新增或移除 skills，請同步更新本 README 的 Skills 摘要表。目前 `npx skills ls -g --json` 會列出 24 個 global skills。
- 驗證 skill 清單時請使用 symlink-aware 指令，例如：`find -L . -maxdepth 2 -name SKILL.md -print | sort`；無法解析到 `SKILL.md` 的 symlink 不算有效 skill。
- 同步或編輯後請檢查 `git diff` 與 `git status --short`，並留意 `~/.agents/.skill-lock.json` 是否有變更。
