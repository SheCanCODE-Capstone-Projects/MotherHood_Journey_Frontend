"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { useMotherSearch, useMothers } from "@/features/maternal/hooks/useMother";
import type { Mother, NidaStatus } from "@/features/maternal/types";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

/**
 * Badge component for NIDA status
 */
function NidaStatusBadge({ status }: { status: NidaStatus }) {
  const statusStyles: Record<NidaStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    VERIFIED: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
    MANUAL: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

/**
 * Debounced search input component
 */
function SearchInput({
  value,
  onChange,
  isLoading,
}: {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#54797C]" />
      <input
        type="text"
        placeholder="Search by health ID, name, or NID..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
        className="w-full rounded-lg border border-[#D5E9E6] bg-white py-2 pl-10 pr-4 text-sm placeholder-[#54797C] shadow-sm transition-colors focus:border-[#1D5551] focus:outline-none focus:ring-2 focus:ring-[#1D5551]/20 disabled:opacity-50"
      />
    </div>
  );
}

/**
 * Pagination controls
 */
function PaginationControls({
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
  isDisabled,
}: {
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  isDisabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-[#54797C]">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={currentPage === 1 || isDisabled}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={currentPage >= totalPages || isDisabled}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/**
 * Results table
 */
function MothersTable({
  mothers,
  isLoading,
  onRowClick,
}: {
  mothers: Mother[];
  isLoading: boolean;
  onRowClick: (mother: Mother) => void;
}) {
  if (isLoading && mothers.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-3xl border border-[#D5E9E6] bg-white">
        <p className="text-sm text-[#54797C]">Loading mothers...</p>
      </div>
    );
  }

  if (mothers.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-3xl border border-[#D5E9E6] bg-white">
        <p className="text-sm text-[#54797C]">
          No mothers found. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-[#D5E9E6] bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b border-[#D5E9E6] bg-[#F5FBFA]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
              Health ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
              NIDA Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
              Facility
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
              Registration Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#5B8784]">
              Current Pregnancy
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#D5E9E6]">
          {mothers.map((mother) => (
            <tr
              key={mother.id}
              onClick={() => onRowClick(mother)}
              className="cursor-pointer transition-colors hover:bg-[#F5FBFA]"
            >
              <td className="px-6 py-4 text-sm font-medium text-[#1D5551]">
                {mother.healthId}
              </td>
              <td className="px-6 py-4 text-sm text-[#54797C]">
                {mother.user?.name || "—"}
              </td>
              <td className="px-6 py-4">
                <NidaStatusBadge status={mother.nidaVerifiedStatus} />
              </td>
              <td className="px-6 py-4 text-sm text-[#54797C]">
                {mother.facility?.name || "—"}
              </td>
              <td className="px-6 py-4 text-sm text-[#54797C]">
                {new Date(mother.registeredAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm text-[#54797C]">
                <span
                  className={`inline-flex rounded px-2 py-1 text-xs font-medium ${
                    mother.currentPregnancyStatus === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {mother.currentPregnancyStatus === "ACTIVE"
                    ? "Pregnant"
                    : "Not Pregnant"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Mother search and list page for health workers
 */
export default function MothersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Debounce search term by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch mothers based on search term
  const { data: searchResults, isLoading: isSearching } = useMotherSearch(
    debouncedSearchTerm || undefined,
    currentPage,
    PAGE_SIZE
  );

  // Fallback to list all mothers if no search
  const { data: allMothers, isLoading: isListLoading } = useMothers(
    debouncedSearchTerm ? undefined : currentPage,
    PAGE_SIZE
  );

  // Use search results if searching, otherwise use all mothers list
  const displayData = useMemo(
    () => (debouncedSearchTerm ? searchResults : allMothers),
    [debouncedSearchTerm, searchResults, allMothers]
  );

  const isLoading = debouncedSearchTerm ? isSearching : isListLoading;
  const mothers = displayData?.content || [];
  const totalPages = displayData?.totalPages || 1;

  const handleRowClick = useCallback(
    (mother: Mother) => {
      router.push(`/dashboard/mothers/${mother.id}`);
    },
    [router]
  );

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mothers"
        subtitle="Search and manage mother health records."
      />

      <section className="rounded-3xl border border-[#D5E9E6] bg-white p-5 shadow-sm">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          isLoading={isLoading}
        />
      </section>

      <section className="space-y-4">
        <MothersTable
          mothers={mothers}
          isLoading={isLoading}
          onRowClick={handleRowClick}
        />

        {totalPages > 1 && (
          <div className="rounded-3xl border border-[#D5E9E6] bg-white p-5 shadow-sm">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
              isDisabled={isLoading}
            />
          </div>
        )}
      </section>
    </div>
  );
}
