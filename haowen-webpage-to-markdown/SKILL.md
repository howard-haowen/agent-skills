---
name: haowen-webpage-to-markdown
description: Fetch webpage content and save it as a new Markdown file.
---

# Webpage to Markdown Fetch Skill

## Purpose
Fetch webpage content and save it as a new Markdown file.

## Priority Order
1. **Preferred:** `markdownload <url>`
2. **Fallback:** `curl <url>`

## Required Outcome
Create a new file named `<file-name>.md` where:
- `<file-name>` is derived from the webpage title.
- If no title is available, generate a concise title from the content.
- The file name must be sanitized for filesystem safety.

---

## Instructions

### 1) Try `markdownload` first
Run:

```bash
markdownload <url>
```

#### Success criteria
- The command returns Markdown content or creates a Markdown file.
- If a title is available, use it to determine the output file name.

#### If `markdownload` prints Markdown to stdout
1. Extract the title from the returned content, preferring in this order:
   - YAML front matter `title:`
   - First Markdown heading `# ...`
   - HTML `<title>...</title>` if embedded
2. Sanitize the title into a safe file name.
3. Save the content as:

```bash
<sanitized-title>.md
```

#### If `markdownload` already creates a file
1. Inspect the generated file.
2. If the file name is not based on the webpage title, rename it to:

```bash
<sanitized-title>.md
```

### 2) If `markdownload` fails, use `curl`
Run:

```bash
curl -L <url>
```

> Use `-L` so redirects are followed.

#### From the HTML response
1. Extract the webpage title from the first available source:
   - `<title>...</title>`
   - `meta property="og:title"`
   - `meta name="twitter:title"`
2. Extract the main textual content as best as possible.
3. Convert the result into Markdown.
4. Save it as:

```bash
<sanitized-title>.md
```

### 3) If no title is returned
Generate a title from the content:
- Use the main heading if one is clearly present.
- Otherwise summarize the content into a short title of **3 to 8 words**.
- Avoid generic titles like `index`, `home`, `untitled`, or `page` unless nothing else is available.

Then sanitize the generated title and save as:

```bash
<sanitized-title>.md
```

---

## File Name Rules
When converting a title into `<file-name>`:

1. Convert to lowercase.
2. Trim leading/trailing whitespace.
3. Replace spaces and repeated separators with a single hyphen (`-`).
4. Remove or replace characters unsafe for file names:
   - `/ \\ : * ? " < > |`
5. Remove surrounding punctuation.
6. Limit length to a reasonable size (recommended: 80 characters max).
7. If the result is empty, use:

```text
webpage-content
```

Final output file format:

```text
<file-name>.md
```

---

## Recommended Markdown Structure
The saved Markdown file should ideally contain:

```md
# <Page Title>

Source: <url>

<converted page content>
```

If useful, also include:
- Retrieval timestamp
- Original HTML title
- Notes about missing or inferred title

---

## Operational Behavior

### Preferred workflow
1. Run `markdownload <url>`.
2. If it succeeds, use its Markdown output.
3. Determine the title.
4. Save or rename to `<file-name>.md`.
5. If it fails, run `curl -L <url>`.
6. Extract title and content from HTML.
7. Convert to Markdown.
8. Save to `<file-name>.md`.

### Error handling
- If both commands fail, report the fetch failure clearly.
- If content is partial, still create the Markdown file if meaningful text was retrieved.
- If the title is missing or unusable, generate one from the content.

---

## Example

### Input
```bash
markdownload https://example.com/some-article
```

### Possible output file
```text
some-article-title.md
```

### Fallback
```bash
curl -L https://example.com/some-article
```

If the page title is `A Practical Guide to AI Agents`, the output file should be:

```text
a-practical-guide-to-ai-agents.md
```

---

## Short Instruction Block
Use this behavior whenever asked to fetch webpage content:

```text
Fetch webpage content with this priority:
1. markdownload <url>
2. if that fails, curl -L <url>

Save the result as a new Markdown file named <file-name>.md.
Derive <file-name> from the webpage title.
If no title is available, generate a concise title from the page content.
Always sanitize the file name for safe filesystem usage.
```
