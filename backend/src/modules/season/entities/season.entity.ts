export class SeasonEntity {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  weeksCount: number;
  isActive: boolean;
  isArchived: boolean;
  createdAt: Date;
  archivedAt?: Date;
}