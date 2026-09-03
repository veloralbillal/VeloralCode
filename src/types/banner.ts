export interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  buttonText?: string;
  isActive: boolean;
  order: number;
  badge?: string;
  createdAt: number;
  updatedAt?: number;
  createdBy?: string;
}
