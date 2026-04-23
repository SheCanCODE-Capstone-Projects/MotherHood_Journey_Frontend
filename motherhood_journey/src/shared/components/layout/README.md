# Shared Layout Components

This folder contains the shared portal layout pieces used across the role-based areas of the app.

## Files

- `PortalShell.tsx`
  Wraps each role portal layout and combines the sidebar, top bar, mobile nav, and page content area.

- `Sidebar.tsx`
  Renders desktop navigation links based on the current role.

- `TopBar.tsx`
  Shows the current user name, organization label and name, plus the logout button.

- `MobileNav.tsx`
  Shows a bottom navigation bar for `patient` and `health_worker` on smaller screens.

- `PageHeader.tsx`
  Reusable page section header with `title`, optional `subtitle`, and optional `action`.

- `index.ts`
  Re-exports the layout components for simple imports.

## Data Sources

- `src/shared/hooks/useRole.ts`
  Reads the current user from `useAuth()` and returns the resolved role, nav items, display name, and organization details.

- `src/shared/config/rbac.ts`
  Stores route access rules and role-based navigation items.

## Example

```tsx
import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to your portal"
        action={<Button>New action</Button>}
      />
    </div>
  );
}
```
