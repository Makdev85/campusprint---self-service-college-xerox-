import { College, KioskStation, PrintDocument, PrintJob, PrintJobConfig } from '../types';

export const COLLEGES: College[] = [
  {
    id: 'col-iitd',
    name: 'Indian Institute of Technology Delhi',
    shortCode: 'IIT Delhi',
    campusCity: 'Hauz Khas, New Delhi',
    totalStudents: 11200,
    kiosksCount: 8,
  },
  {
    id: 'col-bits',
    name: 'Birla Institute of Technology and Science',
    shortCode: 'BITS Pilani',
    campusCity: 'Vidya Vihar, Pilani',
    totalStudents: 8500,
    kiosksCount: 6,
  },
  {
    id: 'col-nitk',
    name: 'National Institute of Technology Karnataka',
    shortCode: 'NIT Surathkal',
    campusCity: 'Mangalore, Karnataka',
    totalStudents: 7200,
    kiosksCount: 5,
  },
  {
    id: 'col-anna',
    name: 'College of Engineering, Guindy (Anna University)',
    shortCode: 'CEG Anna Univ',
    campusCity: 'Chennai, Tamil Nadu',
    totalStudents: 14500,
    kiosksCount: 9,
  },
  {
    id: 'col-du',
    name: 'Delhi University - North Campus',
    shortCode: 'DU North Campus',
    campusCity: 'University Enclave, Delhi',
    totalStudents: 24000,
    kiosksCount: 12,
  },
];

export const INITIAL_KIOSKS: KioskStation[] = [
  {
    id: 'kiosk-lib-01',
    collegeId: 'col-iitd',
    name: 'Kiosk #01 - Central Library',
    building: 'Central Library Building',
    floor: 'Ground Floor, Circulation Desk',
    status: 'online',
    paperTrayA4: {
      current: 440,
      capacity: 500,
    },
    paperTrayA3: {
      current: 180,
      capacity: 250,
    },
    toner: {
      black: 88,
      cyan: 74,
      magenta: 79,
      yellow: 82,
      drumLife: 92,
    },
    fuserTempCelsius: 192,
    firmwareVersion: 'v3.4.12-kiosk-rtos',
    ipAddress: '10.14.22.101',
    doorLocked: true,
    activeJobId: null,
    totalJobsServed: 1420,
  },
  {
    id: 'kiosk-cs-02',
    collegeId: 'col-iitd',
    name: 'Kiosk #02 - CS & AI Department',
    building: 'Bharti School of Telecommunication',
    floor: '2nd Floor, Near Lab 204',
    status: 'online',
    paperTrayA4: {
      current: 310,
      capacity: 500,
    },
    paperTrayA3: {
      current: 140,
      capacity: 250,
    },
    toner: {
      black: 65,
      cyan: 58,
      magenta: 62,
      yellow: 60,
      drumLife: 84,
    },
    fuserTempCelsius: 196,
    firmwareVersion: 'v3.4.12-kiosk-rtos',
    ipAddress: '10.14.22.102',
    doorLocked: true,
    activeJobId: null,
    totalJobsServed: 2190,
  },
  {
    id: 'kiosk-hostel-03',
    collegeId: 'col-iitd',
    name: 'Kiosk #03 - Nilgiri Hostel Lounge',
    building: 'Nilgiri Boys Hostel',
    floor: 'Common Room Entrance',
    status: 'paper_low',
    paperTrayA4: {
      current: 42,
      capacity: 500,
    },
    paperTrayA3: {
      current: 65,
      capacity: 250,
    },
    toner: {
      black: 42,
      cyan: 70,
      magenta: 68,
      yellow: 73,
      drumLife: 78,
    },
    fuserTempCelsius: 188,
    firmwareVersion: 'v3.4.12-kiosk-rtos',
    ipAddress: '10.14.22.103',
    doorLocked: true,
    activeJobId: null,
    totalJobsServed: 984,
  },
  {
    id: 'kiosk-sac-04',
    collegeId: 'col-iitd',
    name: 'Kiosk #04 - Student Activity Center',
    building: 'SAC Complex',
    floor: '1st Floor Cafeteria Hall',
    status: 'online',
    paperTrayA4: {
      current: 490,
      capacity: 500,
    },
    paperTrayA3: {
      current: 220,
      capacity: 250,
    },
    toner: {
      black: 95,
      cyan: 91,
      magenta: 93,
      yellow: 92,
      drumLife: 97,
    },
    fuserTempCelsius: 190,
    firmwareVersion: 'v3.4.12-kiosk-rtos',
    ipAddress: '10.14.22.104',
    doorLocked: true,
    activeJobId: null,
    totalJobsServed: 742,
  },
];

