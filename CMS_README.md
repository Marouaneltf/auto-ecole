# Auto-École CMS

This project has been evolved into a component-based CMS.

## CMS Concepts

### Pages & Components
The content is no longer just flat key-value pairs. Each page (`CmsPage`) is composed of a list of ordered components (`CmsComponent`).
Each component has a specific `type` (e.g., `hero`, `text-block`, `image-text`) and a set of fields (`CmsComponentField`).

### Media Library
Images and files are managed centrally via the Media Library. Files are uploaded to the server (`/uploads`) and referenced by ID in the CMS components.
This avoids broken URLs and allows for easier file management.

## Admin Features

1.  **Media Library**: Upload and manage images. Copy URLs or use IDs in components.
2.  **CMS Pages**: Create and manage pages (draft/published status).
3.  **Page Builder** (Backend API ready): Add components to pages, reorder them, and edit their fields.

## Developer Guide

### Adding a New Component Type

1.  **Backend**: No changes needed (data-driven).
2.  **Frontend (`CmsRendererComponent`)**:
    *   Open `frontend/src/app/components/cms-renderer/cms-renderer.component.ts`.
    *   Add a new `*ngSwitchCase="'your-type'"` in the template.
    *   Design the HTML/CSS for your component.
    *   Use `getField('field_name')` to bind data.

### API Endpoints

*   **Public**:
    *   `GET /api/cms/pages/:slug`: Get full page structure.
*   **Admin** (Requires Bearer Token):
    *   `GET /api/media`: List all media.
    *   `POST /api/media/upload`: Upload file.
    *   `GET /api/cms/admin/pages`: List pages.
    *   `POST /api/cms/admin/components`: Add component.
    *   `POST /api/cms/admin/components/reorder`: Reorder components.

## Setup

1.  **Database**: The system uses Sequelize. It will automatically sync the new tables (`cms_pages`, `cms_components`, `cms_component_fields`, `media`) on startup.
2.  **Uploads**: Ensure the `backend/uploads` directory exists and is writable.

## Migration

Existing content in the `Content` table is preserved and served as a fallback. New pages created in the CMS will take precedence over the legacy content.
