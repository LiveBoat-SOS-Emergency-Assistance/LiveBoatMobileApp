interface SOS {
  accuracy: string;
  created_at: string;
  credibility: number;
  description: string;
  group_id: string;
  id: string;
  latitude: string;
  location_updated_at: string;
  longitude: string;
  name: string;
  reported_count: number;
  status: string;
  user_id: string;
}
export interface SOSItem {
  SOS: SOS;
  accepted_at: string;
  accuracy: string;
  id: string;
  latitude: string;
  location_updated_at: string;
  longitude: string;
  sos_id: string;
  status: string;
  user_id: string;
}
export interface InfiniteScrollPaginationProps<T> {
  data: T[];
  itemsPerPage: number;
  renderItem: (item: T) => JSX.Element;
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}
