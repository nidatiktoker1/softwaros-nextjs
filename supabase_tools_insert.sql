-- VPN Tools (15 new tools)
INSERT INTO public.software (slug, name, tagline, category, category_slug, trust_score, has_free_tier, starting_price, affiliate_network, reddit_search_term, platforms, is_trending, best_for_tags) VALUES
('cyberghost-vpn', 'CyberGhost', 'VPN with 91 countries coverage', 'VPN', 'vpn', 8.8, false, 2.99, 'awin,shareasale', 'cyberghost vpn', '["Windows","macOS","Linux","iOS","Android","Router"]', false, '["Streaming","Privacy","Gaming","P2P"]'),
('surfshark-vpn', 'Surfshark', 'Unlimited simultaneous connections', 'VPN', 'vpn', 8.7, false, 2.49, 'awin,shareasale', 'surfshark vpn', '["Windows","macOS","Linux","iOS","Android"]', false, '["Unlimited Devices","Privacy","Affordable"]'),
('protonvpn', 'ProtonVPN', 'From the makers of ProtonMail', 'VPN', 'vpn', 8.6, true, 4.99, 'awin', 'protonvpn', '["Windows","macOS","Linux","iOS","Android"]', true, '["Privacy","Open Source","Secure","Email Integration"]'),
('mullvad-vpn', 'Mullvad', 'Privacy-focused VPN from Sweden', 'VPN', 'vpn', 8.9, true, 5.52, NULL, 'mullvad vpn', '["Windows","macOS","Linux","iOS","Android"]', true, '["Privacy","Open Source","Audited","No Logging"]'),
('hotspot-shield', 'Hotspot Shield', 'Fast VPN for streaming', 'VPN', 'vpn', 8.3, true, 2.75, 'awin', 'hotspot shield vpn', '["Windows","macOS","iOS","Android"]', false, '["Streaming","Speed","Gaming"]'),
('tunnelbear', 'TunnelBear', 'VPN with friendly bear mascot', 'VPN', 'vpn', 8.1, true, 4.99, 'awin', 'tunnelbear vpn', '["Windows","macOS","iOS","Android","Linux"]', false, '["Beginner Friendly","Simple","Streaming"]'),
('ipvanish', 'IPVanish', 'US-based VPN with high speeds', 'VPN', 'vpn', 8.4, false, 3.25, 'awin,shareasale', 'ipvanish vpn', '["Windows","macOS","Linux","iOS","Android"]', false, '["Speed","P2P","Torrenting"]'),
('privatevpn', 'PrivateVPN', 'Small but effective VPN service', 'VPN', 'vpn', 8.2, false, 1.89, 'awin', 'privatevpn', '["Windows","macOS","Linux","iOS","Android"]', false, '["Affordable","Privacy","Secure"]'),
('vypr-vpn', 'VyprVPN', 'Proprietary Chameleon protocol', 'VPN', 'vpn', 8.5, true, 6.67, 'awin', 'vypr vpn', '["Windows","macOS","iOS","Android"]', false, '["China Access","Speed","Privacy"]'),
('hide-me-vpn', 'Hide.me', 'Swiss-based VPN service', 'VPN', 'vpn', 8.3, true, 4.99, 'awin', 'hide.me vpn', '["Windows","macOS","Linux","iOS","Android"]', false, '["Privacy","Swiss Based","Logs"]'),
('windscribe-vpn', 'Windscribe', 'VPN with free premium tier', 'VPN', 'vpn', 8.2, true, 4.08, 'awin', 'windscribe vpn', '["Windows","macOS","Linux","iOS","Android"]', false, '["Free Tier","Privacy","Affordable"]'),
('safervpn', 'SaferVPN', 'Easy-to-use VPN service', 'VPN', 'vpn', 7.9, true, 2.49, 'awin', 'safervpn', '["Windows","macOS","iOS","Android"]', false, '["Beginner Friendly","Affordable"]'),
('purevpn', 'PureVPN', 'Pakistani VPN with streaming focus', 'VPN', 'vpn', 8.0, false, 1.99, 'awin,shareasale', 'purevpn', '["Windows","macOS","Linux","iOS","Android"]', false, '["Cheap","Streaming","Gaming"]'),
('urban-vpn', 'UrbanVPN', 'Browser-based VPN extension', 'VPN', 'vpn', 7.7, true, 0, 'awin', 'urban vpn', '["Windows","macOS","Browser"]', false, '["Free","Browser Extension"]'),
('torguard-vpn', 'TorGuard', 'Streaming and torrent-friendly', 'VPN', 'vpn', 8.1, true, 3.33, 'awin', 'torguard vpn', '["Windows","macOS","Linux","iOS","Android"]', false, '["P2P","Streaming","Affordable"]');

