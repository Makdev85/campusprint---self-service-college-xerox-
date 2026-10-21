export type ColorMode = 'bw' | 'color';
export type PaperSize = 'A4' | 'A3';
export type DuplexMode = 'single' | 'double';
export type Orientation = 'portrait' | 'landscape';
export type PageRangeType = 'all' | 'odd' | 'even' | 'custom';
export type BindingOption = 'none' | 'staple' | 'spiral';

export interface College {
  id: string;
  name: string;
  shortCode: string;
  campusCity: string;
  totalStudents: number;
  kiosksCount: number;
}

export interface KioskStation {
  id: string;
  collegeId: string;
  name: string;
  building: string;
  floor: string;
  status: 'online' | 'busy' | 'paper_low' | 'jammed' | 'maintenance';
  paperTrayA4: {
    current: number;
    capacity: number;
  };
  paperTrayA3: {
    current: number;
    capacity: number;
  };
  toner: {
    black: number; // percentage 0-100
    cyan: number;
    magenta: number;
    yellow: number;
    drumLife: number;
  };
  fuserTempCelsius: number;
  firmwareVersion: string;
  ipAddress: string;
  doorLocked: boolean;
  activeJobId: string | null;
  totalJobsServed: number;
}

export interface BatchFileItem {
  id: string;
  name: string;
  title: string;
  pageCount: number;
  sizeBytes: number;
  fileType: string;
  colorMode: ColorMode;
  duplex: DuplexMode;
  copies: number;
  binding: BindingOption;
}

export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed';
export type PaymentMethod = 'upi_qr' | 'gpay' | 'phonepe' | 'paytm' | 'campus_wallet';

export type JobStatus = 'queued' | 'spooling' | 'printing' | 'ready_for_pickup' | 'collected' | 'jammed';

export interface PrintBatchJob {
  id: string;
  collegeId: string;
  kioskId: string;
  studentName: string;
  studentRollNo: string;
  studentPhone: string;
  files: BatchFileItem[];
  totalFiles: number;
  totalPages: number;
  totalSheets: number;
  totalCostINR: number;
  payment: {
    status: PaymentStatus;
    method?: PaymentMethod;
    transactionId?: string;
    paidAt?: string;
  };
  printStatus: JobStatus;
  printProgress: number; // 0 to 100
  currentPrintingSheet: number;
  pickupPin: string; // 6-digit numeric e.g. "582-149"
  pickupSlot: string; // e.g. "Tray Slot #1"
  createdAt: string;
  completedAt?: string;
  collectedAt?: string;
}

export interface PrintDocument {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  pageCount: number;
  fileType?: string;
  title: string;
  category?: string;
  sampleContentSnippet?: string[];
}

export interface PrintJobConfig {
  colorMode: ColorMode;
  paperSize: PaperSize;
  duplex: DuplexMode;
  orientation: Orientation;
  pageRangeType: PageRangeType;
  customRangeStr: string;
  copies: number;
  binding: BindingOption;
}

export interface PrintJob {
  id: string;
  collegeId: string;
  kioskId: string;
  studentName: string;
  studentRollNo: string;
  studentPhone: string;
  document: PrintDocument;
  config: PrintJobConfig;
  calculatedPages: number;
  billableSheets: number;
  totalCostINR: number;
  payment: {
    status: PaymentStatus;
    method?: PaymentMethod;
    transactionId?: string;
    paidAt?: string;
  };
  printStatus: JobStatus;
  printProgress: number;
  currentPrintingPage: number;
  pickupPin: string;
  pickupSlot: string;
  createdAt: string;
  completedAt?: string;
  collectedAt?: string;
}

export type WizardStep = 1 | 2 | 3 | 4 | 5;
