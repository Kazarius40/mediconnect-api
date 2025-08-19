import React from 'react';

export type EntityType = 'doctor' | 'clinic' | 'service';

export interface ConfirmModalProps {
  entity: { id: number; name: string };
  entityType: EntityType;
  onConfirm: (id: number) => void;
  onCancel: () => void;
}

const entityLabels: Record<EntityType, string> = {
  doctor: 'doctor',
  clinic: 'clinic',
  service: 'service',
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  entity,
  entityType,
  onConfirm,
  onCancel,
}) => {
  const label = entityLabels[entityType];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-400/50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Confirm deletion</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete {label} "{entity.name}"? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(entity.id)}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