-- AI Chatbots (18 new tools)
INSERT INTO public.software (slug, name, tagline, category, category_slug, trust_score, has_free_tier, starting_price, affiliate_network, reddit_search_term, platforms, is_trending, best_for_tags) VALUES
('perplexity-ai', 'Perplexity AI', 'AI search engine with citations', 'AI Chatbots', 'ai-chatbots', 8.6, true, 20, NULL, 'perplexity ai', '["Web","iOS","Android"]', true, '["Search","Citations","Research"]'),
('hugging-chat', 'HuggingChat', 'Open-source ChatGPT alternative', 'AI Chatbots', 'ai-chatbots', 8.3, true, 0, NULL, 'huggingchat', '["Web","API"]', true, '["Open Source","Free","No Account"]'),
('you-dot-com', 'You.com', 'AI search with real-time web', 'AI Chatbots', 'ai-chatbots', 8.1, true, 0, NULL, 'you.com ai', '["Web","Mobile"]', false, '["Search","Free","Web Access"]'),
('cohere-platform', 'Cohere', 'Enterprise AI language models', 'AI Chatbots', 'ai-chatbots', 8.7, true, 10, NULL, 'cohere platform', '["API","Web"]', false, '["Enterprise","API","Custom"]'),
('replika-ai', 'Replika', 'Personal AI companion chatbot', 'AI Chatbots', 'ai-chatbots', 8.0, true, 9.99, NULL, 'replika ai', '["iOS","Android","Web"]', false, '["Companion","Personalized","Mental Health"]'),
('character-ai', 'Character.AI', 'Chat with fictional characters', 'AI Chatbots', 'ai-chatbots', 8.2, true, 9.99, NULL, 'character ai', '["Web","iOS","Android"]', true, '["Creative","Entertainment","Roleplay"]'),
('llama-2', 'Llama 2', 'Meta open-source LLM', 'AI Chatbots', 'ai-chatbots', 8.8, true, 0, NULL, 'llama 2 model', '["API","Local","Cloud"]', true, '["Open Source","Powerful","Free"]'),
('mistral-ai', 'Mistral', 'European open-source AI model', 'AI Chatbots', 'ai-chatbots', 8.5, true, 0.2, NULL, 'mistral ai', '["API","Local"]', true, '["European","Fast","Open Source"]'),
('palm-2', 'Palm 2', 'Google advanced language model', 'AI Chatbots', 'ai-chatbots', 8.6, true, 0, NULL, 'palm 2 google', '["API","Gemini"]', false, '["Google","Powerful","Research"]'),
('anthropic-claude', 'Claude API', 'Claude AI via API', 'AI Chatbots', 'ai-chatbots', 8.9, true, 0.003, NULL, 'claude api anthropic', '["API","Web"]', true, '["Powerful","Accurate","Safe"]'),
('openai-gpt4', 'GPT-4', 'Latest OpenAI model', 'AI Chatbots', 'ai-chatbots', 9.1, true, 0.03, 'openai', 'gpt-4 openai', '["API","Web","ChatGPT Plus"]', true, '["Most Powerful","Accurate","Expensive"]'),
('copilot-pro', 'Copilot Pro', 'Microsoft advanced AI', 'AI Chatbots', 'ai-chatbots', 8.4, true, 20, NULL, 'copilot pro microsoft', '["Web","Office"]', true, '["Microsoft Integration","Productive"]'),
('poe-quora', 'Poe', 'All chatbots in one app', 'AI Chatbots', 'ai-chatbots', 8.3, true, 20, NULL, 'poe quora', '["Web","iOS","Android"]', false, '["All Models","Comparison"]'),
('writersonic', 'Writersonic', 'AI writing assistant', 'AI Chatbots', 'ai-chatbots', 8.2, true, 20, 'awin', 'writersonic ai', '["Web","Chrome"]', false, '["Writing","SEO","Marketing"]'),
('jasper-ai', 'Jasper', 'AI copywriting tool', 'AI Chatbots', 'ai-chatbots', 8.4, true, 49, 'awin', 'jasper ai', '["Web","API"]', false, '["Marketing","Sales","Content"]'),
('copy-dot-ai', 'Copy.ai', 'Marketing copy generator', 'AI Chatbots', 'ai-chatbots', 8.1, true, 49, 'awin', 'copy.ai marketing', '["Web"]', false, '["Marketing","Budget","Easy"]'),
('neeva-ai', 'Neeva AI', 'Privacy-first AI search', 'AI Chatbots', 'ai-chatbots', 7.9, true, 19.99, NULL, 'neeva search', '["Web"]', false, '["Privacy","Ad-Free","Premium"]'),
('xi-ai', 'Xi AI', 'Startup AI assistant', 'AI Chatbots', 'ai-chatbots', 8.0, true, 0, NULL, 'xi ai assistant', '["Web"]', false, '["Startup Friendly","Free"]');

