export type SearchProps =
  | { hasSearchIcon: true; onSearch: () => void }
  | { hasSearchIcon?: false; onSearch?: never };
