# 🔧 Admin Components Documentation

Admin panel components untuk mengelola chatbot MOXLITE.

## Components

### 1. ChatbotManagementAdmin (Main Page)

File: `chatbot-management.tsx`

Entry point untuk admin panel. Menangani:

- Login/Logout
- Tab navigation
- Session management

**Props:** None
**Features:**

- Password protected
- Session-based authentication
- Multi-tab interface

### 2. KnowledgeBaseManager

File: `KnowledgeBaseManager.tsx`

Interface untuk manage knowledge base entries.

**Props:**

```typescript
interface Props {
  adminToken: string;
}
```

**Features:**

- CRUD operations (Create, Read, Update, Delete)
- Search & filter
- Form validation
- Real-time updates

### 3. ProductManager

File: `ProductManager.tsx`

Interface untuk view dan manage daftar produk.

**Props:**

```typescript
interface Props {
  adminToken: string;
}
```

**Features:**

- View all products
- Filter by series
- Search products
- Statistics display
- Price formatting

### 4. ChatbotSettings

File: `ChatbotSettings.tsx`

Interface untuk konfigurasi chatbot.

**Props:**

```typescript
interface Props {
  adminToken: string;
}
```

**Features:**

- Model selection
- Language settings
- Parameter tuning
- Save to localStorage
- Reset to default

### 5. DashboardStats

File: `DashboardStats.tsx`

Display statistics dan health check.

**Props:**

```typescript
interface Props {
  adminToken: string;
}
```

**Features:**

- KB stats overview
- Category breakdown
- System health check
- Recommendations

### 6. QuickReference

File: `QuickReference.tsx`

Help component dengan tips dan shortcuts

## Styling

File: `AdminPanel.module.css`

CSS modules dengan consistent design:

- Color scheme: Purple gradient (#667eea to #764ba2)
- Responsive layout
- Dark/light mode ready
- Accessibility optimized

## API Integration

### Knowledge Base API

Endpoint: `/api/admin/knowledge-base`

```typescript
// Get all entries
fetch("/api/admin/knowledge-base", {
  headers: { "x-admin-token": token },
});

// Create entry
fetch("/api/admin/knowledge-base", {
  method: "POST",
  headers: {
    "x-admin-token": token,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ category, question, answer, keywords }),
});

// Update entry
fetch("/api/admin/knowledge-base", {
  method: "PUT",
  headers: { "x-admin-token": token },
  body: JSON.stringify({ id, category, question, answer, keywords }),
});

// Delete entry
fetch("/api/admin/knowledge-base", {
  method: "DELETE",
  headers: { "x-admin-token": token },
  body: JSON.stringify({ id }),
});
```

### Auth API

Endpoint: `/api/admin/auth`

```typescript
fetch("/api/admin/auth", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ password }),
});
```

## Customization Guide

### Change Colors

Edit `AdminPanel.module.css`:

```css
/* From */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* To */
background: linear-gradient(135deg, #your_color_1 0%, #your_color_2 100%);
```

### Add New Tab

1. Update `Tab` type in `chatbot-management.tsx`:

```typescript
type Tab = "dashboard" | "knowledge-base" | "products" | "settings" | "new-tab";
```

2. Add new component:

```typescript
const NewTab = dynamic(() => import("@/components/admin/NewTab"), {
  ssr: false,
});
```

3. Add tab button:

```tsx
<button
  className={`${styles.tab} ${activeTab === "new-tab" ? styles.active : ""}`}
  onClick={() => setActiveTab("new-tab")}
>
  📝 New Tab
</button>
```

4. Add content render:

```tsx
{
  activeTab === "new-tab" && <NewTab adminToken={adminToken} />;
}
```

### Connect to Database

Edit `src/pages/api/admin/knowledge-base.ts`:

```typescript
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("moxlite");
const kbCollection = db.collection("knowledge_base");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const entries = await kbCollection.find({}).toArray();
    res.status(200).json({ success: true, data: entries });
  }
  // ... etc
}
```

## Environment Variables

Required:

```env
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
NEXT_PUBLIC_ADMIN_TOKEN=admin123
```

Optional:

```env
NEXT_PUBLIC_ADMIN_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ADMIN_MAX_KB_ENTRIES=500
NEXT_PUBLIC_ADMIN_SESSION_TIMEOUT=3600
```

## Testing

### Manual Testing Checklist

- [ ] Login with correct password
- [ ] Login with wrong password (error handling)
- [ ] Add knowledge base entry
- [ ] Edit knowledge base entry
- [ ] Delete knowledge base entry
- [ ] Search products
- [ ] Filter by series
- [ ] Update chatbot settings
- [ ] Logout and verify session cleared
- [ ] Re-login works correctly
- [ ] Page is not indexed by search engines

### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import KnowledgeBaseManager from './KnowledgeBaseManager';

describe('KnowledgeBaseManager', () => {
  it('renders form on load', () => {
    render(<KnowledgeBaseManager adminToken="test" />);
    expect(screen.getByText(/Knowledge Base Manager/i)).toBeInTheDocument();
  });
});
```

## Performance Optimization

1. **Code Splitting**: Components use dynamic imports
2. **SSR Disabled**: Components have `ssr: false` for better performance
3. **Session Storage**: Admin token stored in sessionStorage (not localStorage)
4. **Lazy Loading**: Large components load on demand
5. **CSS Modules**: Scoped styles prevent conflicts

## Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation ready
- ✅ Color contrast compliant
- ✅ Form validation feedback

## Troubleshooting

### Component Not Rendering

Check:

- Is the component imported?
- Is SSR disabled in dynamic import?
- Check browser console for errors
- Verify props are passed correctly

### Styles Not Applied

Check:

- CSS module is imported
- Class names are correct
- Check `.next` cache
- Verify no conflicting global styles

### API Calls Failing

Check:

- Is admin token valid?
- Does endpoint exist?
- Check network tab in DevTools
- Verify CORS headers

## Best Practices

1. **Always validate input** before sending to API
2. **Show error messages** to user
3. **Use loading states** for async operations
4. **Debounce search** for performance
5. **Clear sensitive data** on logout
6. **Log errors** to console for debugging
7. **Test with slow network** (DevTools)
8. **Mobile responsive** design

## Future Enhancements

- [ ] Real-time collaboration
- [ ] Undo/Redo functionality
- [ ] Bulk operations
- [ ] Advanced search filters
- [ ] Data export/import
- [ ] Activity logs
- [ ] Performance metrics
- [ ] A/B testing interface

---

**Last Updated**: March 2026
**Version**: 1.0.0