-- Password Managers (18 new tools)
INSERT INTO public.software (slug, name, tagline, category, category_slug, trust_score, has_free_tier, starting_price, affiliate_network, reddit_search_term, platforms, is_trending, best_for_tags) VALUES
('1password', '1Password', 'Premium password manager', 'Password Managers', 'password-managers', 9.2, false, 2.99, 'awin,shareasale', '1password manager', '["Windows","macOS","Linux","iOS","Android"]', false, '["Premium","Secure","Family"]'),
('bitwarden', 'Bitwarden', 'Open-source password manager', 'Password Managers', 'password-managers', 9.1, true, 0, 'awin', 'bitwarden', '["Windows","macOS","Linux","iOS","Android","Browser"]', true, '["Open Source","Free","Self-Hosted"]'),
('lastpass', 'LastPass', 'Cloud-based password manager', 'Password Managers', 'password-managers', 8.7, true, 2.99, 'awin,shareasale', 'lastpass', '["Windows","macOS","iOS","Android","Browser"]', false, '["Cloud","Popular","Affordable"]'),
('keepass', 'KeePass', 'Desktop password manager', 'Password Managers', 'password-managers', 9.0, true, 0, NULL, 'keepass password', '["Windows","macOS","Linux","Portable"]', false, '["Open Source","Local","Portable"]'),
('dashlane', 'Dashlane', 'Secure password & identity', 'Password Managers', 'password-managers', 8.9, true, 4.99, 'awin,shareasale', 'dashlane password', '["Windows","macOS","iOS","Android","Browser"]', false, '["Identity Protection","VPN","Secure"]'),
('nordpass', 'NordPass', 'By creators of NordVPN', 'Password Managers', 'password-managers', 8.8, true, 2.99, 'awin', 'nordpass', '["Windows","macOS","iOS","Android","Browser"]', true, '["Fast","Secure","Affordable"]'),
('enpass', 'Enpass', 'Offline password manager', 'Password Managers', 'password-managers', 8.6, true, 9.99, 'awin', 'enpass password', '["Windows","macOS","Linux","iOS","Android"]', false, '["Offline","Secure","One-Time"]'),
('sticky-password', 'Sticky Password', 'Encrypted password storage', 'Password Managers', 'password-managers', 8.5, false, 29.99, 'awin', 'sticky password', '["Windows","macOS","iOS","Android"]', false, '["Encryption","Secure","Affordable"]'),
('roboform', 'RoboForm', 'Password manager with forms', 'Password Managers', 'password-managers', 8.4, true, 9.99, 'awin', 'roboform password', '["Windows","macOS","iOS","Android","Browser"]', false, '["Forms","AutoFill","Beginner"]'),
('password-boss', 'Password Boss', 'Family password manager', 'Password Managers', 'password-managers', 8.3, true, 2.99, 'awin', 'password boss', '["Windows","macOS","iOS","Android"]', false, '["Family","Affordable","Easy"]'),
('zoho-vault', 'Zoho Vault', 'Enterprise password manager', 'Password Managers', 'password-managers', 8.6, false, 25, 'awin', 'zoho vault', '["Web","iOS","Android","Windows","macOS"]', false, '["Enterprise","Business","Affordable"]'),
('passpack', 'Passpack', 'Team password manager', 'Password Managers', 'password-managers', 8.5, true, 18, 'awin', 'passpack teams', '["Web","iOS","Android"]', false, '["Teams","Collaboration","Secure"]'),
('advanced-password-generator', 'Advanced Password Generator', 'Secure password creation', 'Password Managers', 'password-managers', 8.0, true, 0, NULL, 'password generator', '["Web","Chrome"]', false, '["Free","Simple"]'),
('privacy-pass', 'Privacy Pass', 'Browser privacy tool', 'Password Managers', 'password-managers', 8.2, true, 0, NULL, 'privacy pass browser', '["Browser"]', false, '["Privacy","Free","Browser"]'),
('lesspass', 'LessPass', 'Stateless password manager', 'Password Managers', 'password-managers', 8.1, true, 0, NULL, 'lesspass stateless', '["Web","Browser","Mobile"]', false, '["Open Source","Stateless"]'),
('sync-dot-com', 'Sync.com', 'Cloud with password manager', 'Password Managers', 'password-managers', 8.4, true, 8, 'awin', 'sync.com', '["Web","Desktop","Mobile"]', false, '["Cloud Storage","Security"]'),
('tresorit', 'Tresorit', 'Swiss encrypted cloud', 'Password Managers', 'password-managers', 8.5, false, 7.50, 'awin', 'tresorit cloud', '["Web","Desktop","Mobile"]', false, '["Encryption","Privacy","Swiss"]'),
('blur-abine', 'Blur', 'Privacy protection suite', 'Password Managers', 'password-managers', 8.3, true, 4.99, 'awin', 'blur privacy abine', '["Browser","Mobile","Web"]', false, '["Privacy","Masks","Easy"]');

