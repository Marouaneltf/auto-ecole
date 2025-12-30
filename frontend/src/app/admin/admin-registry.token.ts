import { InjectionToken, Type } from '@angular/core';

export interface AdminPageMeta {
  key: string;
  title: string;
  description: string;
  icon?: string;
  load: () => Promise<Type<any>>;
}

export const ADMIN_PAGES = new InjectionToken<AdminPageMeta[]>('ADMIN_PAGES');

