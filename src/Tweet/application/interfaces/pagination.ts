export interface IPagination {
  page?: number;
  perPage?: number;
  order?: 'Asc' | 'Desc';
  orderBy?: { id?: boolean; createdAt?: boolean };
}