-- Design Tools (15 new tools)
INSERT INTO public.software (slug, name, tagline, category, category_slug, trust_score, has_free_tier, starting_price, affiliate_network, reddit_search_term, platforms, is_trending, best_for_tags) VALUES
('canva', 'Canva', 'Design tool for everyone', 'Design Tools', 'design-tools', 9.0, true, 12.99, 'awin,shareasale', 'canva design', '["Web","iOS","Android","macOS","Windows"]', false, '["Beginner Friendly","Templates","Social"]'),
('adobe-xd', 'Adobe XD', 'UI/UX design software', 'Design Tools', 'design-tools', 9.1, true, 9.99, 'awin', 'adobe xd', '["macOS","Windows","Web"]', false, '["Professional","Prototyping","Teams"]'),
('sketch', 'Sketch', 'macOS UI design tool', 'Design Tools', 'design-tools', 9.2, false, 12.99, 'awin', 'sketch design mac', '["macOS","Web"]', false, '["Professional","macOS","UI/UX"]'),
('invision', 'InVision', 'Prototyping and collaboration', 'Design Tools', 'design-tools', 8.8, true, 12.50, 'awin', 'invision prototyping', '["Web","iOS","Android"]', false, '["Prototyping","Collaboration","Teams"]'),
('framer', 'Framer', 'Interactive component design', 'Design Tools', 'design-tools', 8.7, true, 0, 'awin', 'framer react', '["Web","Mac']', true, '["React","Interactive","Developers"]'),
('penpot', 'Penpot', 'Open-source design tool', 'Design Tools', 'design-tools', 8.5, true, 0, NULL, 'penpot design', '["Web","Self-Hosted"]', true, '["Open Source","Free","Collaboration"]'),
('gravit-designer', 'Gravit Designer', 'Free vector design tool', 'Design Tools', 'design-tools', 8.6, true, 0, 'awin', 'gravit designer', '["Web","Desktop","iOS"]', false, '["Free","Vector","Cross-Platform"]'),
('lunacy', 'Lunacy', 'Free UI design software', 'Design Tools', 'design-tools', 8.4, true, 0, NULL, 'lunacy design', '["Windows","macOS","Web","Linux"]', true, '["Free","UI Design","Figma Compatible"]'),
('pixlr', 'Pixlr', 'Online photo editor', 'Design Tools', 'design-tools', 8.3, true, 9.99, 'awin', 'pixlr editor', '["Web","iOS","Android"]', false, '["Photo Editing","Easy","Templates"]'),
('affinity-photo', 'Affinity Photo', 'Professional photo editing', 'Design Tools', 'design-tools', 9.0, false, 69.99, 'awin', 'affinity photo', '["macOS","Windows","iPad"]', false, '["Professional","Photo","One-Time"]'),
('affinity-designer', 'Affinity Designer', 'Professional vector design', 'Design Tools', 'design-tools', 9.1, false, 69.99, 'awin', 'affinity designer', '["macOS","Windows","iPad"]', false, '["Professional","Vector","One-Time"]'),
('figma-plugins', 'Figma + Plugins', 'Extended Figma ecosystem', 'Design Tools', 'design-tools', 8.9, true, 12, 'awin', 'figma plugins', '["Web"]', true, '["Plugins","Ecosystem","Productivity"]'),
('mockflow', 'MockFlow', 'UI mockups and wireframes', 'Design Tools', 'design-tools', 8.2, true, 7, 'awin', 'mockflow ui', '["Web"]', false, '["Wireframes","Mockups","Affordable"]'),
('balsamiq', 'Balsamiq', 'Low-fidelity wireframing', 'Design Tools', 'design-tools', 8.5, true, 5, 'awin', 'balsamiq wireframes', '["Web","Desktop"]', false, '["Wireframes","Rapid","Affordable"]'),
('webflow', 'Webflow', 'Design and code together', 'Design Tools', 'design-tools', 8.8, true, 14, 'awin,shareasale', 'webflow', '["Web"]', true, '["Web Design","CMS","No-Code"]');

-- Project Management (18 new tools)
INSERT INTO public.software (slug, name, tagline, category, category_slug, trust_score, has_free_tier, starting_price, affiliate_network, reddit_search_term, platforms, is_trending, best_for_tags) VALUES
('asana', 'Asana', 'Team project and task management', 'Project Management', 'project-management', 8.9, true, 10.99, 'awin,shareasale', 'asana project', '["Web","iOS","Android"]', false, '["Teams","Tasks","Timeline"]'),
('monday-dot-com', 'Monday.com', 'Visual project management', 'Project Management', 'project-management', 8.8, true, 9, 'awin,shareasale', 'monday.com', '["Web","iOS","Android"]', true, '["Visual","Customizable","Teams"]'),
('trello', 'Trello', 'Kanban board tool', 'Project Management', 'project-management', 8.7, true, 5, 'awin,shareasale', 'trello kanban', '["Web","iOS","Android"]', false, '["Simple","Kanban","Affordable"]'),
('jira-cloud', 'Jira Cloud', 'Agile project management', 'Project Management', 'project-management', 8.9, false, 8.50, 'awin', 'jira agile', '["Web","iOS","Android"]', false, '["Agile","Development","Enterprise"]'),
('linear', 'Linear', 'Modern issue tracking', 'Project Management', 'project-management', 8.8, false, 10, NULL, 'linear issue tracker', '["Web"]', true, '["Development","Fast","Teams"]'),
('clickup', 'ClickUp', 'All-in-one project platform', 'Project Management', 'project-management', 8.7, true, 5, 'awin', 'clickup platform', '["Web","iOS","Android"]', true, '["All-in-One","Customizable","Affordable"]'),
('smartsheet', 'Smartsheet', 'Enterprise project management', 'Project Management', 'project-management', 8.6, false, 14, 'awin', 'smartsheet', '["Web","iOS","Android"]', false, '["Enterprise","Gantt","Collaboration"]'),
('wrike', 'Wrike', 'Professional project management', 'Project Management', 'project-management', 8.7, true, 9.80, 'awin', 'wrike management', '["Web","iOS","Android"]', false, '["Professional","Teams","Reporting"]'),
('basecamp', 'Basecamp', 'Simple project management', 'Project Management', 'project-management', 8.5, false, 99, 'awin', 'basecamp project', '["Web","iOS","Android"]', false, '["Simple","Affordable","Small Teams"]'),
('freedcamp', 'FreedCamp', 'Free project management', 'Project Management', 'project-management', 8.1, true, 0, NULL, 'freedcamp', '["Web","iOS","Android"]', false, '["Free","All-in-One","Simple"]'),
('taiga', 'Taiga', 'Agile open-source platform', 'Project Management', 'project-management', 8.3, true, 0, NULL, 'taiga agile', '["Web","Self-Hosted"]', false, '["Open Source","Agile","Free"]'),
('plane-sh', 'Plane', 'Modern issue tracking alternative', 'Project Management', 'project-management', 8.4, true, 0, NULL, 'plane issue', '["Web","Self-Hosted"]', true, '["Open Source","Jira Alternative"]'),
('gantt-project', 'GanttProject', 'Gantt chart tool', 'Project Management', 'project-management', 8.0, true, 0, NULL, 'ganttproject', '["Desktop","Web"]', false, '["Gantt Charts","Open Source","Free"]'),
('leantime', 'Leantime', 'Open-source PM software', 'Project Management', 'project-management', 8.2, true, 0, NULL, 'leantime', '["Web","Self-Hosted"]', false, '["Open Source","Self-Hosted"]'),
('nifty', 'Nifty', 'Team collaboration platform', 'Project Management', 'project-management', 8.4, true, 8.50, 'awin', 'nifty collaboration', '["Web","iOS","Android"]', false, '["Team Friendly","Affordable"]'),
('citrix-sharepoint', 'Citrix + SharePoint', 'Microsoft PM integration', 'Project Management', 'project-management', 8.3, false, 6, 'awin', 'microsoft teams projects', '["Web","Desktop"]', false, '["Microsoft','Enterprise"]'),
('notion-templates', 'Notion Templates', 'Notion for project management', 'Project Management', 'project-management', 8.6, true, 10, 'awin', 'notion project templates', '["Web"]', false, '["Flexible","Community']'),
('ayoa', 'Ayoa', 'Mind mapping and project management', 'Project Management', 'project-management', 8.3, true, 4.99, 'awin', 'ayoa mind mapping', '["Web","Mobile","Desktop"]', false, '["Mind Mapping","Creative","Affordable"]');

