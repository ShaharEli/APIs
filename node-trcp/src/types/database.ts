export interface IDatabaseItem {
  id?: number;
  task: string;
  completed: boolean;
}
export type IDatabase = IDatabaseItem[];
