interface SearchResult {
  uniqueRef: string;
  artists: string[];
  title: string;
}

export interface Search {
  results: SearchResult[];
  searchRequest: string;
}
