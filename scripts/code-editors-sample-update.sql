-- SoftwareOS — Code Editors sample: replace boilerplate descriptions for the top 2 tools
-- Run in Supabase Dashboard > SQL Editor (same pattern as scripts/update-descriptions.sql)
-- Sample scope: vscode + cursor only. If the pattern is approved, the remaining
-- code-editor tools get the same treatment in a follow-up file.

UPDATE tools
SET description = 'Visual Studio Code is Microsoft''s free code editor and the default choice for most developers in 2026. It combines a fast, keyboard-friendly editor with a built-in terminal, Git integration, and a real debugger, then extends in any direction through the largest extension marketplace in the category — language servers, linters, themes, remote development over SSH, WSL and containers, and AI assistants such as GitHub Copilot. It handles everything from quick config edits to large TypeScript, Python, and Go projects without feeling like a heavyweight IDE. The trade-offs: it is Electron-based, so it uses more memory than native editors like Zed or Sublime Text, and large monorepos can slow its search and extensions down. For most stacks, it is the editor to beat.'
WHERE slug = 'vscode';

UPDATE tools
SET description = 'Cursor is an AI-first code editor built on the same foundation as VS Code, so its interface, extensions, and shortcuts feel familiar from day one. The difference is how deeply AI is woven in: Tab completions that predict your next edit, a chat that understands your whole codebase, and agent-style edits that change multiple files from one instruction. It imports your VS Code setup in minutes, which makes switching cheap to try. The core editor is free to download, with a paid Pro tier for heavier AI usage. The trade-offs: the best AI features sit behind that subscription, and teams with strict code-privacy rules should review how requests are processed before rolling it out. If AI pair-programming is the reason you are switching editors, Cursor is the one to try first.'
WHERE slug = 'cursor';