export const PRESET_DOCUMENTS = [
  {
    id: 'doc-1',
    fileName: 'Operating_Systems_Lab_Manual.pdf',
    title: 'Operating Systems Lab Manual',
    category: 'Computer Science',
    fileSizeBytes: 2450000,
    pageCount: 14,
  },
  {
    id: 'doc-2',
    fileName: 'Data_Structures_Assignment_2.pdf',
    title: 'Data Structures Trees Assignment',
    category: 'Assignments',
    fileSizeBytes: 1180000,
    pageCount: 6,
  },
  {
    id: 'doc-3',
    fileName: 'Linear_Algebra_Formula_Sheet.pdf',
    title: 'Linear Algebra Formula Cheatsheet',
    category: 'Exam Prep',
    fileSizeBytes: 840000,
    pageCount: 4,
  },
  {
    id: 'doc-4',
    fileName: 'Deep_Learning_Capstone_Report.pdf',
    title: 'Deep Learning Capstone Report',
    category: 'Projects',
    fileSizeBytes: 5200000,
    pageCount: 22,
  },
  {
    id: 'doc-5',
    fileName: 'Microprocessors_8086_Pinout.pdf',
    title: 'Microprocessors 8086 Lab Code',
    category: 'Hardware',
    fileSizeBytes: 950000,
    pageCount: 8,
  },
  {
    id: 'doc-6',
    fileName: 'Database_Systems_SQL_Queries.pdf',
    title: 'Database Systems SQL Queries',
    category: 'Assignments',
    fileSizeBytes: 620000,
    pageCount: 5,
  },
  {
    id: 'doc-7',
    fileName: 'Computer_Networks_Protocols.pdf',
    title: 'Computer Networks Protocols',
    category: 'Notes',
    fileSizeBytes: 1400000,
    pageCount: 10,
  },
  {
    id: 'doc-8',
    fileName: 'Campus_Placement_Resume.pdf',
    title: 'Campus Placement Resume',
    category: 'Career',
    fileSizeBytes: 420000,
    pageCount: 2,
  },
];

/**
 * Calculates cost for a single file item in the batch.
 */
export function calculateFileCost(file: {
  pageCount: number;
  colorMode: 'bw' | 'color';
  duplex: 'single' | 'double';
  copies: number;
  binding: 'none' | 'staple' | 'spiral';
}): {
  subtotal: number;
  sheetsNeeded: number;
  totalPages: number;
} {
  const isDuplex = file.duplex === 'double';
  const isColor = file.colorMode === 'color';
  const sheetsPerCopy = isDuplex ? Math.ceil(file.pageCount / 2) : file.pageCount;
  const ratePerSheet = isDuplex ? (isColor ? 10.0 : 2.5) : (isColor ? 6.0 : 1.5);

  let finishPerCopy = 0;
  if (file.binding === 'staple') finishPerCopy = 2;
  if (file.binding === 'spiral') finishPerCopy = 25;

  const totalSheets = sheetsPerCopy * file.copies;
  const totalPages = file.pageCount * file.copies;
  const subtotal = Math.max(1, Math.round((sheetsPerCopy * ratePerSheet + finishPerCopy) * file.copies));

  return {
    subtotal,
    sheetsNeeded: totalSheets,
    totalPages,
  };
}


/**
 * Calculates page count from range configuration.
 * e.g. "all" = totalPages, "odd" = ceil(totalPages/2), "custom" = "1-4, 7"
 */
export function calculateEffectivePages(totalPages: number, rangeType: string, customStr: string): number {
  if (rangeType === 'all') return totalPages;
  if (rangeType === 'odd') return Math.ceil(totalPages / 2);
  if (rangeType === 'even') return Math.floor(totalPages / 2);

  if (rangeType === 'custom' && customStr.trim()) {
    try {
      const parts = customStr.split(',').map((p) => p.trim());
      const selectedPages = new Set<number>();
      for (const part of parts) {
        if (part.includes('-')) {
          const [startStr, endStr] = part.split('-');
          const start = Math.max(1, parseInt(startStr, 10) || 1);
          const end = Math.min(totalPages, parseInt(endStr, 10) || totalPages);
          for (let i = start; i <= end; i++) {
            selectedPages.add(i);
          }
        } else {
          const p = parseInt(part, 10);
          if (p >= 1 && p <= totalPages) {
            selectedPages.add(p);
          }
        }
      }
      return selectedPages.size > 0 ? selectedPages.size : totalPages;
    } catch {
      return totalPages;
    }
  }

  return totalPages;
}

/**
 * Calculates transparent pricing in INR (₹).
 */