-- Code Editors (15 new tools)
INSERT INTO public.software (slug, name, tagline, category, category_slug, trust_score, has_free_tier, starting_price, affiliate_network, reddit_search_term, platforms, is_trending, best_for_tags) VALUES
('sublime-text', 'Sublime Text', 'Lightweight text editor', 'Code Editors', 'code-editors', 9.0, true, 99, 'awin', 'sublime text', '["Windows","macOS","Linux"]', false, '["Fast","Lightweight","Professional"]'),
('jetbrains-webstorm', 'WebStorm', 'JavaScript IDE', 'Code Editors', 'code-editors', 9.1, false, 59, 'awin', 'webstorm jetbrains', '["Windows","macOS","Linux"]', false, '["Professional","JavaScript","Full IDE"]'),
('jetbrains-pycharm', 'PyCharm', 'Python IDE', 'Code Editors', 'code-editors', 9.2, true, 59, 'awin', 'pycharm python', '["Windows","macOS","Linux"]', false, '["Professional","Python","Full IDE"]'),
('jetbrains-intellij', 'IntelliJ IDEA', 'Java IDE', 'Code Editors', 'code-editors', 9.2, true, 59, 'awin', 'intellij idea java', '["Windows","macOS","Linux"]', false, '["Professional','Java","Enterprise"]'),
('vim', 'Vim', 'Highly configurable editor', 'Code Editors', 'code-editors', 9.1, true, 0, NULL, 'vim editor', '["Unix/Linux","macOS","Windows"]', false, '["Keyboard","Powerful","Steep Learning"]'),
('neovim', 'Neovim', 'Modern Vim fork', 'Code Editors', 'code-editors', 8.9, true, 0, NULL, 'neovim editor', '["Unix/Linux","macOS","Windows"]', true, '["Modern','Extensible","Keyboard"]'),
('emacs', 'Emacs', 'Extensible text editor', 'Code Editors', 'code-editors', 8.8, true, 0, NULL, 'emacs editor', '["Unix/Linux","macOS","Windows"]', false, '["Extensible","Powerful","Steep Learning"]'),
('atom', 'Atom', 'Hackable text editor', 'Code Editors', 'code-editors', 8.5, true, 0, 'awin', 'atom editor', '["Windows","macOS","Linux"]', false, '["Hackable","Community","JavaScript"]'),
('zed', 'Zed', 'High-performance editor', 'Code Editors', 'code-editors', 8.7, true, 0, NULL, 'zed editor', '["macOS","Linux"]', true, '["Fast","Collaborative","Modern"]'),
('helix', 'Helix', 'Kakoune-inspired editor', 'Code Editors', 'code-editors', 8.6, true, 0, NULL, 'helix editor rust', '["Linux","macOS","Windows"]', true, '["Modern","Rust","Terminal"]'),
('micro', 'Micro', 'Modern terminal editor', 'Code Editors', 'code-editors', 8.4, true, 0, NULL, 'micro editor', '["Linux","macOS","Windows"]', false, '["Terminal","Simple","Beginner"]'),
('nano', 'Nano', 'Simple terminal editor', 'Code Editors', 'code-editors', 8.2, true, 0, NULL, 'nano editor', '["Linux","macOS','Unix"]', false, '["Simple","Beginner","Terminal"]'),
('geany', 'Geany', 'Lightweight IDE', 'Code Editors', 'code-editors', 8.3, true, 0, NULL, 'geany editor', '["Windows","macOS","Linux"]', false, '["Lightweight","IDE","Open Source"]'),
('codeblocks', 'Code::Blocks', 'C/C++ IDE', 'Code Editors', 'code-editors', 8.1, true, 0, NULL, 'codeblocks ide', '["Windows","macOS","Linux"]', false, '["C/C++","Open Source','Free"]'),
('theia', 'Theia', 'Open IDE framework', 'Code Editors', 'code-editors', 8.4, true, 0, NULL, 'theia ide', '["Cloud","Desktop","Browser"]', true, '["Open Source","Cloud Native","Extensible"]');

