# Pizza Pantry - Inventory Management System

A modern, animated inventory management web application built with Next.js 15, featuring a clean UI, smooth interactions, and responsive layouts. The interface includes subtle micro-animations for buttons, form transitions, modal openings, and page loading states.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Storage:** LocalStorage (Frontend-only)
- **Validation:** Zod

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pizza-pantry-web
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
pizza-pantry-web/
├── app/
│   ├── page.tsx              # Modern landing page
│   ├── inventory/
│   │   └── page.tsx          # Main inventory page
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── forms/
│   │   └── ItemForm.tsx      # Add/Edit item form
│   ├── inventory/
│   │   └── AdjustQuantityModal.tsx
│   └── ui/
│       ├── empty-state.tsx
│       ├── table.tsx
│       ├── modal.tsx
│       └── button.tsx
├── docs/
│   └── ai-usage/             # AI usage disclosure
├── lib/
│   ├── validations.ts        # Zod validation schemas
│   └── utils.ts              # Utility functions
└── types/
    └── inventory.ts          # TypeScript type definitions
```

## 🎨 Design Philosophy

This project uses a modern, animated front-end design focused on:

- **Clean UI:** Minimal, intuitive interface with clear visual hierarchy
- **Smooth Interactions:** Subtle micro-animations for enhanced user experience
- **Responsive Layouts:** Mobile-first approach ensuring usability across all devices
- **Performance:** Lightweight animations using Framer Motion for optimal performance
- **Accessibility:** ARIA labels, keyboard navigation, and screen reader support
- **Modern Aesthetics:** Dark theme with golden accents inspired by premium pizza branding

### Animation Strategy

- Button hover and click states
- Form field transitions
- Modal opening/closing animations
- Page loading states
- Table row interactions
- Landing page hero animations

## 🔧 Key Features

- **Modern Landing Page:** Beautiful, animated homepage with pizzafly-inspired design
- **Inventory Management:** Add, edit, and delete items
- **Quantity Adjustments:** Adjust item quantities with reason tracking
- **Local Storage:** All data persists in browser localStorage
- **Filtering & Sorting:** Search, category filter, sortable columns
- **Real-time Updates:** Instant UI updates with smooth animations
- **Form Validation:** Client-side validation using Zod schemas
- **Responsive Design:** Works seamlessly on desktop, tablet, and mobile
- **Accessibility:** WCAG-compliant with keyboard navigation support

## 📝 Design Decisions & Trade-offs

### 1. Next.js 15 App Router

**Decision:** Use Next.js 15 with App Router instead of Pages Router.

**Rationale:**
- Modern React Server Components support
- Better performance with automatic code splitting
- Improved developer experience with layouts and loading states
- Future-proof architecture

**Trade-offs:**
- Learning curve for developers familiar with Pages Router
- Some third-party libraries may have limited App Router support

### 2. Frontend-Only with LocalStorage

**Decision:** Use localStorage instead of a backend database.

**Rationale:**
- No server setup required
- Fast, instant data access
- Perfect for single-user or demo applications
- No API calls or network latency
- Simple deployment

**Trade-offs:**
- Data is browser-specific (not synced across devices)
- Limited storage capacity (~5-10MB)
- No multi-user support
- **Future Consideration:** Can easily migrate to backend API if needed

### 3. Client-Side Filtering & Sorting

**Decision:** Implement lightweight client-side filtering and sorting for the inventory table.

**Rationale:**
- Fast, responsive user experience without server round-trips
- Works well for moderate dataset sizes
- Reduces complexity (no API endpoints needed)

**Trade-offs:**
- May not scale well for very large datasets (1000+ items)
- All data must be loaded upfront
- **Note:** With localStorage, this is perfectly fine for typical inventory sizes

### 4. Framer Motion for Animations

**Decision:** Use Framer Motion instead of CSS animations or other libraries.

**Rationale:**
- Declarative animation API
- Excellent performance with hardware acceleration
- Easy to implement complex animations
- Good TypeScript support

**Trade-offs:**
- Additional bundle size (~50KB gzipped)
- Learning curve for complex animations
- **Mitigation:** Tree-shaking ensures only used animations are included

### 5. Zod for Validation

**Decision:** Use Zod for client-side validation.

**Rationale:**
- Type-safe validation with TypeScript inference
- Single source of truth for validation rules
- Excellent developer experience
- Clear error messages

**Trade-offs:**
- Slightly larger bundle size compared to simpler validators
- Learning curve for complex schemas

### 6. Dark Theme with Golden Accents

**Decision:** Use a dark theme with yellow/gold accents inspired by premium pizza branding.

**Rationale:**
- Modern, premium aesthetic
- Reduces eye strain
- Stands out from typical light-themed apps
- Matches food/restaurant industry trends

**Trade-offs:**
- May not suit all use cases
- Requires careful color contrast for accessibility

## 🧪 Testing

```bash
# Run linting
npm run lint
```

## 📚 Documentation

- [AI Usage Disclosure](./docs/ai-usage/DISCLOSURE.md)
- [AI Prompts Used](./docs/ai-usage/PROMPTS.md)

## 🎯 Usage

1. **Landing Page:** Visit the homepage to see the modern, animated landing page
2. **Inventory:** Click "Explore Inventory" or navigate to `/inventory`
3. **Add Items:** Click "Add Item" to create new inventory entries
4. **Manage Items:** Edit, adjust quantities, or delete items as needed
5. **Filter & Search:** Use the search bar and category filter to find items quickly
6. **Data Persistence:** All data is automatically saved to localStorage

## 🤝 Contributing

This is an assessment project. For questions or feedback, please refer to the project requirements.

## 📄 License

[Specify your license here]

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- Framer Motion for animation capabilities
- Tailwind CSS for utility-first styling

---

**Note:** This project uses AI tools for front-end development assistance only. See [AI Usage Disclosure](./docs/ai-usage/DISCLOSURE.md) for details.
