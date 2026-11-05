import { TriangleAlert } from "lucide-react";
import ModalShell from "./ModalShell";
import type { OwnService } from "../../types/myServices";

interface DeleteServiceDialogProps {
  service: OwnService;
  busy: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteServiceDialog({
  service,
  busy,
  error,
  onCancel,
  onConfirm,
}: DeleteServiceDialogProps) {
  return (
    <ModalShell labelledBy="delete-service-title" onClose={onCancel} widthClass="max-w-md">
      <div className="p-6">
        <span className="flex size-12 items-center justify-center rounded-full bg-danger-100 text-danger-600">
          <TriangleAlert aria-hidden="true" className="size-6" />
        </span>

        <h2 id="delete-service-title" className="mt-4 text-xl font-bold">
          Delete this service listing?
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink-500">
          Are you sure you want to delete '{service.title}'? This listing will be removed from
          search and students will no longer be able to request it. Any currently accepted jobs
          will remain active.
        </p>

        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-danger-600">
            {error}
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            data-autofocus
            onClick={onCancel}
            disabled={busy}
            className="rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-surface-subtle disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-md bg-danger-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-danger-800 disabled:opacity-60"
          >
            {busy ? "Deleting…" : "Delete Listing"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}