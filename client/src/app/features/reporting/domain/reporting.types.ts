export interface Author {
  first_name: string;
  last_name: string;
  birth_date: string;
  sex: string;
  email: string;
}

export interface Reporting {
  id: number;
  author: Author;
  description: string;
  observations: number[];
}
