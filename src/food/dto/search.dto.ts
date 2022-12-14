export class SearchFoodDto {
  title?: string;
  price?: 'DESC' | 'ASC';
  rating?: 'DESC' | 'ASC';
  views?: 'DESC' | 'ASC';
  favorites?: 'DESC' | 'ASC';
  limit?: number;
  take?: number;
  kind?: number;
  category?: string;
}
