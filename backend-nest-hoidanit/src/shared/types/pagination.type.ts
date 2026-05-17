export class PaginationQueryDto {
  page?: number = 1;
  limit?: number = 10;
  sort?: string;
  order?: 'asc' | 'desc' = 'desc';
}
