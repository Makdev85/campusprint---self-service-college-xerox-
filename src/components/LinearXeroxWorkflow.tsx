import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { usePrintKiosk } from '../context/PrintKioskContext';
import { PRESET_DOCUMENTS, calculateFileCost } from '../utils/mockData';
import {
  Building2,
  Printer,
  Upload,
  CreditCard,
  Layers,
  CheckCircle2,
  Trash2,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  FileText,
  Sparkles,
  RefreshCw,
  Plus,
  AlertCircle,
  Unlock,
  Lock,
} from 'lucide-react';
import { playKeyClick, playSuccessChime, playAlertSound } from '../utils/audio';

export const LinearXeroxWorkflow: React.FC = () => {
  const {
    currentStep,
    goToStep,
    nextStep,
    prevStep,
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
    isDrawerUnlocked,
  } = usePrintKiosk();

  // QR Code canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copiedPin, setCopiedPin] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [fileLimitWarning, setFileLimitWarning] = useState(false);

  const collegeKiosks = kiosks.filter((k) => k.collegeId === selectedCollege.id);

  // Generate UPI QR on Step 4
  useEffect(() => {
    if (currentStep === 4 && canvasRef.current) {
      const upiUri = `upi://pay?pa=campusprint@icici&pn=CampusXerox&am=${totalBatchCostINR}&cu=INR&tn=BatchPrint-${totalFilesCount}files`;
      QRCode.toCanvas(
        canvasRef.current,
        upiUri,
        {
          width: 200,
          margin: 1.5,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (err) => {
          if (err) console.error(err);
        }
      );
    }
  }, [currentStep, totalBatchCostINR, totalFilesCount]);

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let addedCount = 0;
    for (let i = 0; i < files.length; i++) {
      if (batchFiles.length + addedCount < maxFilesLimit) {
        addCustomFile(files[i]);
        addedCount++;
      } else {
        setFileLimitWarning(true);
        setTimeout(() => setFileLimitWarning(false), 3000);
        break;
      }
    }
  };

  const handleCopyPin = (pin: string) => {
    playKeyClick();
    navigator.clipboard.writeText(pin.replace(/[-\s]/g, ''));
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handlePayAndPrint = async (method: any) => {
    playKeyClick();
    setPaymentProcessing(true);
    setTimeout(async () => {
      await submitBatchAndPay(method);
      setPaymentProcessing(false);
    }, 1200);
  };

  const handleCollect = () => {
    collectPrintedJob();
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Fallback
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* 5-Step Linear Progress Bar Header */}
      <div className="mb-8">
        <div className="grid grid-cols-5 gap-2 text-center">
          {[
            { num: 1, label: 'College' },
            { num: 2, label: 'Printer' },
            { num: 3, label: `Files (${totalFilesCount}/${maxFilesLimit})` },
            { num: 4, label: 'Payment' },
            { num: 5, label: 'Xerox Output' },
          ].map((st) => {
            const isActive = currentStep === st.num;
            const isCompleted = currentStep > st.num;
            return (
              <button
                key={st.num}
                onClick={() => {
                  // Only allow navigating back or to active
                  if (st.num <= currentStep || (st.num === 4 && totalFilesCount > 0)) {
                    goToStep(st.num as any);
                  }
                }}
                className={`flex flex-col items-center py-2.5 px-1 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#fff7ed] border-2 border-[#c84815] text-[#9a3412] font-black'
                    : isCompleted
                    ? 'bg-slate-100 border border-slate-300 text-slate-800 font-bold'
                    : 'bg-white border border-slate-200 text-slate-400 font-medium'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black mb-1 ${
                    isActive
                      ? 'bg-[#c84815] text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? '✓' : st.num}
                </div>
                <span className="text-[11px] sm:text-xs truncate w-full">{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* STEP 1: SELECT COLLEGE */}
      {/* ============================================================ */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-[#c84815] uppercase tracking-wider">
              Step 1 of 5
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Select Your College Campus
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Choose your university to locate nearby self-service Xerox kiosks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {colleges.map((col) => {
              const isSelected = selectedCollege.id === col.id;
              return (
                <div
                  key={col.id}
                  onClick={() => {
                    playKeyClick();
                    setSelectedCollegeId(col.id);
                  }}
                  className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#fff7ed] border-[#c84815] shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-base font-black text-slate-900">{col.shortCode}</div>
                      <div className="text-xs text-slate-600 font-medium mt-0.5">{col.name}</div>
                      <div className="text-xs text-slate-500 mt-2">{col.campusCity}</div>
                    </div>
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-[#c84815] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>{col.kiosksCount} Kiosks Active</span>
                    <span className="text-[#c84815]">Instant Prints Available</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={nextStep}
              className="bg-[#c84815] hover:bg-[#b03d0f] text-white font-black text-sm py-3.5 px-8 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Next: Select Campus Printer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 2: SELECT PRINTER / KIOSK */}
      {/* ============================================================ */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-[#c84815] uppercase tracking-wider">
              Step 2 of 5
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Select Printer at {selectedCollege.shortCode}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Select the Xerox kiosk where you want your papers to print.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {collegeKiosks.map((k) => {
              const isSelected = selectedKiosk.id === k.id;
              return (
                <div
                  key={k.id}
                  onClick={() => {
                    playKeyClick();
                    setSelectedKioskId(k.id);
                  }}
                  className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#fff7ed] border-[#c84815] shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-base font-black text-slate-900">{k.name}</div>
                      <div className="text-xs text-slate-600 font-medium mt-1">
                        {k.building} · {k.floor}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-[#c84815] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        ✓
                      </span>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {k.paperTrayA4.current} Sheets Ready
                    </span>
                    <span className="text-slate-600">Toner: {k.toner.black}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={prevStep}
              className="border-2 border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm py-3 px-6 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to College</span>
            </button>

            <button
              onClick={nextStep}
              className="bg-[#c84815] hover:bg-[#b03d0f] text-white font-black text-sm py-3.5 px-8 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Next: Upload Files (Max 8)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 3: UPLOAD FILES (MAXIMUM 8 AT A TIME) */}
      {/* ============================================================ */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#c84815] uppercase tracking-wider">
                Step 3 of 5
              </span>
              <span
                className={`text-xs font-black px-2.5 py-1 rounded-full ${
                  totalFilesCount >= maxFilesLimit
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-[#ffedd5] text-[#9a3412]'
                }`}
              >
                {totalFilesCount} / {maxFilesLimit} Files Added (Max 8)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Upload Files to Print
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              You can upload up to 8 files at a time. Configure pages, copies, and color per file.
            </p>
          </div>

          {/* Limit Alert */}
          {fileLimitWarning && (
            <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-lg text-xs font-bold text-rose-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Maximum 8 files reached! Remove a file if you wish to add another.</span>
            </div>
          )}

          {/* Drag & Drop Upload Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Custom file input */}
            <label className="border-2 border-dashed border-slate-300 hover:border-[#c84815] bg-slate-50 hover:bg-white rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
              <Upload className="w-7 h-7 text-[#c84815] mb-2" />
              <span className="text-sm font-black text-slate-900">
                Click or Drag Custom PDF/Word Files
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Select multiple files (up to {maxFilesLimit} maximum)
              </span>
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.ppt,.pptx"
                onChange={handleCustomFileUpload}
                disabled={totalFilesCount >= maxFilesLimit}
                className="hidden"
              />
            </label>

            {/* Quick 1-click test file buttons */}
            <div className="bg-white border-2 border-slate-200 rounded-xl p-4 flex flex-col justify-between">
              <div className="text-xs font-black text-slate-800 uppercase tracking-wide mb-2">
                Or Add 1-Click Sample College Files:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_DOCUMENTS.slice(0, 4).map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      const ok = addPresetFile(doc.id);
                      if (!ok) {
                        setFileLimitWarning(true);
                        setTimeout(() => setFileLimitWarning(false), 3000);
                      }
                    }}
                    disabled={totalFilesCount >= maxFilesLimit}
                    className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-left text-xs font-bold text-slate-800 disabled:opacity-40 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span className="truncate">{doc.title.split(' ')[0]} {doc.title.split(' ')[1]}</span>
                    <Plus className="w-3.5 h-3.5 text-[#c84815] shrink-0" />
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 mt-2 font-medium">
                Tap to quickly test batch printing without uploading your own PDF.
              </div>
            </div>
          </div>

          {/* List of Added Files (Up to 8) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                Uploaded Documents ({totalFilesCount} of {maxFilesLimit})
              </span>
              {totalFilesCount > 0 && (
                <button
                  onClick={clearAllFiles}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {batchFiles.length === 0 ? (
              <div className="p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-xs font-bold text-slate-500">
                No files uploaded yet. Add at least 1 document above to proceed.
              </div>
            ) : (
              batchFiles.map((file, index) => {
                const { subtotal, sheetsNeeded } = calculateFileCost(file);
                return (
                  <div
                    key={file.id}
                    className="p-4 bg-white border-2 border-slate-200 rounded-xl shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <div>
                          <div className="text-sm font-black text-slate-900">{file.title}</div>
                          <div className="text-xs text-slate-500 font-medium">
                            {file.pageCount} pages · {sheetsNeeded} sheets · Subtotal: <span className="font-bold text-slate-900">₹{subtotal}.00</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                        title="Remove File"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Inline print controls per file */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                      {/* B&W vs Color */}
                      <button
                        onClick={() =>
                          updateFileConfig(file.id, {
                            colorMode: file.colorMode === 'bw' ? 'color' : 'bw',
                          })
                        }
                        className={`py-1.5 px-2 rounded-md border font-bold cursor-pointer ${
                          file.colorMode === 'bw'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-[#c84815] text-white border-[#c84815]'
                        }`}
                      >
                        {file.colorMode === 'bw' ? 'B&W (₹1.5)' : 'Color (₹6.0)'}
                      </button>

                      {/* Duplex */}
                      <button
                        onClick={() =>
                          updateFileConfig(file.id, {
                            duplex: file.duplex === 'double' ? 'single' : 'double',
                          })
                        }
                        className={`py-1.5 px-2 rounded-md border font-bold cursor-pointer ${
                          file.duplex === 'double'
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-slate-100 text-slate-800 border-slate-300'
                        }`}
                      >
                        {file.duplex === 'double' ? '2-Sided (Duplex)' : '1-Sided'}
                      </button>

                      {/* Copies */}
                      <div className="flex items-center justify-between bg-slate-50 border border-slate-300 rounded-md px-2 py-1">
                        <span className="text-slate-600 font-bold">Copies:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              updateFileConfig(file.id, {
                                copies: Math.max(1, file.copies - 1),
                              })
                            }
                            className="font-black text-slate-700 hover:text-slate-950 px-1 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-black text-slate-900">{file.copies}</span>
                          <button
                            onClick={() =>
                              updateFileConfig(file.id, {
                                copies: Math.min(10, file.copies + 1),
                              })
                            }
                            className="font-black text-slate-700 hover:text-slate-950 px-1 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Staple */}
                      <select
                        value={file.binding}
                        onChange={(e) =>
                          updateFileConfig(file.id, {
                            binding: e.target.value as any,
                          })
                        }
                        className="bg-slate-50 border border-slate-300 rounded-md px-2 py-1 font-bold text-slate-800 cursor-pointer"
                      >
                        <option value="staple">Corner Stapled (+₹2)</option>
                        <option value="none">No Staple (₹0)</option>
                        <option value="spiral">Spiral Binding (+₹25)</option>
                      </select>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Student ID for pickup */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <label className="text-xs font-black text-slate-900 uppercase">
              Student Identification (for Pickup PIN SMS)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={studentRollNo}
                onChange={(e) => setStudentRollNo(e.target.value)}
                placeholder="Roll Number (e.g. 2024CSB1045)"
                className="bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-900"
              />
              <input
                type="text"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                placeholder="Phone Number for PIN"
                className="bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Total Cost Summary Card */}
          <div className="bg-[#fff7ed] border-2 border-[#c84815] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-[#9a3412] uppercase tracking-wider">
                Batch Print Order Total
              </div>
              <div className="text-xs text-slate-700 mt-0.5">
                {totalFilesCount} Files · {totalBatchPages} Pages · {totalBatchSheets} Paper Sheets
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-3xl font-black text-slate-900">
                ₹{totalBatchCostINR}.00
              </div>

              <button
                onClick={nextStep}
                disabled={totalFilesCount === 0}
                className="bg-[#c84815] hover:bg-[#b03d0f] disabled:opacity-40 text-white font-black text-sm py-3.5 px-8 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex justify-start">
            <button
              onClick={prevStep}
              className="border-2 border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm py-2.5 px-6 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Printer</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 4: PAYMENT (UPI / QR / INSTANT APPS) */}
      {/* ============================================================ */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-[#c84815] uppercase tracking-wider">
              Step 4 of 5
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Payment via UPI
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Scan the dynamic UPI QR code or tap any UPI app to authorize and print immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: QR Code Box (6 cols) */}
            <div className="md:col-span-6 bg-white border-2 border-slate-200 rounded-xl p-6 text-center flex flex-col items-center justify-center space-y-4 shadow-xs">
              <div className="text-xs font-bold text-slate-600 uppercase">
                Scan with GPay / PhonePe / Paytm / BHIM
              </div>

              <div className="p-3 bg-white border-2 border-slate-300 rounded-xl shadow-2xs">
                <canvas ref={canvasRef} className="rounded" />
              </div>

              <div className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>NPCI Verified UPI QR · Campus Xerox</span>
              </div>
            </div>

            {/* Right: Order Summary & 1-Click Pay Buttons (6 cols) */}
            <div className="md:col-span-6 space-y-4">
              <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-5 space-y-2">
                <div className="text-xs font-black text-slate-800 uppercase">
                  Order Summary
                </div>
                <div className="text-xs text-slate-600 flex justify-between">
                  <span>College Campus</span>
                  <span className="font-bold text-slate-900">{selectedCollege.shortCode}</span>
                </div>
                <div className="text-xs text-slate-600 flex justify-between">
                  <span>Printer Kiosk</span>
                  <span className="font-bold text-slate-900">{selectedKiosk.name.split(' - ')[0]}</span>
                </div>
                <div className="text-xs text-slate-600 flex justify-between">
                  <span>Total Documents</span>
                  <span className="font-bold text-slate-900">{totalFilesCount} Files</span>
                </div>
                <div className="text-xs text-slate-600 flex justify-between">
                  <span>Total Sheets</span>
                  <span className="font-bold text-slate-900">{totalBatchSheets} Sheets</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-800">Total Amount:</span>
                  <span className="text-3xl font-black text-[#c84815]">₹{totalBatchCostINR}.00</span>
                </div>
              </div>

              {/* 1-Click Apps */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">Or simulate one-click UPI payment:</div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handlePayAndPrint('gpay')}
                    disabled={paymentProcessing}
                    className="py-2.5 px-2 bg-slate-50 hover:bg-slate-100 border-2 border-slate-300 rounded-lg text-xs font-bold text-slate-800 transition-all cursor-pointer"
                  >
                    <span className="text-blue-600 font-black">Google</span> GPay
                  </button>
                  <button
                    onClick={() => handlePayAndPrint('phonepe')}
                    disabled={paymentProcessing}
                    className="py-2.5 px-2 bg-slate-50 hover:bg-slate-100 border-2 border-slate-300 rounded-lg text-xs font-bold text-slate-800 transition-all cursor-pointer"
                  >
                    <span className="text-purple-600 font-black">PhonePe</span> Instant
                  </button>
                  <button
                    onClick={() => handlePayAndPrint('paytm')}
                    disabled={paymentProcessing}
                    className="py-2.5 px-2 bg-slate-50 hover:bg-slate-100 border-2 border-slate-300 rounded-lg text-xs font-bold text-slate-800 transition-all cursor-pointer"
                  >
                    <span className="text-sky-600 font-black">Paytm</span> UPI
                  </button>
                </div>

                <button
                  onClick={() => handlePayAndPrint('upi_qr')}
                  disabled={paymentProcessing}
                  className="w-full py-4 bg-[#c84815] hover:bg-[#b03d0f] text-white font-black text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {paymentProcessing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Verifying Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Authorize Payment ₹{totalBatchCostINR}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-start pt-2">
                <button
                  onClick={prevStep}
                  className="text-xs text-slate-600 hover:text-slate-950 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Edit Files</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 5: FINAL XEROX OUTPUT */}
      {/* ============================================================ */}
      {currentStep === 5 && activeBatchJob && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Payment Completed · Job #{activeBatchJob.id}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Final Xerox Output &amp; Collection
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Your documents are printing at <span className="font-bold text-slate-900">{selectedKiosk.name}</span>.
            </p>
          </div>

          {/* Large PIN Card */}
          <div className="bg-[#ffedd5] border-2 border-[#c84815] rounded-2xl p-6 text-center space-y-2 shadow-sm">
            <div className="text-xs font-bold text-[#9a3412] uppercase tracking-wider">
              Your 6-Digit Pickup PIN (Enter at Kiosk Tray)
            </div>
            <div className="text-5xl font-black text-[#c84815] tracking-widest font-mono">
              {activeBatchJob.pickupPin}
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => handleCopyPin(activeBatchJob.pickupPin)}
                className="px-3.5 py-1.5 bg-white border border-[#fed7aa] rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
              >
                {copiedPin ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPin ? 'PIN Copied!' : 'Copy PIN'}</span>
              </button>
              <span className="text-xs text-slate-600 font-medium">
                Assigned: <span className="font-bold text-slate-900">{activeBatchJob.pickupSlot}</span>
              </span>
            </div>
          </div>

          {/* Live Mechanical Laser Printing Simulator */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#c84815]" />
                <span className="font-black text-slate-900 text-base">
                  {activeBatchJob.printStatus === 'printing'
                    ? 'Laser Engine Printing in Progress...'
                    : activeBatchJob.printStatus === 'ready_for_pickup'
                    ? 'All Sheets Printed & Deposited in Tray!'
                    : 'Job Collected!'}
                </span>
              </div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                {activeBatchJob.printProgress}% Complete
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden border border-slate-300">
              <div
                className="h-full bg-[#c84815] transition-all duration-300"
                style={{ width: `${activeBatchJob.printProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
              <span>Sheet {activeBatchJob.currentPrintingSheet} of {activeBatchJob.totalSheets}</span>
              <span>Kiosk Heated Laser Fuser 192°C</span>
            </div>
          </div>

          {/* Physical Collection Drawer Compartment */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#c84815]" />
                <span className="font-black text-slate-900 text-base">
                  {activeBatchJob.pickupSlot} Dispenser Door
                </span>
              </div>
              <div className="text-xs font-bold">
                {isDrawerUnlocked ? (
                  <span className="text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full animate-pulse flex items-center gap-1">
                    <Unlock className="w-3.5 h-3.5" />
                    <span>SERVO UNLOCKED &amp; OPEN</span>
                  </span>
                ) : (
                  <span className="text-slate-500 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>LOCKED WITH PIN</span>
                  </span>
                )}
              </div>
            </div>

            {/* The Printed Papers inside the tray */}
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-300 flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-5 bg-white border border-slate-300 rounded-lg shadow-md max-w-sm w-full text-left space-y-2 relative">
                {/* Staple simulation */}
                <div className="w-5 h-1 bg-slate-500 rounded-xs -rotate-45 absolute top-1 left-1" />
                <div className="text-xs font-black text-slate-900 uppercase">
                  Batch: {activeBatchJob.totalFiles} Documents ({activeBatchJob.totalSheets} Sheets)
                </div>
                <div className="text-xs text-slate-600">
                  {activeBatchJob.files.map((f) => f.title).join(', ')}
                </div>
                <div className="text-[11px] text-emerald-800 font-bold pt-1 border-t border-slate-100 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Warm freshly printed sheets ready in compartment</span>
                </div>
              </div>

              {activeBatchJob.printStatus !== 'collected' ? (
                <button
                  onClick={handleCollect}
                  className="py-3 px-8 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Collect My Printed Papers</span>
                </button>
              ) : (
                <div className="text-sm font-black text-emerald-800 bg-emerald-100 px-4 py-2 rounded-lg">
                  ✓ Papers Collected Successfully! Thank you.
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Receipt sent to {studentPhone}</span>
              <button
                onClick={resetToStart}
                className="text-xs font-bold text-[#c84815] hover:underline cursor-pointer"
              >
                Print Another Batch →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