-- AI Image Generators (15 new tools)
INSERT INTO public.software (slug, name, tagline, category, category_slug, trust_score, has_free_tier, starting_price, affiliate_network, reddit_search_term, platforms, is_trending, best_for_tags) VALUES
('dall-e-3', 'DALL-E 3', 'OpenAI image generation', 'AI Image Generators', 'ai-image-generators', 9.0, false, 0.020, NULL, 'dall-e 3', '["Web","API"]', true, '["Most Realistic','OpenAI","Detailed"]'),
('midjourney', 'Midjourney', 'AI art generator', 'AI Image Generators', 'ai-image-generators', 9.1, false, 10, NULL, 'midjourney', '["Discord','Web"]', true, '["Artistic","Community","High Quality"]'),
('stable-diffusion', 'Stable Diffusion', 'Open-source image AI', 'AI Image Generators', 'ai-image-generators', 8.7, true, 0, NULL, 'stable diffusion', '["Web","Local","API"]', true, '["Open Source","Free","Customizable"]'),
('adobe-firefly', 'Adobe Firefly', 'Built into Creative Suite', 'AI Image Generators', 'ai-image-generators', 8.8, true, 0, 'awin', 'adobe firefly', '["Web","Photoshop","Illustrator"]', true, '["Professional","Creative Suite","Generative"]'),
('microsoft-designer', 'Microsoft Designer', 'Bing Image Creator', 'AI Image Generators', 'ai-image-generators', 8.4, true, 0, NULL, 'microsoft designer bing', '["Web"]', true, '["Free","Integrated","Simple"]'),
('leonardo-ai', 'Leonardo.AI', 'Fast image generation', 'AI Image Generators', 'ai-image-generators', 8.6, true, 7.99, NULL, 'leonardo.ai', '["Web"]', true, '["Fast","Affordable","Creative"]'),
('imagine-api', 'Imagine by Magic', 'Creative image generation', 'AI Image Generators', 'ai-image-generators', 8.3, true, 0, NULL, 'imagine api', '["Web","API"]', false, '["Creative","API","Free Tier"]'),
('nightcafe', 'NightCafe', 'Multiple AI engines', 'AI Image Generators', 'ai-image-generators', 8.5, true, 0, NULL, 'nightcafe studio', '["Web"]', true, '["Multiple Models","Community","Free"]'),
('artbreeder', 'Artbreeder', 'Collaborative art creation', 'AI Image Generators', 'ai-image-generators', 8.2, true, 9.99, NULL, 'artbreeder', '["Web"]', false, '["Collaborative","Creative","Community"]'),
('craiyon', 'Craiyon', 'Free AI art (formerly DALL-E mini)', 'AI Image Generators', 'ai-image-generators', 8.1, true, 5, NULL, 'craiyon', '["Web"]', true, '["Free","Easy","Quick"]'),
('syntesia', 'Synthesia', 'AI video generation', 'AI Image Generators', 'ai-image-generators', 8.4, true, 23, 'awin', 'synthesia video', '["Web"]', true, '["Video","Avatar","Professional"]'),
('runway-ml', 'Runway ML', 'Creative AI suite', 'AI Image Generators', 'ai-image-generators', 8.7, true, 12, 'awin', 'runway ml', '["Web","Desktop"]', true, '["Video","Image","Professional"]'),
('clipdrop', 'Clipdrop', 'AI image editing tools', 'AI Image Generators', 'ai-image-generators', 8.3, true, 0, NULL, 'clipdrop', '["Web','App"]', true, '["Editing","Fast","Easy"]'),
('upscayl', 'Upscayl', 'Open-source upscaling', 'AI Image Generators', 'ai-image-generators', 8.2, true, 0, NULL, 'upscayl', '["Desktop"]', true, '["Upscaling","Open Source","Free"]'),
('pollinations', 'Pollinations.AI', 'Community AI models', 'AI Image Generators', 'ai-image-generators', 8.0, true, 0, NULL, 'pollinations ai', '["Web","API"]', false, '["Community","Free","API"]');

