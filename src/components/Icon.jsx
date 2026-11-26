const iconPaths = {
  'arrow-up-right': (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  bookmark: (
    <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4z" />
  ),
  inbox: (
    <>
      <path d="M4.5 4.75h15l2 9.5V19a1.5 1.5 0 0 1-1.5 1.5h-16A1.5 1.5 0 0 1 2.5 19v-4.75z" />
      <path d="M2.5 14.25h5l1.5 2h6l1.5-2h5" />
    </>
  ),
  link: (
    <>
      <path d="M10 13.5a4 4 0 0 0 5.66 0l3-3A4 4 0 0 0 13 4.84l-1.72 1.72" />
      <path d="M14 10.5a4 4 0 0 0-5.66 0l-3 3A4 4 0 0 0 11 19.16l1.72-1.72" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  star: (
    <path d="m12 3.75 2.57 5.2 5.74.84-4.15 4.05.98 5.72L12 16.86l-5.14 2.7.98-5.72L3.7 9.79l5.74-.84z" />
  ),
  trash: (
    <>
      <path d="M4.5 7h15" />
      <path d="M10 10.5v6M14 10.5v6" />
      <path d="m6 7 .75 13h10.5L18 7M9 7V4h6v3" />
    </>
  ),
  x: <path d="m6 6 12 12M18 6 6 18" />,
}

function Icon({ name, size = 18, ...props }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {iconPaths[name]}
    </svg>
  )
}

export default Icon
