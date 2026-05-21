# Curved LED Calculator

Engineering tool for designing curved LED control room displays with authentication, trial management, and analytics.

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://127.0.0.1:5173`

## Deploy to Render.com (Free)

1. Push to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect repo
4. Settings:
   - Build: `npm install && npm run build`
   - Start: `node server/server.js`
   - Add Disk: `/opt/render/project/src/server/db` (1 GB)
5. Set `ADMIN_PASSWORD` env variable
6. Deploy!

See [DEPLOY.md](DEPLOY.md) for detailed instructions.

## Features

- Email-based authentication
- Auto-approved 7-day trials
- Live analytics dashboard
- PDF export with spec sheets
- XML-based user database
