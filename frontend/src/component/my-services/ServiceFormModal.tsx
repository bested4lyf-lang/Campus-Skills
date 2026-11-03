import { useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ImagePlus, Plus, Upload, X } from "lucide-react";
import ModalShell from "./ModalShell";
import { MAX_SKILLS, SERVICE_CATEGORIES, SUGGESTED_SKILLS } from "./serviceHelpers";
import type { OwnService, ServiceFormValues } from "../../types/myServices";

interface ServiceFormModalProps {
  mode: "create" | "edit";
  initial?: OwnService;
  onClose: () => void;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
}

const MAX_DESCRIPTION = 500;
const MAX_IMAGE_MB = 5;
const IMAGE_TYPES = ["image/png", "image/jpeg"];

const labelClass = "mb-1.5 block text-sm font-semibold text-ink-900";
const inputClass =
  "h-11 w-full rounded-md border bg-surface px-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30";
const borderFor = (hasError: boolean) => (hasError ? "border-danger-600" : "border-line");

type Errors = Partial<Record<"title" | "category" | "price" | "skills" | "description" | "image", string>>;

export default function ServiceFormModal({ mode, initial, onClose, onSubmit }: ServiceFormModalProps) {
  const uid = useId();
  const titleId = `${uid}-heading`;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Media");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [skills, setSkills] = useState<string[]>(initial?.skills ?? []);
  const [skillInput, setSkillInput] = useState("");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(initial?.coverImageUrl);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fileInput = useRef<HTMLInputElement>(null);
  const blobUrl = useRef<string | null>(null);

  // Free the preview image when the modal closes
  useEffect(
    () => () => {
      if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
    },
    [],
  );

  // Remove a field's error as soon as the student starts fixing it
  function clearError(key: keyof Errors) {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  function addSkill(raw: string) {
    const skill = raw.trim().slice(0, 30);
    if (!skill) return;
    if (skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      setSkillInput("");
      return;
    }
    if (skills.length >= MAX_SKILLS) {
      setErrors((e) => ({ ...e, skills: `You can add up to ${MAX_SKILLS} skills.` }));
      return;
    }
    setSkills((prev) => [...prev, skill]);
    setSkillInput("");
    setErrors((e) => ({ ...e, skills: undefined }));
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill));
    setErrors((e) => ({ ...e, skills: undefined }));
  }

  function handleImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Use a PNG or JPG image." }));
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: `The image must be under ${MAX_IMAGE_MB} MB.` }));
      return;
    }
    if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
    blobUrl.current = URL.createObjectURL(file);
    setCoverImage(file);
    setPreview(blobUrl.current);
    setErrors((prev) => ({ ...prev, image: undefined }));
  }

  function removeImage() {
    if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
    blobUrl.current = null;
    setCoverImage(null);
    setPreview(undefined);
  }

  function validate(): Errors {
    const found: Errors = {};
    const cleanTitle = title.trim();
    const amount = Number(price.replace(/,/g, ""));

    if (cleanTitle.length < 5) found.title = "Give your service a title of at least 5 characters.";
    else if (cleanTitle.length > 80) found.title = "The title must be 80 characters or fewer.";

    if (!category) found.category = "Choose a category.";

    if (!price.trim() || !Number.isInteger(amount) || amount < 100 || amount > 1_000_000) {
      found.price = "Enter a whole-number price between ₦100 and ₦1,000,000.";
    }

    if (skills.length === 0) found.skills = "Add at least one skill.";

    const cleanDescription = description.trim();
    if (cleanDescription.length < 20) found.description = "Describe what students get (at least 20 characters).";

    return found;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError("");
    const found = validate();
    setErrors((prev) => ({ image: prev.image, ...found }));
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        category,
        price: Number(price.replace(/,/g, "")),
        skills,
        description: description.trim(),
        coverImage,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <ModalShell labelledBy={titleId} onClose={onClose} widthClass="max-w-xl">
      <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-xl font-bold">
              {mode === "create" ? "Create a new service" : "Edit service"}
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              {mode === "create"
                ? "Students will find this listing on Discover."
                : "Changes show on Discover straight away."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-9 shrink-0 items-center justify-center rounded-md border border-line text-ink-700 hover:bg-surface-subtle"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor={`${uid}-title`} className={labelClass}>
              Service title
            </label>
            <input
              id={`${uid}-title`}
              data-autofocus
              type="text"
              value={title}
              maxLength={80}
              placeholder="e.g. Flyer & poster design"
              aria-invalid={errors.title ? true : undefined}
              onChange={(e) => {
                setTitle(e.target.value);
                clearError("title");
              }}
              className={`${inputClass} ${borderFor(!!errors.title)}`}
            />
            {errors.title && <p className="mt-1.5 text-sm text-danger-600">{errors.title}</p>}
          </div>

          {/* Category + price */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={`${uid}-category`} className={labelClass}>
                Category
              </label>
              <select
                id={`${uid}-category`}
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  clearError("category");
                }}
                className={`${inputClass} ${borderFor(!!errors.category)}`}
              >
                {SERVICE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1.5 text-sm text-danger-600">{errors.category}</p>}
            </div>

            <div>
              <label htmlFor={`${uid}-price`} className={labelClass}>
                Starting price
              </label>
              <div
                className={`flex h-11 overflow-hidden rounded-md border bg-surface focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-500/30 ${borderFor(!!errors.price)}`}
              >
                <span className="flex w-10 items-center justify-center bg-surface-subtle text-sm font-semibold text-ink-700">
                  ₦
                </span>
                <input
                  id={`${uid}-price`}
                  type="text"
                  inputMode="numeric"
                  value={price}
                  placeholder="5000"
                  aria-invalid={errors.price ? true : undefined}
                  onChange={(e) => {
                    setPrice(e.target.value.replace(/[^\d,]/g, ""));
                    clearError("price");
                  }}
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
                />
              </div>
              {errors.price && <p className="mt-1.5 text-sm text-danger-600">{errors.price}</p>}
            </div>
          </div>

          {/* Skills */}
          <div>
            <label htmlFor={`${uid}-skill`} className={labelClass}>
              Skills <span className="font-normal text-ink-500">(up to {MAX_SKILLS})</span>
            </label>

            {skills.length > 0 && (
              <ul className="mb-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-1.5 rounded-full bg-brand-50 py-1 pl-3 pr-1.5 text-sm font-medium text-brand-700"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      className="flex size-5 items-center justify-center rounded-full hover:bg-brand-100"
                    >
                      <X aria-hidden="true" className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex gap-2">
              <input
                id={`${uid}-skill`}
                type="text"
                value={skillInput}
                placeholder="Type a skill, then press Add"
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Enter adds the skill, it must not submit the form
                    addSkill(skillInput);
                  }
                }}
                className={`${inputClass} ${borderFor(!!errors.skills)}`}
              />
              <button
                type="button"
                onClick={() => addSkill(skillInput)}
                className="shrink-0 rounded-md border border-brand-200 px-4 text-sm font-semibold text-brand-700 hover:bg-brand-50"
              >
                Add
              </button>
            </div>
            {errors.skills && <p className="mt-1.5 text-sm text-danger-600">{errors.skills}</p>}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm text-ink-500">Suggested:</span>
              {SUGGESTED_SKILLS.map((s) => {
                const chosen = skills.some((x) => x.toLowerCase() === s.toLowerCase());
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={chosen}
                    onClick={() => addSkill(s)}
                    className={`rounded-full border px-3 py-1 text-sm font-medium ${
                      chosen
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-line text-ink-900 hover:bg-surface-subtle"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor={`${uid}-description`} className={labelClass}>
              Description
            </label>
            <textarea
              id={`${uid}-description`}
              value={description}
              maxLength={MAX_DESCRIPTION}
              rows={4}
              placeholder="What do students get? Mention turnaround time, what's included and how many revisions."
              aria-invalid={errors.description ? true : undefined}
              onChange={(e) => {
                setDescription(e.target.value);
                clearError("description");
              }}
              className={`w-full resize-y rounded-md border bg-surface px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${borderFor(!!errors.description)}`}
            />
            <div className="mt-1.5 flex items-start justify-between gap-3">
              <p className="text-sm text-danger-600">{errors.description}</p>
              <p className="shrink-0 text-xs text-ink-500">
                {description.length} / {MAX_DESCRIPTION}
              </p>
            </div>
          </div>

          {/* Cover image */}
          <div>
            <p className={labelClass}>
              Cover image <span className="font-normal text-ink-500">(16:9, optional)</span>
            </p>
            <input
              ref={fileInput}
              type="file"
              hidden
              accept="image/png,image/jpeg"
              onChange={handleImage}
              aria-label="Upload a cover image"
            />

            {preview ? (
              <div className="relative overflow-hidden rounded-lg border border-line">
                <img src={preview} alt="Cover preview" className="aspect-video w-full object-cover" />
                <div className="absolute right-2 top-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-ink-900 shadow-card hover:bg-surface-subtle"
                  >
                    <ImagePlus aria-hidden="true" className="size-3.5" /> Replace
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-danger-600 shadow-card hover:bg-danger-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="flex aspect-video w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-ink-400 bg-surface-muted text-center hover:bg-brand-50"
              >
                <Upload aria-hidden="true" className="size-6 text-brand-600" />
                <span className="text-sm font-semibold text-ink-900">Upload a cover image</span>
                <span className="text-xs text-ink-500">PNG or JPG, 16:9, up to {MAX_IMAGE_MB} MB</span>
              </button>
            )}
            {errors.image && <p className="mt-1.5 text-sm text-danger-600">{errors.image}</p>}
          </div>
        </div>

        {submitError && (
          <p role="alert" className="mt-4 text-sm font-medium text-danger-600">
            {submitError}
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-surface-subtle disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {!submitting && mode === "create" && <Plus aria-hidden="true" className="size-4" />}
            {submitting ? "Saving…" : mode === "create" ? "Create service" : "Save changes"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}