# SoftwareOS - Next.js 14 Migration

This is your SoftwareOS project migrated from Vite + React + React Router to **Next.js 14 with App Router**.

## ✅ What's Included

- ✨ **All components** - Preserved exactly as they were
- 🔀 **App Router pages** - Migrated from React Router to Next.js 14 App Router
- 🎨 **Tailwind + shadcn/ui** - Fully configured
- 🔐 **Supabase integration** - Ready to connect
- 🤖 **API routes** - Gemini, Groq, OpenRouter endpoints
- 🎯 **All routes preserved**:
  - `/` - Home
  - `/gestures` - Gesture guide
  - `/category/[slug]` - Category pages
  - `/software/[slug]` - Software detail pages
  - `/software/[slug]/shortcuts` - Keyboard shortcuts
  - `/software/[slug]/reviews` - Reviews
  - `/software/[slug]/pricing` - Pricing
  - `/software/[slug]/compare/[competitor]` - Comparisons

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd softwaros-nextjs
npm install
# or
yarn install
# or
bun install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key
```

Get your keys from:
- **Supabase**: https://app.supabase.com
- **Gemini**: https://ai.google.dev
- **Groq**: https://console.groq.com
- **OpenRouter**: https://openrouter.ai

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

### 4. Build for Production

```bash
npm run build
npm run start
```

## 📦 Key Changes from Vite

| Vite | Next.js 14 |
|------|-----------|
| `vite.config.ts` | `next.config.js` |
| `src/main.tsx` | `src/app/layout.tsx` |
| `src/App.tsx` (React Router) | `src/app/page.tsx` + App Router |
| `index.html` | Built-in by Next.js |
| `Link from react-router-dom` | `Link from next/link` |
| `useParams from react-router-dom` | `useParams from next/navigation` |
| API files in `/api` | `src/app/api/[route]/route.ts` |
| Environment: `VITE_` | Environment: `NEXT_PUBLIC_` |

## 📁 Project Structure

```
softwaros-nextjs/
├── src/
│   ├── app/                          # App Router pages
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   ├── not-found.tsx             # 404 page
│   │   ├── gestures/
│   │   ├── category/[slug]/
│   │   ├── software/[slug]/
│   │   └── api/                      # API routes
│   ├── components/                   # All your components
│   │   ├── ui/                       # shadcn components
│   │   ├── NavBar.tsx                # New navbar (no Outlet)
│   │   ├── Providers.tsx             # Context providers
│   │   └── ...                       # All other components
│   ├── hooks/                        # Custom hooks
│   ├── lib/                          # Utilities & types
│   ├── integrations/supabase/        # Supabase client
│   └── globals.css                   # Global styles
├── public/                           # Static files
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🔌 Components That Changed

- **Layout** → Split into `RootLayout` (server) + `NavBar` (client)
- **Seo** → Use Next.js built-in metadata API instead
- All other components remain the same

## 🎯 Next Steps

1. **Update environment variables** with your actual API keys
2. **Test all pages** to ensure routing works correctly
3. **Update metadata** for SEO in individual pages (currently in root layout)
4. **Deploy** - This is fully compatible with Vercel, Netlify, etc.

## 🆘 Troubleshooting

### "Module not found" errors
Make sure all imports use the `@/` alias which maps to `src/`.

### Supabase connection issues
- Verify environment variables are set in `.env.local`
- Check Supabase URL and key are correct
- Ensure Supabase project is active

### API routes not working
- Check that API keys are in `.env.local`
- API routes are at `/api/gemini`, `/api/groq`, `/api/openrouter`
- Make sure `NextRequest` and `NextResponse` are imported from 'next/server'

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase JavaScript](https://supabase.com/docs/reference/javascript)

## ✨ Original Project

Your original Vite project is untouched in:
`c:\Users\LENOVO\Desktop\softwaros-main\softwaros-main`

You can compare both projects or keep using the Vite version if needed.

---

**Migration completed successfully!** 🎉
