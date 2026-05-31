import { formatDistanceToNowStrict, parseISO } from "date-fns";

interface ServiceRequest {
  id: string;
  patientName: string;
  type: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
}

interface ServiceRequestsTableProps {
  requests: ServiceRequest[];
}

const statusStyles: Record<ServiceRequest["status"], string> = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  in_progress: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

export function ServiceRequestsTable({ requests }: ServiceRequestsTableProps) {
  const rows = [...requests]
    .sort((a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="overflow-hidden rounded-[8px] border border-[#D5E7E4] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-[#F7FBFA] text-xs uppercase tracking-[0.14em] text-[#4B6F6D]">
            <tr>
              <th className="px-4 py-3">Request</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9F2F1]">
            {rows.map((request) => (
              <tr key={request.id} className="transition hover:bg-[#F4FBFA]">
                <td className="px-4 py-4 font-medium text-[#1D5052]">{request.id}</td>
                <td className="px-4 py-4 text-[#54797C]">{request.patientName}</td>
                <td className="px-4 py-4 text-[#54797C]">{request.type}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-[8px] px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[request.status]}`}>
                    {request.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-4 text-[#54797C]">
                  {formatDistanceToNowStrict(parseISO(request.createdAt), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
