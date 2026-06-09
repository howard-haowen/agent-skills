# AI Agent Skills Repository

此 repository 存放全域 AI agent skills，預期放置於 `~/.agents/skills`。Skills 透過 `npx skills` 管理；自製 skills 的資料夾名稱必須以 `haowen-` 開頭，公開/上游 skills 可保留原名稱。

## Skills 摘要

| Skill | 類型 | 功能摘要 | 依賴工具 |
| --- | --- | --- | --- |
| `defuddle` | 公開/上游 | 使用 Defuddle CLI 從一般網頁擷取乾淨的 Markdown 內容，移除導覽、廣告與雜訊。 | Node.js、`npm`、`defuddle` |
| `gh-cli` | 公開/上游 | 提供 GitHub CLI 操作 GitHub repository、issue、PR、Actions、release 等的參考。 | `gh`、`git`、`jq`、GitHub REST/GraphQL API |
| `haowen-openlibrary-search` | 自製 | 使用 Open Library API 搜尋作品與作者，並取得作品、作者與封面資訊。 | `http`（httpie）、`jq`、Open Library Search API、Open Library Covers API |
| `haowen-webpage-to-markdown` | 自製 | 擷取網頁內容並儲存為以頁面標題命名的 Markdown 檔案。 | `markdownload`、`curl` |
| `here-now` | 公開/上游 | 發佈網站或檔案到 here.now，並使用 Drive 儲存私人雲端檔案。 | `curl`、`file`、`jq`、here.now API、`publish.sh`、`drive.sh` |
| `markdown-to-html` | 公開/上游 | 將 Markdown 轉為 HTML，並涵蓋多種 Markdown/靜態網站工具流程。 | Node.js、`npm`、`marked`、DOMPurify、`sanitize-html`、`js-xss`、Pandoc、LaTeX、Go、`gomarkdown/markdown`、`mdtohtml`、Bluemonday、Ruby、RubyGems、GCC、Make、Jekyll、Bundler、Hugo、Git |
| `marp-slide` | 公開/上游 | 建立 Marp 簡報，包含多種主題、範本與圖片排版指引。 | Marp、Marpit、Marp CLI（選用）、VS Code（選用） |
| `md-to-office` | 公開/上游 | 使用 Pandoc 將 Markdown 轉為 Word、PowerPoint、PDF 等 Office/文件格式。 | Pandoc、LaTeX、wkhtmltopdf、Python、pypandoc、office-mcp、`md_to_docx`、`md_to_pptx` |
| `obsidian` | 公開/上游 | 使用官方 Obsidian CLI 讀取、搜尋、建立與編輯 vault notes、tasks、links、properties 與 plugins。 | Obsidian 1.12.7+、`obsidian` CLI、Obsidian app |
| `youtube-transcript` | 公開/上游 | 擷取 YouTube 影片字幕並輸出含時間戳的逐字稿。 | Node.js >= 18、`npm`、`youtube-transcript-plus`、YouTube 字幕/逐字稿 |

## 維護注意事項

- 公開/上游 skills 可使用 `npx skills update -g` 同步更新。
- 全域同步可能會更新 `~/.agents/skills` 底下的 skill folders，也可能更新全域 lock file：`~/.agents/.skill-lock.json`。
- 自製 skills 請使用 `haowen-` 前綴。
- 同步或編輯後請檢查 `git diff` 與 `git status --short`，並留意 `~/.agents/.skill-lock.json` 是否有變更。
