# CRM Product Specification

## 1. Project overview

A simple CRM application. Motivated by the observation that existing CRM tools tend to be overloaded
with features and overly complex, this project aims for a practical CRM that focuses only on what
small-to-medium teams actually need.

- **Target usage**: Teams with multiple sales reps, but designed to also work for a single user
  (the data model holds up even with just one `User`).
- **Design direction**: A minimal UI inspired by Linear — generous whitespace, no information overload.

## 2. Tech stack

- Laravel 13 (API-only, fully decoupled SPA architecture)
  - *Note: originally planned as Laravel 11, but switched to the latest stable major (13) at
    implementation time (2026-08) because Laravel 11's security-support window had ended and
    Composer's advisory check blocked installation of any 11.x release.*
- React 19 + TypeScript
  - *Note: originally planned as React 18, but switched to the latest stable major (19) at
    implementation time (2026-08) since this is a brand-new project.*
- Zustand (state management)
- React Router (routing)
- MySQL
- Docker Compose
- GitHub Actions (CI/CD)
- Laravel Sanctum (authentication) + Google OAuth login (Laravel Socialite), alongside traditional
  email/password accounts

*Note: the frontend was originally scoped with Vue.js 3, then switched to React after weighing demand
in the Vancouver job market.*

## 3. Core objects (data model)

| Object | Description | Relationship |
|---|---|---|
| `Customer` | The central object | - |
| `Tag` | Freely created by users (has a name and a color) | Many-to-many with Customer (`customer_tag` pivot table) |
| `User` | An internal rep. Designed to work for both solo use and team use | One-to-many with Customer (`assigned_to`, nullable) |
| `ContactHistory` | Interaction log, recorded as a timeline | One-to-many with Customer |
| `Task` | A lightweight checklist item (title, done flag, optional due date). Embedded in the customer detail page rather than a dedicated screen | One-to-many with Customer |
| `CustomerLink` | External link (Notion, Gmail, or any URL), with a label, URL, and icon type | One-to-many with Customer |
| `ActivityLog` | Auto-recorded edit log ("who changed what, when") shown at the bottom of the customer detail page | One-to-many with Customer |

### Table structure sketch

```
users: id, name, email(unique), email_verified_at, password(nullable), google_id(nullable, unique),
       avatar_url(nullable), remember_token, created_at, updated_at
customers: id, name, company(nullable), email(nullable, unique), phone(nullable), assigned_to(nullable, FK->users, SET NULL),
           memo(markdown, nullable), created_at, updated_at
tags: id, name(unique), color, created_by(nullable, FK->users, SET NULL), created_at, updated_at
customer_tag: customer_id(FK->customers, CASCADE), tag_id(FK->tags, CASCADE)  -- composite PK
contact_histories: id, customer_id(FK->customers, CASCADE), content, created_by(nullable, FK->users, SET NULL), created_at
tasks: id, customer_id(FK->customers, CASCADE), title, is_done, due_date(nullable),
       created_by(nullable, FK->users, SET NULL), created_at, updated_at
customer_links: id, customer_id(FK->customers, CASCADE), label, url, icon_type, created_at, updated_at
activity_logs: id, customer_id(FK->customers, CASCADE), action, description,
               created_by(nullable, FK->users, SET NULL), created_at
```

*Note: `users.password` is nullable and `users.google_id`/`avatar_url` were added to support Google OAuth
login (Sanctum SPA auth), while still allowing traditional email+password accounts to coexist.*

### Out of scope (deliberately deferred)

- Categorizing customers by deal status (e.g. negotiating / closed) — this tends to create a
  maintenance burden and go stale, so a flat list plus flexible tags is used instead
- A dedicated task list screen or due-date reminders/notifications — kept to a simple checklist on
  the customer detail page
- AI features (summarization, chat, etc.) — cleanly split out as Phase 2 (see section 4)
- File attachments, deal value — kept as optional candidates, not required

## 4. Future direction (Phase 2, out of scope for now)

- Build an MCP server to integrate with external services such as Notion and Gmail
- Support chat-style queries on a customer page, e.g. "summarize the past interactions with this customer"
- For now, the scope is limited to manual link aggregation via `CustomerLink`; active information
  aggregation is positioned as a next-phase concept

## 5. Screen design

### 5.1 Overall layout and sidebar

A two-tier structure inspired by Linear's workspace layout.

**Top fixed area**
- Workspace name/logo
- Search bar (app-wide quick search, similar to a command palette)
- "+ Add customer" button

**Main navigation**
- Dashboard
- My customers (customers assigned to the current user)
- All customers (the full list)

**Tags section (collapsible)**
- User-created tags, shown with color dots. Clicking a tag filters the customer list

**Bottom area**
- User avatar + Settings

*Note: grouping by deal status was dropped, given the maintenance overhead noted above.*

### 5.2 Customer list screen

Table layout (card layout was rejected — it gets hard to scan as the number of customers grows).
A flat list with no status-based grouping.

**Columns**

| Column | Content |
|---|---|
| Name | Click to go to the detail page |
| Company | |
| Email | |
| Tags | Multiple allowed. Shows up to 2–3, with the rest collapsed into a `+N` badge |
| Assignee | Avatar |
| Last contact | |

**Top bar**
- Search bar (filters the currently displayed list in place — distinct in purpose from the
  app-wide search in the sidebar)
- Filter icon (opens a dropdown for filtering by tag, assignee, etc. — details TBD)

### 5.3 Customer detail screen

A two-column layout inspired by Linear's issue detail page, with fixed properties in the right column.

**Left column (main content, top to bottom)**

1. Customer name (large heading)
2. **Contact history** (required) — timeline format, with an "+ Add" button for new entries
3. **Tasks** (required) — simple checklist, with an "+ Add" button; completed items get a strikethrough
4. **Notes** — a free-form Markdown field for information that doesn't fit a structured field, such as
   decision-maker details or competitive context
5. **Activity** (edit log) — auto-recorded "who changed what, when" (tag added, assignee changed,
   customer created, etc.), shown at the bottom

**Right column (fixed properties panel)**

- Properties: email, company, assignee (reassignable)
- Tags: multiple, addable/removable
- External links: multiple links to Notion, Gmail, etc. (label + URL)

## 6. Open items / to be refined later

- Detailed spec for the filter dropdown (filter conditions beyond tag/assignee, AND/OR logic, etc.)
- Input UI for adding a task via the "+ Add" button (inline vs. modal)
- Editing experience for the notes field (inline edit vs. separate view, etc.)
- UI for the new-customer form (modal vs. dedicated page, required vs. optional fields)
- Roles/permissions design (Admin/Member distinction, or a single shared role for everyone)
