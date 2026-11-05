import Avatar from "../ui/Avatar";

interface ProfileAvatarProps {
  id: string;
  name: string;
  /** Uploaded photo. Initials are shown when it is missing */
  photoUrl?: string;
  size?: number;
  className?: string;
}

export default function ProfileAvatar({ id, name, photoUrl, size = 96, className = "" }: ProfileAvatarProps) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt=""
        className={`shrink-0 rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return <Avatar id={id} name={name} size={size} className={className} />;
}