-- Email Marketing (15 new tools)
INSERT INTO public.software (slug, name, tagline, category, category_slug, trust_score, has_free_tier, starting_price, affiliate_network, reddit_search_term, platforms, is_trending, best_for_tags) VALUES
('mailchimp', 'Mailchimp', 'Email marketing for all', 'Email Marketing', 'email-marketing', 8.8, true, 0, 'awin,shareasale', 'mailchimp email', '["Web","Mobile"]', false, '["Beginner Friendly","Free Tier","Popular"]'),
('brevo', 'Brevo (Sendinblue)', 'All-in-one marketing', 'Email Marketing', 'email-marketing', 8.7, true, 0, 'awin', 'brevo email', '["Web"]', false, '["SMS","Affordable","All-in-One"]'),
('convertkit', 'ConvertKit', 'For creators and bloggers', 'Email Marketing', 'email-marketing', 8.9, false, 25, 'awin,shareasale', 'convertkit', '["Web","Mobile"]', true, '["Creators","Beautiful","Email-focused"]'),
('activecampaign', 'ActiveCampaign', 'Customer experience', 'Email Marketing', 'email-marketing', 8.8, false, 9, 'awin', 'activecampaign', '["Web","Mobile"]', false, '["Automation","CRM","Professional"]'),
('klaviyo', 'Klaviyo', 'E-commerce email marketing', 'Email Marketing', 'email-marketing', 8.9, true, 20, 'awin,shareasale', 'klaviyo', '["Web"]', true, '["E-commerce","Segmentation","Powerful"]'),
('getresponse', 'GetResponse', 'Complete marketing platform', 'Email Marketing', 'email-marketing', 8.6, true, 15, 'awin,shareasale', 'getresponse', '["Web","Mobile"]', false, '["All-in-One","Affordable","Webinars"]'),
('constant-contact', 'Constant Contact', 'Email and social media', 'Email Marketing', 'email-marketing', 8.5, true, 20, 'awin', 'constant contact', '["Web","Mobile"]', false, '["Social Media","Easy','Email"]'),
('campaign-monitor', 'Campaign Monitor', 'Beautiful email campaigns', 'Email Marketing', 'email-marketing', 8.7, true, 25, 'awin', 'campaign monitor', '["Web"]', false, '["Templates","Beautiful","Designer Friendly"]'),
('sendspark', 'SendSpark', 'Video email marketing', 'Email Marketing', 'email-marketing', 8.4, true, 9, 'awin', 'sendspark video', '["Web"]', true, '["Video","Personalized","Engagement"]'),
('substack', 'Substack', 'Newsletter platform', 'Email Marketing', 'email-marketing', 8.6, true, 0, NULL, 'substack', '["Web","Mobile"]', true, '["Newsletters","Simple","Creator Friendly"]'),
('beehiiv', 'Beehiiv', 'Newsletter creation', 'Email Marketing', 'email-marketing', 8.7, true, 0, NULL, 'beehiiv newsletter', '["Web']', true, '["Newsletter","Creator Friendly","Analytics"]'),
('Ghost', 'Ghost', 'Platform for creators', 'Email Marketing', 'email-marketing', 8.5, true, 0, NULL, 'ghost platform', '["Web","Self-Hosted"]', false, '["Newsletter","Membership","Open Source"]'),
('lemlist', 'Lemlist', 'Personalized cold email', 'Email Marketing', 'email-marketing', 8.6, true, 25, 'awin', 'lemlist cold email', '["Web"]', false, '["Personalization","Cold Email","Outreach"]'),
('instantly', 'Instantly', 'Cold email automation', 'Email Marketing', 'email-marketing', 8.5, true, 20, NULL, 'instantly.ai', '["Web"]', true, '["Cold Email","Automation","Affordable"]'),
('woodpecker', 'Woodpecker', 'B2B email sequences', 'Email Marketing', 'email-marketing', 8.4, false, 40, 'awin', 'woodpecker email', '["Web"]', false, '["B2B","Sequences","Professional"]');

-- Cloud Storage (15 new tools)
INSERT INTO public.software (slug, name, tagline, category, category_slug, trust_score, has_free_tier, starting_price, affiliate_network, reddit_search_term, platforms, is_trending, best_for_tags) VALUES
('google-drive', 'Google Drive', 'Cloud storage from Google', 'Cloud Storage', 'cloud-storage', 9.0, true, 1.99, 'awin', 'google drive', '["Web","iOS","Android","Windows','macOS"]', false, '["Integration","Free Tier","Popular"]'),
('dropbox', 'Dropbox', 'File sync and collaboration', 'Cloud Storage', 'cloud-storage', 8.9, true, 11.99, 'awin,shareasale', 'dropbox', '["Web","iOS","Android","Windows","macOS"]', false, '["Sync","Collaboration","Reliable"]'),
('microsoft-onedrive', 'OneDrive', 'Microsoft cloud storage', 'Cloud Storage', 'cloud-storage', 8.8, true, 2, 'awin', 'microsoft onedrive', '["Web","iOS","Android","Windows","macOS"]', false, '["Microsoft','Integration","Office"]'),
('icloud', 'iCloud', 'Apple cloud storage', 'Cloud Storage', 'cloud-storage', 8.7, true, 0.99, NULL, 'icloud storage', '["iOS","macOS","Web"]', false, '["Apple Integration","Seamless"]'),
('sync-dot-com', 'Sync.com', 'End-to-end encrypted', 'Cloud Storage', 'cloud-storage', 8.8, true, 8, 'awin', 'sync.com', '["Web","Desktop","Mobile"]', true, '["Encryption","Private","Swiss"]'),
('tresorit', 'Tresorit', 'Ultra-secure cloud', 'Cloud Storage', 'cloud-storage', 8.9, false, 7.50, 'awin', 'tresorit', '["Web","Desktop","Mobile"]', true, '["Encryption","Security","Swiss"]'),
('nextcloud', 'Nextcloud', 'Self-hosted file sync', 'Cloud Storage', 'cloud-storage', 8.6, true, 0, NULL, 'nextcloud', '["Self-Hosted","Web","Mobile"]', true, '["Open Source","Privacy","Self-Hosted"]'),
('owncloud', 'ownCloud', 'Self-hosted content', 'Cloud Storage', 'cloud-storage', 8.5, true, 0, NULL, 'owncloud', '["Self-Hosted","Web","Mobile"]', false, '["Open Source","Private","Self-Hosted"]'),
('proton-drive', 'Proton Drive', 'From ProtonMail creators', 'Cloud Storage', 'cloud-storage', 8.7, true, 4.99, NULL, 'proton drive', '["Web","iOS","Android"]', true, '["Encryption","Privacy","Email Integration"]'),
('mega', 'MEGA', 'Free cloud storage', 'Cloud Storage', 'cloud-storage', 8.3, true, 4.99, 'awin', 'mega cloud', '["Web","Desktop","Mobile"]', false, '["Free Tier","Encryption","Generous"]'),
('mediafire', 'MediaFire', 'Cloud storage and sharing', 'Cloud Storage', 'cloud-storage', 8.2, true, 7.49, 'awin', 'mediafire', '["Web","Desktop","Mobile"]', false, '["Sharing","Affordable","Simple"]'),
('pcloud', 'pCloud', 'European cloud storage', 'Cloud Storage', 'cloud-storage', 8.5, true, 4.99, 'awin', 'pcloud', '["Web","Desktop","Mobile"]', false, '["European","Encryption","Lifetime"]'),
('amazon-s3', 'Amazon S3', 'Enterprise cloud storage', 'Cloud Storage', 'cloud-storage', 9.1, false, 0.023, 'awin', 'amazon s3', '["API","Web"]', false, '["Enterprise","Scalable","Reliable"]'),
('backblaze', 'Backblaze', 'Cloud backup service', 'Cloud Storage', 'cloud-storage', 8.6, false, 7, 'awin', 'backblaze backup', '["Desktop","Web"]', false, '["Backup","Unlimited","Reliable"]'),
('mozy', 'Mozy', 'EMC backup service', 'Cloud Storage', 'cloud-storage', 8.4, true, 7, 'awin', 'mozy backup', '["Desktop','Web"]', false, '["Backup","Cloud","Affordable"]');

