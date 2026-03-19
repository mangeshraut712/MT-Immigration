# Critical Features Implementation Plan

## Priority: Multilingual Support, Client Portal, Online Scheduling

---

## 1. Multilingual Support (Spanish)

### Implementation Steps

| Step | Task | Files to Modify |
|------|------|-----------------|
| 1.1 | Add i18n framework | `next.config.ts`, create `/src/app/[lang]/` structure |
| 1.2 | Create language switcher component | `src/components/ui/LanguageSwitcher.tsx` |
| 1.3 | Add Spanish translations for key pages | `src/content/translations/es.json` |
| 1.4 | Update Navbar with language toggle | `src/components/layout/Navbar.tsx` |
| 1.5 | Add Spanish chatbot support | `src/server/ai/chatbot.ts` |
| 1.6 | Update hreflang for SEO | `src/config/site.ts` |

### Technical Approach
- Use Next.js i18n routing with `next-intl` or similar
- Start with Spanish (most critical for immigration)
- Translate: Home, Services, Contact, FAQ, Intake confirmation pages
- Store translations in JSON files for easy maintenance

### Estimated Effort: 2-3 weeks

---

## 2. Client Portal

### Implementation Steps

| Step | Task | Files to Create/Modify |
|------|------|------------------------|
| 2.1 | Set up Supabase project | New: `src/lib/supabase.ts` |
| 2.2 | Create authentication system | `src/app/login/page.tsx`, `src/app/register/page.tsx` |
| 2.3 | Build case status dashboard | `src/app/portal/dashboard/page.tsx` |
| 2.4 | Create document upload component | `src/components/features/portal/DocumentUploader.tsx` |
| 2.5 | Add secure messaging | `src/app/portal/messages/page.tsx` |
| 2.6 | Implement notifications | `src/server/notifications.ts` |

### Database Schema (Supabase)

```sql
-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cases table
CREATE TABLE cases (
  id UUID PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  filed_date DATE,
  approval_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  case_id UUID REFERENCES cases(id),
  name TEXT NOT NULL,
  type TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  case_id UUID REFERENCES cases(id),
  sender TEXT NOT NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Features
- Email magic link authentication
- Case status overview (Pending, In Review, Filed, Approved, Denied)
- Document upload with drag-and-drop
- Secure messaging thread with attorney
- Milestone notifications via email

### Estimated Effort: 4-6 weeks

---

## 3. Online Scheduling

### Implementation Steps

| Step | Task | Files to Create/Modify |
|------|------|------------------------|
| 3.1 | Choose scheduling solution | Cal.com (recommended) or custom |
| 3.2 | Integrate calendar component | `src/components/features/scheduling/BookingCalendar.tsx` |
| 3.3 | Create consultation types | Configure: Initial, Follow-up, Urgent |
| 3.4 | Add pre-fill from intake | Pass form data to booking |
| 3.5 | Add confirmation workflow | Email + SMS notifications |

### Recommended: Cal.com (Open Source)

**Benefits:**
- Self-hostable or managed
- Great for law firms
- SMS reminders included
- No per-seat pricing for self-hosted

**Integration:**
```typescript
// Example embedding Cal.com
<Cal
  calLink="mt-immigration/consultation"
  config={{ 
    theme: 'dark',
    primaryColor: '#000000'
  }}
/>
```

### Consultation Types

| Type | Duration | Price | Use Case |
|------|----------|-------|----------|
| Initial Consultation | 30 min | $150 | New case review |
| Follow-up | 15 min | $75 | Case status update |
| Urgent | 30 min | $250 | Deadline-driven matters |

### Estimated Effort: 2-3 weeks

---

## Phase 1 Timeline Summary

| Week | Focus |
|------|-------|
| 1-2 | Multilingual: i18n setup, Spanish translations |
| 3 | Multilingual: Chatbot, SEO; Scheduling: Cal.com setup |
| 4-6 | Client Portal: Auth, Database, Dashboard |
| 7-8 | Client Portal: Documents, Messages, Notifications |
| 9-10 | Integration: Connect all three features, Testing |
| 11-12 | Polish: Mobile responsive, Performance, Launch |

---

## Dependencies

### External Services Required
1. **Supabase** - Auth + Database (Free tier sufficient)
2. **Cal.com** - Scheduling (Self-hosted or managed)
3. **Twilio** - SMS notifications (Pay per use)
4. **Resend** - Email (Free tier: 3k/month)

### Environment Variables to Add
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CAL_COM_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
RESEND_API_KEY=
```

---

## Next Steps

1. ✅ Plan approved (Critical features priority)
2. ⏳ Set up Supabase project
3. ⏳ Choose Cal.com vs custom scheduling
4. ⏳ Begin i18n implementation
5. ⏳ Start client portal development

---

*Plan created: March 2026*
