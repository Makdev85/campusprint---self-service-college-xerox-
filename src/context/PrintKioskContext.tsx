import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  College,
  KioskStation,
  BatchFileItem,
  PrintBatchJob,
  PaymentMethod,
  WizardStep,
} from '../types';
import {
  COLLEGES,
  INITIAL_KIOSKS,
  PRESET_DOCUMENTS,
  calculateFileCost,
} from '../utils/mockData';
import {
  playKeyClick,
  playSolenoidUnlock,
  playPaperEjectSound,
  playSuccessChime,
  playAlertSound,
  setSoundEnabled,
  isSoundEnabled,
} from '../utils/audio';

interface PrintKioskContextType {
  // Wizard Step (1: College -> 2: Printer -> 3: Upload Files (Max 8) -> 4: Payment -> 5: Xerox Output)
  currentStep: WizardStep;
  goToStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Sound
  soundOn: boolean;
  toggleSound: () => void;

  // Step 1: College
  colleges: College[];
  selectedCollege: College;
  setSelectedCollegeId: (id: string) => void;

  // Step 2: Printer / Kiosk
  kiosks: KioskStation[];
  selectedKiosk: KioskStation;
  setSelectedKioskId: (id: string) => void;

  // Step 3: Files (Max 8 files)
  batchFiles: BatchFileItem[];
  addCustomFile: (file: File) => boolean;
  addPresetFile: (presetId: string) => boolean;
  removeFile: (id: string) => void;
  updateFileConfig: (id: string, updates: Partial<BatchFileItem>) => void;
  clearAllFiles: () => void;
  studentRollNo: string;
  setStudentRollNo: (val: string) => void;
  studentPhone: string;
  setStudentPhone: (val: string) => void;

  // Batch totals
  totalFilesCount: number;
  totalBatchPages: number;
  totalBatchSheets: number;
  totalBatchCostINR: number;
  maxFilesLimit: number;

  // Step 4 & 5: Payment & Final Xerox Output
  activeBatchJob: PrintBatchJob | null;
  submitBatchAndPay: (method: PaymentMethod) => Promise<PrintBatchJob>;
  collectPrintedJob: () => void;
  resetToStart: () => void;
  pickupPinInput: string;
  setPickupPinInput: (val: string) => void;
  verifyAndUnlockDrawer: (pin: string) => boolean;
  isDrawerUnlocked: boolean;
  setIsDrawerUnlocked: (unlocked: boolean) => void;

  // Hardware replenishment for operators
  refillPaperKiosk: (kioskId: string) => void;
  replaceTonerKiosk: (kioskId: string) => void;
}

const PrintKioskContext = createContext<PrintKioskContextType | null>(null);

const INITIAL_BATCH_FILES: BatchFileItem[] = [
  {
    id: 'f-1',
    name: PRESET_DOCUMENTS[0].fileName,
    title: PRESET_DOCUMENTS[0].title,
    pageCount: PRESET_DOCUMENTS[0].pageCount,
    sizeBytes: PRESET_DOCUMENTS[0].fileSizeBytes,
    fileType: 'application/pdf',
    colorMode: 'bw',
    duplex: 'double',
    copies: 1,
    binding: 'staple',
  },
  {
    id: 'f-2',
    name: PRESET_DOCUMENTS[1].fileName,
    title: PRESET_DOCUMENTS[1].title,
    pageCount: PRESET_DOCUMENTS[1].pageCount,
    sizeBytes: PRESET_DOCUMENTS[1].fileSizeBytes,
    fileType: 'application/pdf',
    colorMode: 'bw',
    duplex: 'double',
    copies: 1,
    binding: 'none',
  },
];

