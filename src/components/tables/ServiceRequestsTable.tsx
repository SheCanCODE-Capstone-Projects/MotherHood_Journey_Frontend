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
  pending: "bg-amber-100 text-amber-800",
  in_progress: "bg-sky-100 text-sky-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800",
};

export function ServiceRequestsTable({ requests }: ServiceRequestsTableProps) {
  const rows = [...requests]
    .sort((a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="overflow-hidden rounded-3xl border border-[#E0ECEA] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-[#F8FCFB] text-xs uppercase tracking-[0.16em] text-[#4B6F6D]">
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
              <tr key={request.id} className="hover:bg-[#F4FBFA]">
                <td className="px-4 py-4 font-medium text-[#1D5052]">{request.id}</td>
                <td className="px-4 py-4 text-[#54797C]">{request.patientName}</td>
                <td className="px-4 py-4 text-[#54797C]">{request.type}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}>
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