export function calculatePrintCost(config: PrintJobConfig, effectivePages: number): {
  pages: number;
  sheets: number;
  baseRatePerUnit: number;
  subtotalPaper: number;
  bindingCost: number;
  totalINR: number;
  paperSavedSheets: number;
} {
  const isDuplex = config.duplex === 'double';
  const isColor = config.colorMode === 'color';
  const isA3 = config.paperSize === 'A3';

  // Base rate calculation per sheet
  // B&W: Single = ₹1.50/page, Duplex = ₹2.50/sheet (₹1.25/page)
  // Color: Single = ₹6.00/page, Duplex = ₹10.00/sheet (₹5.00/page)
  let baseRatePerSheet = 0;
  let sheetsNeeded = 0;

  if (isDuplex) {
    sheetsNeeded = Math.ceil(effectivePages / 2);
    baseRatePerSheet = isColor ? 10.0 : 2.5;
  } else {
    sheetsNeeded = effectivePages;
    baseRatePerSheet = isColor ? 6.0 : 1.5;
  }

  if (isA3) {
    baseRatePerSheet = Number((baseRatePerSheet * 1.8).toFixed(2));
  }

  const paperSaved = isDuplex ? effectivePages - sheetsNeeded : 0;
  const subtotalPaper = baseRatePerSheet * sheetsNeeded * config.copies;

  let bindingCost = 0;
  if (config.binding === 'staple') {
    bindingCost = 2 * config.copies;
  } else if (config.binding === 'spiral') {
    bindingCost = 25 * config.copies;
  }

  const totalINR = Math.max(1, Math.round(subtotalPaper + bindingCost));

  return {
    pages: effectivePages * config.copies,
    sheets: sheetsNeeded * config.copies,
    baseRatePerUnit: baseRatePerSheet,
    subtotalPaper,
    bindingCost,
    totalINR,
    paperSavedSheets: paperSaved * config.copies,
  };
}

export const INITIAL_PRINT_JOBS: PrintJob[] = [
  {
    id: 'CP-9021',
    collegeId: 'col-iitd',
    kioskId: 'kiosk-lib-01',
    studentName: 'Aarav Sharma',
    studentRollNo: '2023CSB1042',
    studentPhone: '+91 98765 43210',
    document: PRESET_DOCUMENTS[0],
    config: {
      colorMode: 'bw',
      paperSize: 'A4',
      duplex: 'double',
      orientation: 'portrait',
      pageRangeType: 'all',
      customRangeStr: '',
      copies: 1,
      binding: 'staple',
    },
    calculatedPages: 14,
    billableSheets: 7,
    totalCostINR: 20,
    payment: {
      status: 'paid',
      method: 'gpay',
      transactionId: 'UPI-AXIS-992817263541',
      paidAt: '10 mins ago',
    },
    printStatus: 'ready_for_pickup',
    printProgress: 100,
    currentPrintingPage: 14,
    pickupPin: '582-149',
    pickupSlot: 'Tray Slot #1',
    createdAt: '12 mins ago',
    completedAt: '9 mins ago',
  },
  {
    id: 'CP-9022',
    collegeId: 'col-iitd',
    kioskId: 'kiosk-lib-01',
    studentName: 'Priya Sundaram',
    studentRollNo: '2022EEA2018',
    studentPhone: '+91 98112 34567',
    document: PRESET_DOCUMENTS[1],
    config: {
      colorMode: 'color',
      paperSize: 'A4',
      duplex: 'single',
      orientation: 'portrait',
      pageRangeType: 'all',
      customRangeStr: '',
      copies: 1,
      binding: 'none',
    },
    calculatedPages: 6,
    billableSheets: 6,
    totalCostINR: 36,
    payment: {
      status: 'paid',
      method: 'phonepe',
      transactionId: 'UPI-YESB-883719284729',
      paidAt: '25 mins ago',
    },
    printStatus: 'collected',
    printProgress: 100,
    currentPrintingPage: 6,
    pickupPin: '319-482',
    pickupSlot: 'Tray Slot #2',
    createdAt: '30 mins ago',
    completedAt: '22 mins ago',
    collectedAt: '18 mins ago',
  },
  {
    id: 'CP-9023',
    collegeId: 'col-iitd',
    kioskId: 'kiosk-cs-02',
    studentName: 'Rohan Verma',
    studentRollNo: '2024MTB1089',
    studentPhone: '+91 97654 32109',
    document: PRESET_DOCUMENTS[2],
    config: {
      colorMode: 'bw',
      paperSize: 'A4',
      duplex: 'double',
      orientation: 'portrait',
      pageRangeType: 'all',
      customRangeStr: '',
      copies: 2,
      binding: 'none',
    },
    calculatedPages: 4,
    billableSheets: 4,
    totalCostINR: 10,
    payment: {
      status: 'paid',
      method: 'upi_qr',
      transactionId: 'UPI-ICIC-119283746520',
      paidAt: '40 mins ago',
    },
    printStatus: 'collected',
    printProgress: 100,
    currentPrintingPage: 4,
    pickupPin: '724-601',
    pickupSlot: 'Tray Slot #1',
    createdAt: '45 mins ago',
    completedAt: '38 mins ago',
    collectedAt: '35 mins ago',
  },
];