export const PrintKioskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // College & Kiosks
  const [colleges] = useState<College[]>(COLLEGES);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>(COLLEGES[0].id);
  const [kiosks, setKiosks] = useState<KioskStation[]>(INITIAL_KIOSKS);
  const [selectedKioskId, setSelectedKioskId] = useState<string>(INITIAL_KIOSKS[0].id);

  // Batch Files (Max 8)
  const [batchFiles, setBatchFiles] = useState<BatchFileItem[]>(INITIAL_BATCH_FILES);
  const [studentRollNo, setStudentRollNo] = useState<string>('2024CSB1045');
  const [studentPhone, setStudentPhone] = useState<string>('+91 98765 43210');

  // Active Job & Output State
  const [activeBatchJob, setActiveBatchJob] = useState<PrintBatchJob | null>(null);
  const [isDrawerUnlocked, setIsDrawerUnlocked] = useState(false);
  const [pickupPinInput, setPickupPinInput] = useState('');

  const maxFilesLimit = 8;

  const selectedCollege = useMemo(() => {
    return colleges.find((c) => c.id === selectedCollegeId) || colleges[0];
  }, [colleges, selectedCollegeId]);

  const selectedKiosk = useMemo(() => {
    return kiosks.find((k) => k.id === selectedKioskId) || kiosks[0];
  }, [kiosks, selectedKioskId]);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playKeyClick();
  };

  const goToStep = (step: WizardStep) => {
    playKeyClick();
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextStep = () => {
    playKeyClick();
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as WizardStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    playKeyClick();
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Add custom file from dropzone
  const addCustomFile = (file: File): boolean => {
    if (batchFiles.length >= maxFilesLimit) {
      playAlertSound();
      return false;
    }
    playKeyClick();
    const estPages = Math.max(1, Math.min(50, Math.ceil(file.size / (160 * 1024))));
    const newItem: BatchFileItem = {
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: file.name,
      title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      pageCount: estPages,
      sizeBytes: file.size,
      fileType: file.type || 'application/pdf',
      colorMode: 'bw',
      duplex: 'double',
      copies: 1,
      binding: 'staple',
    };
    setBatchFiles((prev) => [...prev, newItem]);
    return true;
  };

  // Add sample file from preset
  const addPresetFile = (presetId: string): boolean => {
    if (batchFiles.length >= maxFilesLimit) {
      playAlertSound();
      return false;
    }
    playKeyClick();
    const doc = PRESET_DOCUMENTS.find((d) => d.id === presetId);
    if (!doc) return false;

    const newItem: BatchFileItem = {
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: doc.fileName,
      title: doc.title,
      pageCount: doc.pageCount,
      sizeBytes: doc.fileSizeBytes,
      fileType: 'application/pdf',
      colorMode: 'bw',
      duplex: 'double',
      copies: 1,
      binding: 'staple',
    };
    setBatchFiles((prev) => [...prev, newItem]);
    return true;
  };

  const removeFile = (id: string) => {
    playKeyClick();
    setBatchFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFileConfig = (id: string, updates: Partial<BatchFileItem>) => {
    playKeyClick();
    setBatchFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const clearAllFiles = () => {
    playKeyClick();
    setBatchFiles([]);
  };

  // Batch calculations
  const totalFilesCount = batchFiles.length;

  const { totalBatchPages, totalBatchSheets, totalBatchCostINR } = useMemo(() => {
    let pages = 0;
    let sheets = 0;
    let cost = 0;

    for (const f of batchFiles) {
      const { subtotal, sheetsNeeded, totalPages } = calculateFileCost(f);
      pages += totalPages;
      sheets += sheetsNeeded;
      cost += subtotal;
    }

    return {
      totalBatchPages: pages,
      totalBatchSheets: sheets,
      totalBatchCostINR: Math.max(1, cost),
    };
  }, [batchFiles]);

  // Submit and simulate real printing
  const submitBatchAndPay = async (method: PaymentMethod): Promise<PrintBatchJob> => {
    playSuccessChime();
    const randomPin = Math.floor(100000 + Math.random() * 900000);
    const pinStr = `${String(randomPin).slice(0, 3)}-${String(randomPin).slice(3, 6)}`;
    const slotNumber = Math.floor(Math.random() * 4) + 1;
    const jobId = `XEROX-${Math.floor(1000 + Math.random() * 9000)}`;

    const newJob: PrintBatchJob = {
      id: jobId,
      collegeId: selectedCollegeId,
      kioskId: selectedKioskId,
      studentName: 'Student Roll ' + (studentRollNo || '2024CSB1045'),
      studentRollNo: studentRollNo || '2024CSB1045',
      studentPhone: studentPhone || '+91 98765 43210',
      files: [...batchFiles],
      totalFiles: totalFilesCount,
      totalPages: totalBatchPages,
      totalSheets: totalBatchSheets,
      totalCostINR: totalBatchCostINR,
      payment: {
        status: 'paid',
        method,
        transactionId: `UPI-NPCI-${Date.now().toString().slice(-9)}`,
        paidAt: 'Just now',
      },
      printStatus: 'printing',
      printProgress: 10,
      currentPrintingSheet: 1,
      pickupPin: pinStr,
      pickupSlot: `Tray Slot #${slotNumber}`,
      createdAt: 'Just now',
    };

    setActiveBatchJob(newJob);
    setIsDrawerUnlocked(false);
    goToStep(5); // Jump straight to Final Xerox Output!

    // Run sheet-by-sheet mechanical print simulation
    let currentSheet = 1;
    const totalSheetsToPrint = totalBatchSheets;

    const interval = setInterval(() => {
      if (currentSheet <= totalSheetsToPrint) {
        playPaperEjectSound();
        const progress = Math.min(95, Math.round((currentSheet / totalSheetsToPrint) * 90) + 10);
        setActiveBatchJob((prev) =>
          prev
            ? {
                ...prev,
                currentPrintingSheet: currentSheet,
                printProgress: progress,
              }
            : null
        );
        currentSheet++;
      } else {
        clearInterval(interval);
        playSuccessChime();
        playSolenoidUnlock();
        setActiveBatchJob((prev) =>
          prev
            ? {
                ...prev,
                printStatus: 'ready_for_pickup',
                printProgress: 100,
                currentPrintingSheet: totalSheetsToPrint,
                completedAt: 'Just now',
              }
            : null
        );
        setIsDrawerUnlocked(true);

        // Deduct paper from kiosk
        setKiosks((prev) =>
          prev.map((k) => {
            if (k.id === selectedKioskId) {
              const newCount = Math.max(0, k.paperTrayA4.current - totalSheetsToPrint);
              return {
                ...k,
                paperTrayA4: { ...k.paperTrayA4, current: newCount },
                totalJobsServed: k.totalJobsServed + 1,
              };
            }
            return k;
          })
        );
      }
    }, 600);

    return newJob;
  };

  const verifyAndUnlockDrawer = (pin: string): boolean => {
    if (!activeBatchJob) return false;
    const cleanIn = pin.replace(/[-\s]/g, '');
    const cleanPin = activeBatchJob.pickupPin.replace(/[-\s]/g, '');

    if (cleanIn === cleanPin) {
      playSolenoidUnlock();
      playSuccessChime();
      setIsDrawerUnlocked(true);
      return true;
    } else {
      playAlertSound();
      return false;
    }
  };

  const collectPrintedJob = () => {
    playSuccessChime();
    setActiveBatchJob((prev) =>
      prev
        ? {
            ...prev,
            printStatus: 'collected',
            collectedAt: 'Just now',
          }
        : null
    );
  };

  const resetToStart = () => {
    playKeyClick();
    setActiveBatchJob(null);
    setIsDrawerUnlocked(false);
    setPickupPinInput('');
    goToStep(1);
  };

  const refillPaperKiosk = (kioskId: string) => {
    playKeyClick();
    setKiosks((prev) =>
      prev.map((k) =>
        k.id === kioskId
          ? { ...k, paperTrayA4: { ...k.paperTrayA4, current: k.paperTrayA4.capacity } }
          : k
      )
    );
  };

  const replaceTonerKiosk = (kioskId: string) => {
    playKeyClick();
    setKiosks((prev) =>
      prev.map((k) =>
        k.id === kioskId
          ? { ...k, toner: { ...k.toner, black: 100, cyan: 100, magenta: 100, yellow: 100 } }
          : k
      )
    );
  };

  const value = {
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    soundOn,
    toggleSound,

    colleges,
    selectedCollege,
    setSelectedCollegeId,

    kiosks,
    selectedKiosk,
    setSelectedKioskId,

    batchFiles,
    addCustomFile,
    addPresetFile,
    removeFile,
    updateFileConfig,
    clearAllFiles,
    studentRollNo,
    setStudentRollNo,
    studentPhone,
    setStudentPhone,

    totalFilesCount,
    totalBatchPages,
    totalBatchSheets,
    totalBatchCostINR,
    maxFilesLimit,

    activeBatchJob,
    submitBatchAndPay,
    collectPrintedJob,
    resetToStart,
    pickupPinInput,
    setPickupPinInput,
    verifyAndUnlockDrawer,
    isDrawerUnlocked,
    setIsDrawerUnlocked,

    refillPaperKiosk,
    replaceTonerKiosk,
  };

  return <PrintKioskContext.Provider value={value}>{children}</PrintKioskContext.Provider>;
};

export const usePrintKiosk = () => {
  const context = useContext(PrintKioskContext);
  if (!context) {
    throw new Error('usePrintKiosk must be used within a PrintKioskProvider');
  }
  return context;
};
