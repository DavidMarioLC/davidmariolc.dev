export function PeruFlag({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="#D91023" height="16" width="8" />
      <rect fill="#FFFFFF" height="16" width="8" x="8" />
      <rect fill="#D91023" height="16" width="8" x="16" />
      <rect
        fill="none"
        height="16"
        stroke="currentColor"
        strokeOpacity="0.15"
        width="24"
      />
    </svg>
  );
}
