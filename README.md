# Plus Minus Next

A simple and effective app for tracking what went well, what could be improved, and next actions using the Plus/Minus/Next methodology.

## Features

- 📝 Track daily reflections with Plus (what went well), Minus (what could be improved), and Next (action items)
- 💾 SQLite database persistence
- 🔄 RESTful API endpoints
- ✨ Clean and responsive UI
- 🗑️ Delete entries
- 📅 Date-based organization

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technology Stack

- [Next.js 14](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## Project Structure

```
plus-minus-next/
├── app/
│   ├── api/                # API routes
│   │   └── entries/        # Entries API endpoints
│   │       ├── route.ts    # GET all, POST
│   │       └── [id]/
│   │           └── route.ts # DELETE
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles
├── lib/
│   └── db.ts               # SQLite database utilities
├── data/                   # SQLite database file
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)