# Auto-École CMS - Complete System

## Overview

This is a production-ready Content Management System (CMS) for driving school websites, built with Angular + Express + MySQL. The system provides a WordPress-like experience for non-technical administrators while maintaining clean, modern architecture.

## 🎯 Key Features

### ✅ **Fully Implemented**
- **Component-Based CMS**: Drag-and-drop page builder with 7 component types
- **Media Library**: Upload, manage, and select images for components
- **Draft/Publish Workflow**: Professional content publishing system
- **Responsive Design**: Mobile-first, professional styling
- **JWT Authentication**: Secure admin access
- **Legacy Fallback**: Existing content preserved and functional

### 🏗️ **CMS Architecture**

#### **Database Models**
```
CmsPage (slug, title, status: draft/published)
├── CmsComponent (page_id, type, sort_order)
│   └── CmsComponentField (component_id, name, value, type)
└── Media (filename, url, metadata)
```

#### **Component Types**
1. **Hero Section** - Full-width banner with title, subtitle, CTA
2. **Text Block** - Rich text content with alignment options
3. **Image + Text** - Side-by-side layout with positioning
4. **Services List** - Dynamic service display with icons/pricing
5. **Call to Action** - Prominent buttons with styling
6. **Opening Hours** - Business schedule display
7. **Image Gallery** - Grid or carousel layouts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+
- Angular CLI

### Installation

1. **Backend Setup**
```bash
cd backend
npm install
npm run dev
```

2. **Frontend Setup**
```bash
cd frontend
npm install
ng serve
```

3. **Database Setup**
```bash
# The system auto-creates tables on first run
# Run seeder for sample data:
npm run seed
```

### Default Admin Credentials
- Email: `admin@autoecole18.fr`
- Password: `admin123`

## 📋 Admin Workflow

### 1. **Pages Dashboard** (`/admin/pages`)
- Create new pages with unique slugs
- Toggle draft/published status
- Delete pages (with component safety checks)
- Professional card-based UI

### 2. **Page Builder** (`/admin/cms-builder/:id`)
- **Left Sidebar**: Component palette with 7 component types
- **Center Canvas**: Drag-and-drop component reordering
- **Right Panel**: Inline component editing with forms
- **Media Integration**: Click-to-select images from library

### 3. **Media Library** (`/admin/media`)
- Upload images via drag-and-drop or click
- Grid view with thumbnails
- Delete unused media with safety checks
- Automatic URL generation for components

## 🎨 Component System

### **Hero Component**
```typescript
fields: {
  title: string,
  subtitle: string,
  background_image: media_id,
  cta_text: string,
  cta_link: string
}
```

### **Image + Text Component**
```typescript
fields: {
  title: string,
  content: html,
  image: media_id,
  image_position: 'left' | 'right'
}
```

### **Services List Component**
- Automatically pulls from existing services database
- Responsive grid layout
- Professional card styling with hover effects

## 🔧 Developer Guide

### **Adding New Components**

1. **Backend**: No changes needed (data-driven)
2. **Frontend**: Update `CmsRendererComponent`
3. **Page Builder**: Add to `availableComponents` array

```typescript
// In cms-builder.component.ts
availableComponents.push({
  type: 'your-component',
  name: 'Your Component',
  icon: '🔧',
  description: 'Description for admins'
})
```

### **API Endpoints**

#### **Pages Management**
```
GET    /api/cms/admin/pages          // List all pages
POST   /api/cms/admin/pages          // Create page
PUT    /api/cms/admin/pages/:id      // Update page
DELETE /api/cms/admin/pages/:id      // Delete page
```

#### **Components Management**
```
POST   /api/cms/admin/components           // Add component
PUT    /api/cms/admin/components/:id       // Update component
DELETE /api/cms/admin/components/:id       // Delete component
POST   /api/cms/admin/components/reorder   // Reorder components
```

#### **Media Management**
```
GET    /api/media                    // List media
POST   /api/media/upload            // Upload file
DELETE /api/media/:id               // Delete media
```

#### **Public Pages**
```
GET /api/cms/pages/:slug            // Get published page
```

## 🎨 Styling & UX

### **Design Principles**
- **Professional**: Clean, modern aesthetic suitable for business websites
- **Accessible**: WCAG 2.1 compliant color contrast and keyboard navigation
- **Responsive**: Mobile-first design with breakpoints at 768px and 480px
- **Consistent**: Unified color scheme and typography across all components

### **Color Palette**
```css
--primary: #2563eb (Professional Blue)
--secondary: #f59e0b (Accent Orange)
--success: #059669 (Green)
--danger: #ef4444 (Red)
--neutral: #6b7280 (Gray)
```

### **Component Styling**
- **Cards**: Subtle shadows with hover animations
- **Buttons**: Consistent 8px border radius with hover states
- **Forms**: Focus states with accessibility ring
- **Modals**: Professional overlay with smooth transitions

## 🔒 Security Features

### **Authentication**
- JWT-based authentication with role-based access
- Admin-only routes protected with middleware
- Secure file upload with type validation

### **Validation**
- Server-side validation for all inputs
- Slug format enforcement (lowercase, hyphens only)
- Status validation (draft/published only)
- File type restrictions (images only)

### **Data Integrity**
- Foreign key constraints prevent orphaned data
- Cascade deletion for related components
- Transaction support for complex operations

## 📱 Responsive Design

### **Breakpoints**
- **Desktop**: 1200px+ (Full layout)
- **Tablet**: 768px-1199px (Adjusted grid)
- **Mobile**: <768px (Single column)

### **Touch Optimizations**
- Large tap targets for mobile
- Swipe-friendly gallery carousels
- Optimized drag-and-drop for touch devices

## 🧪 Testing

### **Manual Testing Checklist**
- ✅ Create page with all component types
- ✅ Upload and select images in components
- ✅ Reorder components via drag-and-drop
- ✅ Toggle draft/published status
- ✅ Delete pages with safety checks
- ✅ Responsive design on mobile/tablet
- ✅ Fallback to legacy content

### **Browser Support**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📈 Performance

### **Optimizations**
- Lazy loading for images
- Efficient database queries with proper indexing
- Minimal bundle size with tree shaking
- CDN-ready static file serving

### **Scalability**
- Pagination for large media libraries
- Efficient component field storage
- Optimized database schema with proper indexes

## 🛠️ Troubleshooting

### **Common Issues**

**Media not displaying in components**
- Check file upload permissions in `/uploads`
- Verify media IDs are correctly stored in component fields
- Ensure CORS headers for static file serving

**Components not saving**
- Check JWT token validity
- Verify all required fields are completed
- Check browser console for JavaScript errors

**Page not found errors**
- Confirm page slug is unique
- Check page status (draft vs published)
- Verify database connection

### **Debug Mode**
Enable debug logging:
```bash
# Backend
DEBUG=cms:* npm run dev

# Frontend
ng serve --configuration=development
```

## 📄 License

This project is built for driving school businesses and includes professional-grade features for commercial use.

---

**Built with ❤️ for driving school owners who need professional websites without technical complexity.**