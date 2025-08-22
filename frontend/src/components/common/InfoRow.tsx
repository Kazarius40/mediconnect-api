type InfoRowProps = {
  label: string;
  value?: string | number;
};

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between items-center border-b border-gray-100 py-2">
      <span className="text-gray-600 font-medium">{label}:</span>
      <span className="text-gray-900">{value || '-'}</span>
    </div>
  );
}
