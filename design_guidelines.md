# Unified AI Command Centre - Design Guidelines

## Design Approach

**Selected Approach:** Design System (Modern Productivity)
**Primary References:** Linear, Notion, Asana
**Rationale:** This is a utility-focused, information-dense productivity tool where efficiency, clarity, and consistent patterns are paramount. The interface must handle complex workflows while remaining intuitive for daily operations.

## Core Design Principles

1. **Clarity Over Decoration** - Every element serves a functional purpose
2. **Information Hierarchy** - Critical data is immediately visible, secondary information accessible
3. **Responsive Density** - Comfortable information density that doesn't overwhelm
4. **Cross-Channel Consistency** - WhatsApp and email messages share visual language

---

## Typography

**Font Families:**
- Primary: Inter (via Google Fonts) - body text, UI elements
- Monospace: JetBrains Mono - message timestamps, IDs, technical data

**Type Scale:**
- Page Titles: text-3xl font-semibold (30px)
- Section Headers: text-xl font-semibold (20px)
- Card Titles: text-lg font-medium (18px)
- Body Text: text-base (16px)
- Secondary Info: text-sm (14px)
- Timestamps/Meta: text-xs (12px)

**Hierarchy Rules:**
- Dashboard page title always at top with breadcrumb navigation
- Section headers with subtle dividers
- Message sender names bold, content regular weight
- All timestamps and metadata in muted, smaller text

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Component padding: p-4 or p-6
- Section gaps: gap-6 or gap-8
- Card margins: mb-4 or mb-6
- Icon-to-text spacing: gap-2

**Grid Structure:**

**Desktop Layout (1440px+):**
```
[Sidebar 240px] [Main Content flex-1] [Details Panel 360px*]
*Details panel appears contextually
```

**Key Measurements:**
- Sidebar: w-60 (240px) fixed
- Main content: flex-1 with max-w-7xl container
- Details panel: w-90 (360px) when active
- Content padding: px-6 py-8 for main areas

---

## Component Library

### Navigation Architecture

**Primary Sidebar (Left):**
- Logo/brand at top (h-16)
- Main navigation items with icons (Heroicons)
- Active state: subtle background with border-l-2 accent
- Badge indicators for unread counts
- User profile at bottom with status indicator

**Navigation Items:**
- Dashboard
- Inbox (with unread count)
- Contacts
- Templates
- Analytics
- Settings

### Dashboard View

**Top Bar:**
- Search bar (w-96 centered)
- Quick actions: "+ New Message", "Filters"
- Notification bell with count badge
- User avatar dropdown

**Activity Feed (Main Column):**
- Cards for each communication event
- Each card shows: channel icon, sender/recipient, preview text, timestamp, status badge
- Card structure: p-4, rounded-lg, border, hover:shadow-md
- Unread messages: border-l-4 accent indicator

**Stats Overview (Top):**
- 4-column grid of metric cards
- Each card: Icon, Large number (text-3xl), Label (text-sm), Trend indicator
- Cards: p-6, rounded-lg, border

### Contact Management

**Contact List View:**
- Two-column layout: List (flex-1) + Detail Panel (w-96)
- List items: Avatar, Name (font-medium), Role badge, Last contact time
- Search and filter bar at top
- Alphabetical grouping with sticky headers

**Contact Detail Panel:**
- Profile header: Large avatar, name, contact info
- Tabbed sections: Overview, Messages, Activity
- Communication history timeline
- Quick action buttons: "Send WhatsApp", "Send Email"

### Conversation Thread View

**Message Thread Layout:**
- Full-width content area with max-w-4xl centered
- Thread header: Contact name, channel badges, thread metadata
- Messages stack vertically with appropriate spacing (mb-4)
- Incoming vs outgoing alignment (left vs right)

**Message Cards:**
- Sender messages: bg-subtle, rounded-lg, p-3, max-w-2xl, ml-auto
- Received messages: border, rounded-lg, p-3, max-w-2xl
- Include: Sender name, message content, timestamp, status icon
- WhatsApp messages: green accent dot, Email messages: blue accent dot

**Message Composer (Bottom):**
- Fixed bottom bar with backdrop-blur
- Multi-line textarea with auto-expand
- Channel selector (WhatsApp/Email toggle)
- Language selector dropdown
- Attachment button, AI suggest button
- Send button (primary action)

