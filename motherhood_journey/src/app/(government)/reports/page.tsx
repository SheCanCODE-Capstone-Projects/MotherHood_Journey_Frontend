'use client';

import React, { useState } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import { useGenerateReport } from '../../../hooks/useReports';
import { GeoLocationSelect } from '../../../components/forms/GeoLocationSelect';
import type { ReportType, PeriodType, ScopeLevel } from '../../../lib/api/government';

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('VACCINATION_COVERAGE');
  const [periodType, setPeriodType] = useState<PeriodType>('MONTH');
  const [periodDate, setPeriodDate] = useState('');
  const [scopeLevel, setScopeLevel] = useState<ScopeLevel>('NATIONAL');
  const [geoLocation, setGeoLocation] = useState({
    provinceId: '',
    districtId: '',
    sectorId: '',
  });

  const { mutate: generateReport, isPending, isSuccess, data } = useGenerateReport();

  const handleGenerate = () => {
    if (!periodDate) {
      alert('Please select a period date');
      return;
    }

    if ((scopeLevel === 'PROVINCE' || scopeLevel === 'DISTRICT' || scopeLevel === 'SECTOR') && !geoLocation.provinceId) {
      alert('Please select a location');
      return;
    }

    generateReport({
      reportType,
      periodType,
      periodDate,
      scopeLevel,
      ...(scopeLevel !== 'NATIONAL' && {
        provinceId: geoLocation.provinceId,
        districtId: geoLocation.districtId,
        sectorId: geoLocation.sectorId,
      }),
    });
  };

  const handleGeoChange = (location: { provinceId?: string; districtId?: string; sectorId?: string; sectorName?: string; } ) => {
    setGeoLocation(prev => ({
      ...prev,
      provinceId: location.provinceId || prev.provinceId,
      districtId: location.districtId || prev.districtId,
      sectorId: location.sectorId || prev.sectorId,
    }));
  };

  const getMaxGeoLevel = (): 'province' | 'district' | 'sector' | 'cell' | 'village' => {
    switch (scopeLevel) {
      case 'PROVINCE':
        return 'province';
      case 'DISTRICT':
        return 'district';
      case 'SECTOR':
        return 'sector';
      default:
        return 'village';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Generate Reports</h1>
          <p className="text-sm text-gray-600 mt-1">Generate health statistics and analytics reports</p>
        </div>

        {/* Report Generation Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="space-y-6">
            {/* Report Type Selector */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="VACCINATION_COVERAGE">Vaccination Coverage</option>
                <option value="ANC_ATTENDANCE">ANC Attendance</option>
                <option value="BIRTH_REGISTRATION">Birth Registration</option>
                <option value="MATERNAL_HEALTH">Maternal Health</option>
              </select>
            </div>

            {/* Period Selector */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                  Period Type
                </label>
                <select
                  value={periodType}
                  onChange={(e) => setPeriodType(e.target.value as PeriodType)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="MONTH">Month</option>
                  <option value="QUARTER">Quarter</option>
                  <option value="YEAR">Year</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                  Period Date
                </label>
                <input
                  type="date"
                  value={periodDate}
                  onChange={(e) => setPeriodDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            {/* Scope Level Selector */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                Scope Level
              </label>
              <select
                value={scopeLevel}
                onChange={(e) => {
                  setScopeLevel(e.target.value as ScopeLevel);
                  setGeoLocation({ provinceId: '', districtId: '', sectorId: '' });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="NATIONAL">National</option>
                <option value="PROVINCE">Province</option>
                <option value="DISTRICT">District</option>
                <option value="SECTOR">Sector</option>
              </select>
            </div>

            {/* Geo Location Selector (conditional) */}
            {scopeLevel !== 'NATIONAL' && (
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                  Location
                </label>
                <GeoLocationSelect
                  maxLevel={getMaxGeoLevel()}
                  onChange={handleGeoChange}
                  value={geoLocation}
                />
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isPending}
              className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Message */}
        {isSuccess && data && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-900">Report Generated Successfully</p>
                <p className="text-sm text-green-700 mt-1">
                  Report ID: {data.reportId}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Generated at: {new Date(data.generatedAt).toLocaleString()}
                </p>
                <a
                  href={data.reportUrl}
                  download
                  className="inline-flex items-center gap-2 mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Report Description */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Types</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Vaccination Coverage</h3>
              <p className="text-sm text-gray-600 mt-1">
                Tracks vaccination rates across different age groups and regions
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">ANC Attendance</h3>
              <p className="text-sm text-gray-600 mt-1">
                Monitors antenatal care visit attendance and compliance rates
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Birth Registration</h3>
              <p className="text-sm text-gray-600 mt-1">
                Analyzes birth registration statistics and timelines
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Maternal Health</h3>
              <p className="text-sm text-gray-600 mt-1">
                Comprehensive maternal health indicators and outcomes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
