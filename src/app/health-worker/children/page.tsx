import { UserPlus, Baby, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ChildrenPage() {
  const mockChildren = [
    {
      id: "child-001",
      first_name: "Amara",
      gender: "FEMALE",
      date_of_birth: "2026-04-15",
      mother_name: "Uwimana Marie",
    },
    {
      id: "child-002",
      first_name: "Ishimwe",
      gender: "MALE",
      date_of_birth: "2026-03-22",
      mother_name: "Mukamana Jeanne",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1D5052] flex items-center gap-2">
            <Baby className="h-6 w-6 text-[#2C6F73]" />
            Children
          </h1>
          <p className="mt-1 text-[#5B8784]">View and manage registered children</p>
        </div>
        <Link
          href="/children/register"
          className="flex items-center gap-2 rounded-full bg-[#2C6F73] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D5052]"
        >
          <UserPlus className="h-4 w-4" />
          Register Newborn
        </Link>
      </div>

      <div className="rounded-3xl border border-[#D5E9E6] bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D5E9E6]">
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-widest text-[#5B8784]">
                  Name
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-widest text-[#5B8784]">
                  Gender
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-widest text-[#5B8784]">
                  Date of Birth
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-widest text-[#5B8784]">
                  Mother
                </th>
                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-widest text-[#5B8784]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {mockChildren.map((child) => (
                <tr key={child.id} className="border-b border-[#D5E9E6] last:border-b-0">
                  <td className="py-4">
                    <p className="text-sm font-semibold text-[#1D5052]">{child.first_name}</p>
                    <p className="text-xs text-[#5B8784]">{child.id}</p>
                  </td>
                  <td className="py-4 text-sm text-[#1D5052]">{child.gender}</td>
                  <td className="py-4 text-sm text-[#1D5052]">
                    {new Date(child.date_of_birth + "T00:00:00").toLocaleDateString("en-RW", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4 text-sm text-[#1D5052]">{child.mother_name}</td>
                  <td className="py-4 text-right">
                    <Link
                      href={`/children/${child.id}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#2C6F73] hover:underline"
                    >
                      View
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
