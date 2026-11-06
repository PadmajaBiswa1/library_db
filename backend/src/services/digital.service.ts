import { db } from '../config/database';
import { IDigitalResource, DigitalResourceType, BookCategory } from '../types';
import { ApiError } from '../utils/apiError';

export class DigitalService {
  public static async getAllResources(query?: {
    search?: string;
    category?: string;
    type?: string;
  }): Promise<IDigitalResource[]> {
    let list = [...db.digitalResources];

    if (query?.search) {
      const s = query.search.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(s) ||
          r.author.toLowerCase().includes(s) ||
          r.subject.toLowerCase().includes(s)
      );
    }

    if (query?.category && query.category !== 'ALL') {
      list = list.filter((r) => r.category === query.category);
    }

    if (query?.type && query.type !== 'ALL') {
      list = list.filter((r) => r.resourceType === query.type);
    }

    return list;
  }

  public static async getResourceById(id: string): Promise<IDigitalResource> {
    const res = db.digitalResources.find((r) => r.id === id);
    if (!res) {
      throw ApiError.notFound(`Digital resource '${id}' not found`);
    }
    return res;
  }

  public static async createResource(data: {
    title: string;
    author: string;
    category: BookCategory;
    subject: string;
    resourceType: DigitalResourceType;
    fileFormat: 'PDF' | 'EPUB' | 'LINK';
    fileUrl: string;
    fileSize?: string;
    publishedYear: number;
    description: string;
  }): Promise<IDigitalResource> {
    const newRes: IDigitalResource = {
      id: `dig-${Date.now()}`,
      ...data,
      fileSize: data.fileSize || '3.5 MB',
      downloadCount: 0,
      uploadedAt: new Date().toISOString(),
    };

    db.digitalResources.unshift(newRes);
    db.logActivity('NEW_BOOK', 'Digital Resource Added', `Uploaded ${newRes.resourceType}: "${newRes.title}" (${newRes.fileFormat})`);
    return newRes;
  }

  public static async incrementDownload(id: string): Promise<number> {
    const res = await this.getResourceById(id);
    res.downloadCount += 1;
    return res.downloadCount;
  }

  public static async deleteResource(id: string): Promise<void> {
    const index = db.digitalResources.findIndex((r) => r.id === id);
    if (index === -1) {
      throw ApiError.notFound(`Digital resource '${id}' not found`);
    }
    const removed = db.digitalResources.splice(index, 1)[0];
    db.logActivity('BOOK_ADDED' as any, 'Digital Asset Removed', `Removed "${removed.title}" from digital repository`);
  }
}
