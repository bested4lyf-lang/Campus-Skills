import { useId, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Upload, X } from "lucide-react";
import Modal from "../ui/Modal";
import ProfileAvatar from "./ProfileAvatar";
import { fileToAvatarDataUrl } from "./imageUtils";
import type { ProfileFormValues, StudentProfile } from "../../types/profile";

interface EditProfileModalProps {
  profile: StudentProfile;
  onClose: () => void;
  onSave: (values: ProfileFormValues) => Promise<void>;
}

const LEVELS = ["100 level", "200 level", "300 level", "400 level", "500 level"];
const PROFILE_SKILLS = [
  "Photography",
  "Video Editing",
  "Graphic Design",
  "Social Media Management",
  "Writing",
  "Tutoring",
  "Programming",
  "Web Development",
  "Hairdressing",
  "Fashion Design",
];
const MAX_BIO = 160;
const MAX_PHOTO_MB = 2;
const PHOTO_TYPES = ["image/png", "image/jpeg"];

const labelClass = "mb-1.5 block text-sm font-semibold text-ink-900";
const inputClass =
  "h-11 w-full rounded-md border bg-surface px-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30";
const borderFor = (hasError: boolean) => (hasError ? "border-danger-600" : "border-line");

/** "8035550142" -> "803 555 0142" */
const groupDigits = (digits: string) =>
  [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)].filter(Boolean).join(" ");

/** Keeps digits only and drops the leading 0 people type, because +234 already replaces it */
const cleanWhatsapp = (raw: string) => raw.replace(/\D/g, "").replace(/^0+/, "").slice(0, 10);

type Field = "department" | "level" | "whatsapp" | "skills" | "photo";
type Errors = Partial<Record<Field, string>>;