### Template Library

**Grid Layout:**
- 3-column card grid (grid-cols-3 gap-6)
- Each template card: p-6, rounded-lg, border
- Card content: Category badge, title (font-semibold), preview text (3 lines), language flags
- Hover state: shadow-lg, subtle scale
- Actions: "Use Template", "Edit", "Duplicate"

**Template Editor Modal:**
- Full-screen overlay with centered content (max-w-3xl)
- Split view: Editor (left) + Preview (right)
- Language tabs at top
- Rich text editor with formatting toolbar
- Variable placeholders highlighted

### Analytics Dashboard

**Layout:**
- Full-width grid: 2 large charts, 4 metric cards, 1 detailed table
- Chart cards: p-6, rounded-lg, border, h-80
- Use placeholder areas for charts with labels

**Chart Types:**
- Line graph: Message volume over time
- Bar chart: Response times by channel
- Pie chart: Message distribution by language
- Table: Recent activity log with sortable columns

---

## Icon System

**Library:** Heroicons (outline and solid variants via CDN)

**Icon Usage:**
- Navigation: outline icons (20px)
- Action buttons: outline icons (20px)
- Status indicators: solid icons (16px)
- Channel badges: solid icons (16px)

**Key Icons:**
- WhatsApp: chat-bubble-left (with green accent)
- Email: envelope (with blue accent)
- AI: sparkles
- Templates: document-text
- Analytics: chart-bar
- Contacts: users
- Settings: cog

---

## Data Display Components

**Badges:**
- Pill-shaped: rounded-full px-3 py-1 text-xs font-medium
- Types: Status (Active/Away), Channel (WhatsApp/Email), Language (KN/HI/NE/EN), Priority

**Status Indicators:**
- Dots: w-2 h-2 rounded-full (online: green, busy: red, away: yellow)
- Placed before usernames or in profile headers

**Tables:**
- Clean rows with hover:bg-subtle
- Header: text-xs uppercase tracking-wide font-medium
- Cell padding: py-3 px-4
- Borders: divide-y divider between rows
- Sortable columns with arrow icons

**Empty States:**
- Centered content with illustration placeholder area
- Icon (48px), Heading (text-xl), Description (text-sm), Primary CTA button

---

## Forms & Inputs

**Text Inputs:**
- Height: h-10 (40px)
- Padding: px-3
- Border: border rounded-md
- Focus: ring-2 ring-offset-1

**Textareas:**
- Minimum height: h-24
- Auto-expand for message composer
- Same border/focus treatment

**Select Dropdowns:**
- Match text input styling
- Chevron-down icon on right

**Buttons:**
- Primary: px-4 py-2 rounded-md font-medium
- Secondary: border variant
- Icon buttons: p-2 rounded-md (square)
- Loading state: spinner animation

---

## Responsive Behavior

**Tablet (768px - 1024px):**
- Sidebar collapses to icon-only (w-16)
- Main content takes remaining space
- Details panel overlays instead of fixed
- Analytics grid becomes 2-column

**Mobile (< 768px):**
- Bottom navigation bar replaces sidebar
- Single column layouts throughout
- Full-width message threads
- Swipeable cards for actions
- Hamburger menu for additional options

---

## Animation Guidelines

**Minimal, Purposeful Animations:**
- Page transitions: None (instant)
- Modal open: fade-in, scale-95 to scale-100 (150ms)
- Dropdown menus: slide-down (100ms)
- Hover states: subtle shadow transitions (200ms)
- Loading states: spinner or skeleton screens
- **No scroll-triggered animations**

---

## Images

**Profile Avatars:**
- Circular avatars throughout (32px, 40px, 48px sizes)
- Initials fallback with subtle background
- Status indicators overlaid on bottom-right

**Channel Icons:**
- 16px solid icons next to message previews
- WhatsApp and Email brand recognition

**Empty State Illustrations:**
- Placeholder areas (200x200px) for custom illustrations
- Simple, line-art style preferred
- Centered in empty state containers

**No Hero Images** - This is a productivity dashboard, not a marketing site. Focus is on functional data display and workflow efficiency.