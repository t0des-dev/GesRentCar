import api from "@/shared/services/client";
import type { Page } from "@/types/page";

export const pageService = {
  async getPages(): Promise<Page[]> {
    const { data } = await api.get("/pages");
    return data;
  },

  async getPage(slug: string): Promise<Page> {
    const { data } = await api.get(`/pages/${slug}`);
    return data;
  },

  async getAdminPages(): Promise<Page[]> {
    const { data } = await api.get("/admin/pages");
    return data;
  },

  async createPage(page: Partial<Page>): Promise<Page> {
    const { data } = await api.post("/admin/pages", page);
    return data;
  },

  async updatePage(id: number, page: Partial<Page>): Promise<Page> {
    const { data } = await api.put(`/admin/pages/${id}`, page);
    return data;
  },

  async deletePage(id: number): Promise<void> {
    await api.delete(`/admin/pages/${id}`);
  },
};
