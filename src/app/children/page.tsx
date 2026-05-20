import Link from "next/link";

export default function ChildrenIndex() {
  return (
    <div className="mx-auto max-w-3xl py-12">
      <h1 className="text-2xl font-bold mb-4">Children</h1>
      <p className="mb-6">Choose the view you want to open:</p>
      <div className="space-y-3">
        <Link href="/health-worker/children" className="block rounded-lg border p-4 hover:bg-gray-50">Health worker view</Link>
        <Link href="/patient-area/children" className="block rounded-lg border p-4 hover:bg-gray-50">Patient view</Link>
      </div>
    </div>
  );
}
