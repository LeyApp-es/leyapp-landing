# LeyApp Landing Page

🚀 **LeyApp** connects foreigners in Spain with verified immigration lawyers who speak their language. 

This repository contains the source code for the static landing page of LeyApp.

## 🔗 Live Demo

Visit the live site: [https://leyapp.es](https://leyapp.es)

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS, JavaScript (No frameworks)
- **Backend (Edge)**: Supabase Edge Functions (Deno) for waitlist email automation
- **Hosting**: Netlify / Vercel (Static serving)

## 🚀 How to Run Locally

Since this is a static website, you can easily run it locally using `npx`.

### Option 1: Using `serve` (Recommended)

```bash
npx serve .
```

### Option 2: Using `http-server`

```bash
npx http-server .
```

Open `http://localhost:3000` (or the port shown) in your browser.

## 🔒 Security Note

This is a public repository. **Do not commit** `.env` files or real API keys.
Environment variables (like `RESEND_API_KEY`) are managed in the Supabase Dashboard.

## 📄 License

Copyright (c) 2026 Ley Application S.L. All rights reserved.
See [LICENSE](LICENSE) for details.
