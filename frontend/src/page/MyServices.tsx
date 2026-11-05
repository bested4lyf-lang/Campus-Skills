import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import DeleteServiceDialog from "../component/my-services/DeleteServiceDialog";
import EmptyServices from "../component/my-services/EmptyServices";
import MyServiceCard from "../component/my-services/MyServiceCard";
import ProfileCard from "../component/my-services/ProfileCard";
import RoleCard from "../component/my-services/RoleCard";
import ServiceFormModal from "../component/my-services/ServiceFormModal";
import { useAuth } from "../hooks/useAuth";
import { useMyServices } from "../hooks/useMyServices";
import { useProfileSummary } from "../hooks/useProfileSummary";
import type { OwnService, ServiceFormValues } from "../types/myServices";

type FormState = { mode: "create" } | { mode: "edit"; service: OwnService } | null;

export default function MyServices() {
  const { user } = useAuth();
  const { services, loading, error, reload, createService, updateService, deleteService } = useMyServices();
  const summary = useProfileSummary(user);

  const [form, setForm] = useState<FormState>(null);
  const [toDelete, setToDelete] = useState<OwnService | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [notice, setNotice] = useState("");

  // Hide the success message after a few seconds
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  // My Services is only for logged-in students
  if (!user) return <Navigate to="/login" replace />;

  async function handleFormSubmit(values: ServiceFormValues) {
    if (form?.mode === "edit") {
      await updateService(form.service.id, values);
      setNotice("Your service was updated.");
    } else {
      await createService(values);
      setNotice("Your service is live. Students can now find it on Discover.");
    }
    setForm(null);
  }

  async function handleConfirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteService(toDelete.id);
      setNotice(`"${toDelete.title}" was deleted.`);
      setToDelete(null);
    } catch {
      setDeleteError("We couldn't delete this listing. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 md:py-8">
      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
        {/* Profile + roles (below the services on phones) */}
        <aside className="order-2 space-y-4 lg:sticky lg:top-20 lg:order-1">
          <ProfileCard user={user} summary={summary} servicesCount={services.length} />
          <RoleCard summary={summary} />
        </aside>

        <section aria-labelledby="my-services-title" className="order-1 min-w-0 lg:order-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 id="my-services-title" className="text-2xl font-bold md:text-3xl">
                My Services
              </h1>
              <p className="mt-1 text-sm text-ink-500">Only you can edit or delete these listings.</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ mode: "create" })}
              className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <Plus aria-hidden="true" className="size-4" />
              Create New Service
            </button>
          </div>

          {notice && (
            <div
              role="status"
              className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-success-100 bg-success-50 px-4 py-3 text-sm font-medium text-success-700"
            >
              {notice}
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss message"
                className="shrink-0 rounded p-1 hover:bg-success-100"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
          )}

          <div className="mt-6">
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2" aria-busy="true">
                {[0, 1, 2, 3].map((n) => (
                  <div key={n} className="h-72 animate-pulse rounded-xl bg-surface-subtle" />
                ))}
              </div>
            ) : error ? (
              <div role="alert" className="rounded-xl border border-danger-100 bg-danger-50 p-6 text-center">
                <p className="text-sm font-medium text-danger-800">{error}</p>
                <button
                  type="button"
                  onClick={() => void reload()}
                  className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Try again
                </button>
              </div>
            ) : services.length === 0 ? (
              <EmptyServices onCreate={() => setForm({ mode: "create" })} />
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2">
                {services.map((service) => (
                  <li key={service.id} className="flex">
                    <div className="w-full">
                      <MyServiceCard
                        service={service}
                        owner={user}
                        onEdit={(s) => setForm({ mode: "edit", service: s })}
                        onDelete={(s) => {
                          setDeleteError("");
                          setToDelete(s);
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      {form && (
        <ServiceFormModal
          mode={form.mode}
          initial={form.mode === "edit" ? form.service : undefined}
          onClose={() => setForm(null)}
          onSubmit={handleFormSubmit}
        />
      )}

      {toDelete && (
        <DeleteServiceDialog
          service={toDelete}
          busy={deleting}
          error={deleteError}
          onCancel={() => setToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}