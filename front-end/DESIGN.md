# AgroManage Design System

## 1. Overview

The AgroManage front-end is a robust, enterprise-grade Next.js application designed to manage agricultural business operations (ERP). It utilizes a modern, accessible, and highly consistent UI built on top of **Tailwind CSS v4** .

## 2. Typography

The application uses a dual-font system to separate data presentation from standard reading text, ensuring high legibility and a premium feel.

- **Display Font:** `Plus Jakarta Sans`, sans-serif (Used for Headers, page titles, `font-display`)
- **Body Font:** `DM Sans`, sans-serif (Used for general text, forms, tables, `font-body`)
- **Monospaced Font:** `Geist Mono` (Used for technical data, ref numbers, coding elements)

## 3. Color Palette

The color system is defined via Tailwind v4 `@theme inline` variables in `app/globals.css`. It heavily leans into an agricultural "Agro" aesthetic with Deep Forest Green and Warm Amber.

### Light Mode

- **Primary:** Deep Forest Green (`hsl(145, 45%, 28%)`) - Used for primary actions, active states.
- **Secondary:** Warm Amber (`hsl(35, 60%, 52%)`) - Used for highlights, secondary actions.
- **Background:** Off-White/Beige (`hsl(40, 20%, 97%)`) - Main app background.
- **Foreground (Text):** Dark Greenish Gray (`hsl(150, 30%, 12%)`)
- **Card:** Pure White (`hsl(0, 0%, 100%)`)
- **Sidebar Background:** Dark Forest Green (`hsl(150, 30%, 18%)`)

### Dark Mode

- **Primary:** Brighter Green (`hsl(145, 50%, 42%)`)
- **Secondary:** Warm Amber (`hsl(35, 60%, 52%)`)
- **Background:** Very Dark Greenish Gray (`hsl(150, 25%, 8%)`)
- **Foreground (Text):** Light Beige (`hsl(40, 20%, 92%)`)
- **Card:** Darker Gray-Green (`hsl(150, 20%, 12%)`)
- **Sidebar Background:** Very Dark Greenish Gray (`hsl(150, 25%, 8%)`)

### Status Colors (Semantic)

- **Success:** Emerald Green (`hsl(145, 60%, 40%)`) - Used for Active, Approved, Received.
- **Warning:** Amber (`hsl(40, 90%, 50%)`) - Used for Draft, Pending, In Transit.
- **Destructive:** Red (`hsl(0, 72%, 51%)`) - Used for Inactive, Rejected, Cancelled, Deletions.
- **Info:** Blue (`hsl(200, 70%, 50%)`) - Used for informational states.

## 4. UI Component Library (Primitives)

The `components/ui` folder houses 40+ accessible UI primitives built primarily with Radix UI and styled with Tailwind CSS (shadcn/ui style). Key primitives include:

- `Button`, `Input`, `Select`, `Textarea`, `Checkbox`, `RadioGroup`, `Switch` for forms.
- `Dialog`, `AlertDialog`, `Sheet`, `Drawer`, `Popover` for overlays.
- `Table`, `Card`, `Badge`, `Avatar`, `Skeleton` for data display.
- `Toast`, `Sonner` for notifications.
- `Chart` (Recharts wrapper) for data visualization.

## 5. Complex Custom Components

The architecture relies on high-level composite components to maintain absolute consistency across the ERP modules.

### Layout Components

- **`AppLayout` & `Sidebar`:** Implements a standard Master-Detail and Sidebar navigation structure. The Sidebar has a custom gradient (`sidebar-gradient`) and handles mobile responsiveness via a drawer.
- **`AuthGuard`:** Wraps the application to enforce authentication state, redirecting unauthenticated users to `/login`.

### Data Management

- **`MasterCrudPage`:** A highly versatile, configuration-driven component (`MasterPageProps`) used for almost all list/management pages (e.g., Users, Customers, Products). It provides:
  - Search and Status filtering.
  - Pagination (5, 10, 25, 50, ALL).
  - Built-in exports (PDF via `jspdf`, Excel via `xlsx`, CSV).
  - Bulk actions (select all, delete selected).
  - Automatic CRUD dialog integration.
- **`DataTable`:** A reusable table component supporting dynamic columns, custom cell rendering, row selection, and loading skeletons.
- **`DataPage`:** A standard wrapper for page headers and primary actions.

### Presentation

- **`StatCard`:** Dashboard metrics card with icons and trend indicators.
- **`InvoiceTemplate`:** A specialized component using `html2canvas` and `jsPDF` to generate highly styled, printable business documents (Invoices, Receipts).
- **`CrudFormDialog`:** Standardized modal wrapper for Add/Edit forms.

## 6. Forms & Validation (`lib/validation.ts`)

Form validation is strictly enforced to ensure data integrity, especially for regional specific data.

- **Indian Phone Numbers:** Phone numbers are strictly validated and formatted to the Indian standard (`+91 XXXXX XXXXX`). The `formatIndianPhone` utility auto-corrects inputs.

- **Email Validation:** Standard Regex pattern matching for valid emails.
- Form fields support `dependsOn` logic (cascading dropdowns) and computed/disabled fields (system-calculated values).

## 7. Interaction & Animation

- **Hover Effects:** Extensive use of Tailwind's `transition-colors`, `transition-all`, `hover:bg-muted`, and `active:scale-95` on interactive elements to provide tactile feedback.
- **Loading States:** `Skeleton` components mimic the layout of data tables and dashboards while data is fetching. Spinners (`lucide-react` Loader) are used in buttons.
- **Micro-interactions:** Custom scrollbars (`.custom-scrollbar`) and subtle zoom-in animations for dialogs (`animate-in zoom-in-95`).
- **Notifications:** `sonner` is used for global toast notifications (success/error) after asynchronous API calls.
