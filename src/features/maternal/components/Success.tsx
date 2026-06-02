"use client";

import React, { useState } from "react";
import { Printer, CheckCircle, Copy, Baby, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { createPregnancy } from "@/lib/api/pregnancies";

function calcEdd(lmp: string): string {
  const d = new Date(lmp);
  d.setDate(d.getDate() + 280);
  return d.toISOString().split("T")[0];
}

interface SuccessProps {
  healthId: string;
  motherId: string;
  facilityId: string;
  firstName: string;
  lastName: string;
  onNewRegistration: () => void;
}

export function MotherRegistrationSuccess({
  healthId,
  motherId,
  facilityId,
  firstName,
  lastName,
  onNewRegistration,
}: SuccessProps) {
  const [copied, setCopied] = useState(false);
  const [showPregnancy, setShowPregnancy] = useState(false);
  const [lmpDate, setLmpDate] = useState("");
  const [gravida, setGravida] = useState(1);
  const [para, setPara] = useState(0);
  const [pregLoading, setPregLoading] = useState(false);
  const [pregSuccess, setPregSuccess] = useState(false);
  const [pregError, setPregError] = useState<string | null>(null);

  const handlePrint = () => {
    const w = window.open("", "", "height=400,width=600");
    if (!w) return;
    w.document.write(`
      <html><head><title>Health ID — ${firstName} ${lastName}</title>
      <style>
        body{font-family:Arial,sans-serif;text-align:center;padding:40px}
        .box{max-width:500px;margin:0 auto;border:2px solid #1D5052;padding:30px;border-radius:12px}
        .lbl{font-size:18px;color:#555;margin-bottom:16px}
        .id{font-size:44px;font-weight:bold;color:#1D5052;letter-spacing:4px;font-family:monospace;margin:20px 0}
        .name{font-size:20px;color:#333;margin:16px 0}
        .foot{font-size:12px;color:#999;margin-top:28px}
      </style></head>
      <body><div class="box">
        <div class="lbl">Motherhood Journey — Health ID</div>
        <div class="name">${firstName} ${lastName}</div>
        <div class="id">${healthId}</div>
        <div class="foot">Present this ID at every health visit</div>
      </div></body></html>
    `);
    w.document.close();
    w.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(healthId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegisterPregnancy = async () => {
    if (!lmpDate) {
      setPregError("Please enter the Last Menstrual Period date.");
      return;
    }
    setPregError(null);
    setPregLoading(true);
    try {
      const edd = calcEdd(lmpDate);
      await createPregnancy({
        motherId,
        facilityId: facilityId || "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        lmpDate,
        edd,
        gravida,
        para,
      });
      setPregSuccess(true);
    } catch (err: any) {
      setPregError(err?.message || "Failed to register pregnancy. Please try again.");
    } finally {
      setPregLoading(false);
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">

      {/* ── Success header ── */}
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
          <CheckCircle className="h-10 w-10 text-teal-600" />
        </div>
        <h2 className="mt-3 text-2xl font-bold text-gray-900">Registered Successfully!</h2>
        <p className="mt-1 text-sm text-gray-500">
          {firstName} {lastName} is now enrolled in the maternal health system.
        </p>
      </div>

      {/* ── Health ID card ── */}
      <div className="rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
          Unique Health ID
        </p>
        <p className="mt-3 font-mono text-4xl font-bold tracking-widest text-teal-800">
          {healthId}
        </p>
        <p className="mt-2 text-xs text-gray-500">
          This ID is used at every clinic visit — keep it safe.
        </p>
      </div>

      {/* ── Action buttons ── */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Printer className="h-4 w-4" />
          Print Card
        </button>
        <button
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Copy className="h-4 w-4" />
          {copied ? "Copied!" : "Copy ID"}
        </button>
      </div>

      {/* ── Pregnancy registration ── */}
      {!pregSuccess ? (
        <div className="rounded-xl border border-teal-200 bg-teal-50/50">
          <button
            type="button"
            onClick={() => setShowPregnancy((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600">
                <Baby className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-teal-900">Register Pregnancy</p>
                <p className="text-xs text-teal-700">Recommended next step</p>
              </div>
            </div>
            {showPregnancy ? (
              <ChevronUp className="h-5 w-5 text-teal-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-teal-600" />
            )}
          </button>

          {showPregnancy && (
            <div className="border-t border-teal-200 px-5 pb-5 pt-4 space-y-4">
              {pregError && (
                <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">
                  {pregError}
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Menstrual Period (LMP) <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={lmpDate}
                  onChange={(e) => setLmpDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                {lmpDate && (
                  <p className="mt-1 text-xs text-gray-500">
                    Estimated Due Date: <strong>{calcEdd(lmpDate)}</strong>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gravida (total pregnancies)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={gravida}
                    onChange={(e) => setGravida(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Para (previous live births)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={para}
                    onChange={(e) => setPara(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleRegisterPregnancy}
                disabled={pregLoading || !lmpDate}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
              >
                {pregLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Saving…</>
                ) : (
                  <>Register Pregnancy</>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-emerald-900">Pregnancy Registered</p>
            <p className="text-xs text-emerald-700">ANC visits and reminders will be scheduled.</p>
          </div>
        </div>
      )}

      {/* ── Important note ── */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <p className="font-semibold">Next steps for {firstName}:</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5 text-xs">
          <li>Schedule the first ANC visit within 12 weeks</li>
          <li>NIDA verification runs automatically in the background</li>
          <li>Health worker can track progress from the mothers list</li>
        </ul>
      </div>

      <button
        onClick={onNewRegistration}
        className="w-full rounded-full border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
      >
        Register Another Mother
      </button>
    </div>
  );
}