-- Antivirus (15 new tools)
INSERT INTO public.software (slug, name, tagline, category, category_slug, trust_score, has_free_tier, starting_price, affiliate_network, reddit_search_term, platforms, is_trending, best_for_tags) VALUES
('norton-360', 'Norton 360', 'Comprehensive protection', 'Antivirus', 'antivirus', 8.8, true, 29.99, 'awin,shareasale', 'norton 360', '["Windows","macOS","iOS","Android"]', false, '["Comprehensive","VPN","Firewall"]'),
('mcafee', 'McAfee', 'Total protection', 'Antivirus', 'antivirus', 8.6, true, 29.99, 'awin,shareasale', 'mcafee antivirus', '["Windows","macOS","iOS","Android"]', false, '["Comprehensive","Support","Removal Tool"]'),
('kaspersky', 'Kaspersky', 'Advanced protection', 'Antivirus', 'antivirus', 8.9, false, 19.99, 'awin', 'kaspersky internet', '["Windows","macOS","iOS","Android"]', false, '["Advanced","Effective","Reputation"]'),
('bitdefender', 'Bitdefender', 'Lightweight antivirus', 'Antivirus', 'antivirus', 9.0, true, 19.99, 'awin,shareasale', 'bitdefender', '["Windows","macOS","iOS","Android"]', true, '["Lightweight","Effective","Performance"]'),
('trend-micro', 'Trend Micro', 'Maximum security', 'Antivirus', 'antivirus', 8.8, false, 24.99, 'awin', 'trend micro', '["Windows","macOS","iOS","Android"]', false, '["Maximum','Security","Features"]'),
('windows-defender', 'Windows Defender', 'Built into Windows', 'Antivirus', 'antivirus', 8.5, true, 0, NULL, 'windows defender', '["Windows"]', false, '["Free","Built-In","Sufficient"]'),
('avast', 'Avast', 'Popular free antivirus', 'Antivirus', 'antivirus', 8.3, true, 1.99, 'awin,shareasale', 'avast antivirus', '["Windows","macOS","iOS","Android"]', false, '["Free Tier","Popular","Community"]'),
('avg', 'AVG', 'Antivirus with extras', 'Antivirus', 'antivirus', 8.4, true, 4.99, 'awin', 'avg antivirus', '["Windows","macOS","iOS","Android"]', false, '["Free Tier","Bundled','Affordable"]'),
('avira', 'Avira', 'Privacy-focused antivirus', 'Antivirus', 'antivirus', 8.5, true, 3.99, 'awin', 'avira antivirus', '["Windows","macOS","iOS","Android"]', false, '["Privacy","VPN","Affordable"]'),
('sophos-home', 'Sophos Home', 'Endpoint protection', 'Antivirus', 'antivirus', 8.7, true, 0, NULL, 'sophos home', '["Windows","macOS","iOS","Android"]', false, '["Free","Enterprise Class"]'),
('malwarebytes', 'Malwarebytes', 'Malware removal specialist', 'Antivirus', 'antivirus', 8.8, true, 3.33, 'awin,shareasale', 'malwarebytes', '["Windows","macOS","iOS","Android"]', false, '["Effective","Malware Focus","Affordable"]'),
('g-data', 'G DATA', 'German security software', 'Antivirus', 'antivirus', 8.6, false, 19.99, 'awin', 'g data antivirus', '["Windows","macOS"]', false, '["German","Dual Engine","Secure"]'),
('webroot', 'Webroot', 'Lightweight cloud antivirus', 'Antivirus', 'antivirus', 8.4, false, 29.99, 'awin', 'webroot antivirus', '["Windows","macOS","iOS","Android"]', false, '["Lightweight","Cloud","Fast"]'),
('panda-dome', 'Panda Dome', 'Comprehensive protection', 'Antivirus', 'antivirus', 8.5, true, 23.99, 'awin', 'panda dome', '["Windows","macOS","iOS","Android"]', false, '["Comprehensive","Spanish","Features"]'),
('k7-total-security', 'K7 Total Security', 'Indian antivirus', 'Antivirus', 'antivirus', 8.3, false, 9.99, 'awin', 'k7 total security', '["Windows","macOS"]', false, '["Affordable","Indian","Effective"]');

-- Verify counts
SELECT category, COUNT(*) as tool_count FROM public.software GROUP BY category ORDER BY category;
