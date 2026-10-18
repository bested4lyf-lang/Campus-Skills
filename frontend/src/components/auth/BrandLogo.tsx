interface BrandLogoProps {
  variant?: 'dark' | 'light' // text colour: dark for light backgrounds, light for the navy panel
}

export default function BrandLogo({ variant = 'dark' }: BrandLogoProps) {
  return (
    <div className={`brand-logo brand-logo--${variant}`}>
      <svg className="brand-logo__mark" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
        <rect width="40" height="40" rx="10" fill="#4f46e5" />
        <circle cx="15.5" cy="20" r="7" fill="none" stroke="#f59e0b" strokeWidth="2.6" />
        <circle cx="24.5" cy="20" r="7" fill="none" stroke="#fde68a" strokeWidth="2.6" />
      </svg>
      <span className="brand-logo__text">CampusSkill</span>
    </div>
  )
}