export default function EditProfileModal({ profile, onClose, onSave }: EditProfileModalProps) {
  const uid = useId();
  const titleId = `${uid}-title`;

  const [department, setDepartment] = useState(profile.department);
  const [level, setLevel] = useState(profile.level);
  const [bio, setBio] = useState(profile.bio);
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp);
  const [skills, setSkills] = useState<string[]>(profile.skills);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(profile.photoUrl);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState("");
  const [processingPhoto, setProcessingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Skills the student already has stay selectable even when they are not in the standard list
  const skillOptions = Array.from(new Set([...PROFILE_SKILLS, ...profile.skills]));

  function clearError(field: Field) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  function toggleSkill(skill: string) {
    setSkills((current) => (current.includes(skill) ? current.filter((s) => s !== skill) : [...current, skill]));
    clearError("skills");
  }

  async function handlePhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!PHOTO_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, photo: "Use a JPG or PNG image." }));
      return;
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: `The photo must be under ${MAX_PHOTO_MB} MB.` }));
      return;
    }

    setProcessingPhoto(true);
    try {
      setPhotoUrl(await fileToAvatarDataUrl(file));
      clearError("photo");
    } catch {
      setErrors((prev) => ({ ...prev, photo: "We couldn't read that image. Try another one." }));
    } finally {
      setProcessingPhoto(false);
    }
  }

  function validate(): Errors {
    const found: Errors = {};
    if (department.trim().length < 2) found.department = "Enter your department.";
    if (!level) found.level = "Choose your level.";
    if (whatsapp && !/^[789]\d{9}$/.test(whatsapp)) {
      found.whatsapp = "Enter a valid Nigerian mobile number, for example 803 555 0142.";
    }
    if (skills.length === 0) found.skills = "Pick at least one skill.";
    return found;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError("");
    const found = validate();
    setErrors((prev) => ({ photo: prev.photo, ...found }));
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
      // Keep the skills in the same order as the chips, whatever order they were picked in
      const orderedSkills = [...skills].sort((a, b) => skillOptions.indexOf(a) - skillOptions.indexOf(b));
      await onSave({ department: department.trim(), level, bio: bio.trim(), whatsapp, skills: orderedSkills, photoUrl });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "We couldn't save your profile. Please try again.");
      setSaving(false);
    }
  }

  return (
    <Modal labelledBy={titleId} onClose={onClose} widthClass="max-w-xl">
      <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-xl font-bold">
              Edit profile
            </h2>
            <p className="mt-1 text-sm text-ink-500">This is what other students see before they request a service.</p>
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

        {/* Photo */}
        <div className="mt-5 flex items-center gap-4">
          <ProfileAvatar id={profile.id} name={profile.fullName} photoUrl={photoUrl} size={72} />
          <div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                disabled={processingPhoto}
                onClick={() => fileInput.current?.click()}
                className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2 text-sm font-semibold text-ink-900 hover:bg-surface-subtle disabled:opacity-60"
              >
                <Upload aria-hidden="true" className="size-4" />
                {processingPhoto ? "Processing…" : "Upload photo"}
              </button>
              {photoUrl && (
                <button
                  type="button"
                  onClick={() => setPhotoUrl(undefined)}
                  className="text-sm font-semibold text-danger-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="mt-1.5 text-xs text-ink-500">JPG or PNG, up to {MAX_PHOTO_MB} MB</p>
          </div>
          <input
            ref={fileInput}
            type="file"
            hidden
            accept="image/png,image/jpeg"
            aria-label="Upload a profile photo"
            onChange={handlePhoto}
          />
        </div>
        {errors.photo && <p className="mt-2 text-sm text-danger-600">{errors.photo}</p>}

        <div className="mt-5 space-y-5">
          {/* Department + level */}
          <div className="grid gap-5 sm:grid-cols-[1fr_180px]">
            <div>
              <label htmlFor={`${uid}-department`} className={labelClass}>
                Department
              </label>
              <input
                id={`${uid}-department`}
                data-autofocus
                type="text"
                value={department}
                maxLength={60}
                placeholder="e.g. Mass Communication"
                aria-invalid={errors.department ? true : undefined}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  clearError("department");
                }}
                className={`${inputClass} ${borderFor(!!errors.department)}`}
              />
              {errors.department && <p className="mt-1.5 text-sm text-danger-600">{errors.department}</p>}
            </div>
            <div>
              <label htmlFor={`${uid}-level`} className={labelClass}>
                Level
              </label>
              <select
                id={`${uid}-level`}
                value={level}
                aria-invalid={errors.level ? true : undefined}
                onChange={(e) => {
                  setLevel(e.target.value);
                  clearError("level");
                }}
                className={`${inputClass} ${borderFor(!!errors.level)}`}
              >
                <option value="">Select level</option>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              {errors.level && <p className="mt-1.5 text-sm text-danger-600">{errors.level}</p>}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor={`${uid}-bio`} className={labelClass}>
              Bio
            </label>
            <textarea
              id={`${uid}-bio`}
              value={bio}
              rows={3}
              maxLength={MAX_BIO}
              placeholder="What do you do, and what are you good at?"
              onChange={(e) => setBio(e.target.value)}
              className="w-full resize-y rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
            <p className="mt-1.5 text-right text-xs text-ink-500">
              {bio.length} / {MAX_BIO}
            </p>
          </div>

          {/* WhatsApp */}
          <div>
            <label htmlFor={`${uid}-whatsapp`} className={labelClass}>
              WhatsApp number
            </label>
            <div
              className={`flex h-11 overflow-hidden rounded-md border bg-surface focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-500/30 ${borderFor(!!errors.whatsapp)}`}
            >
              <span className="flex w-16 items-center justify-center bg-surface-subtle text-sm font-semibold text-ink-700">
                +234
              </span>
              <input
                id={`${uid}-whatsapp`}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={groupDigits(whatsapp)}
                placeholder="803 555 0142"
                aria-invalid={errors.whatsapp ? true : undefined}
                aria-describedby={`${uid}-whatsapp-hint`}
                onChange={(e) => {
                  setWhatsapp(cleanWhatsapp(e.target.value));
                  clearError("whatsapp");
                }}
                className="min-w-0 flex-1 bg-transparent px-3 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
            </div>
            {errors.whatsapp && <p className="mt-1.5 text-sm text-danger-600">{errors.whatsapp}</p>}
            <p id={`${uid}-whatsapp-hint`} className="mt-1.5 text-xs text-ink-500">
              Only shared with students whose requests you accept.
            </p>
          </div>

          {/* Skills */}
          <div>
            <p id={`${uid}-skills`} className={labelClass}>
              Skills <span className="font-normal text-ink-500">({skills.length} selected)</span>
            </p>
            <div role="group" aria-labelledby={`${uid}-skills`} className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => {
                const chosen = skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    aria-pressed={chosen}
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      chosen
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-line text-ink-900 hover:bg-surface-subtle"
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
            {errors.skills && <p className="mt-1.5 text-sm text-danger-600">{errors.skills}</p>}
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
            disabled={saving}
            className="rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-surface-subtle disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || processingPhoto}
            className="rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}