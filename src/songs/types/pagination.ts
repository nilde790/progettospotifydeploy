
interface PaginatedResult<T>{
    song: T[];
    total: number;
    page: number;
    limit: number;
}