export interface ContentBlock {
  id?: string;
  type: 'text' | 'image' | 'gallery' | 'cards' | 'cta' | 'faq' | 'divider';
  data: Record<string, any>;
}

export interface PageMeta {
  seo_title?: string;
  seo_description?: string;
  og_image?: string;
}

export interface Page {
  id: number;
  slug: string;
  title: string;
  content: ContentBlock[];
  template: 'default' | 'full-width' | 'landing';
  status: 'draft' | 'published';
  sort_order: number;
  meta: PageMeta | null;
  created_at: string;
  updated_at: string;
}
