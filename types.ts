
export enum ServiceType {
  TOUR = 'TOUR',
  ACTIVITY = 'ACTIVITY',
  PACKAGE = 'PACKAGE'
}

export enum BookingStatus {
  UPCOMING = 'UPCOMING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export enum Difficulty {
  EASY = 'Easy',
  MODERATE = 'Moderate',
  HARD = 'Hard'
}

export interface POI {
  id: string;
  name: string;
  arrivedAt?: string;
  completedAt?: string;
  isCompleted: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
  category?: string;
}

export interface DriverInfo {
  name: string;
  photo: string;
  plate: string;
  whatsapp: string;
}

export interface Booking {
  id: string;
  name: string;
  type: ServiceType;
  status: BookingStatus;
  date: string;
  image: string;
  // Specifics
  driver?: DriverInfo;
  pois?: POI[];
  gearList?: ChecklistItem[];
  difficulty?: Difficulty;
  healthWarning?: string;
  waiverSigned?: boolean;
  // Package specifics
  currentDay?: number;
  totalDays?: number;
  packageInclusions?: ChecklistItem[];
  transferTasks?: ChecklistItem[];
  isOpenDay?: boolean;
  openDayOptions?: string[];
  selectedActivity?: string;
  // History
  photos: string[];
  paidAmount: number;
  onSiteAmount: number;
  review?: {
    rating: number;
    comment: string;
  };
}
