import './style.css';

type InfoRowProps = {
  label: string;
  value?: string | number;
};

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="info-row">
      <span className="info-label">{label}:</span>
      <span className="info-value">{value || '-'}</span>
    </div>
  );
}
