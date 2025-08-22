import { formatDate } from '@/utils/common/format-date.util';

type EntityDatesProps = {
  createdAt?: string;
  updatedAt?: string;
};

export function EntityDates({ createdAt, updatedAt }: EntityDatesProps) {
  return (
    <>
      {createdAt && (
        <p>
          <strong>Created:</strong> {formatDate(createdAt)}
        </p>
      )}
      {updatedAt && (
        <p>
          <strong>Updated:</strong> {formatDate(updatedAt)}
        </p>
      )}
    </>
  );
}
