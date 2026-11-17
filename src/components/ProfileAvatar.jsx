const avatarColors = {
  student: { background: '#e0e7ff', skin: '#d99b72', hair: '#49352a', clothing: '#4f46e5' },
  teacher: { background: '#dcfce7', skin: '#bd805e', hair: '#302b28', clothing: '#059669' },
  admin: { background: '#f3e8ff', skin: '#e0a57b', hair: '#3d302a', clothing: '#7c3aed' },
}

const ProfileAvatar = ({ name, role = 'student', size = 'h-10 w-10' }) => {
  const colors = avatarColors[role] ?? avatarColors.student

  return (
    <svg
      role="img"
      aria-label={`${name || role} profile picture`}
      viewBox="0 0 64 64"
      className={`${size} shrink-0 rounded-full ring-2 ring-white`}
    >
      <circle cx="32" cy="32" r="32" fill={colors.background} />
      <path d="M10 64c1.8-13.6 9.8-21 22-21s20.2 7.4 22 21" fill={colors.clothing} />
      <path d="M25 39h14v11c-3.8 3.2-10.2 3.2-14 0V39Z" fill={colors.skin} />
      <path d="M18 29c0-12 5.4-19 14-19s14 7 14 19v4c0 10-6.1 16-14 16s-14-6-14-16v-4Z" fill={colors.skin} />
      <path d="M17 29c-.6-13 5.1-21 15.2-21 9.3 0 15.6 6.7 14.8 20-2.2-1.6-4-4.9-4.8-8.2-5.8 3.8-14.9 5.8-24.8 5.1L17 29Z" fill={colors.hair} />
      <path d="M23 32h.2m17.6 0h.2" stroke="#382a24" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M28 39c2.4 1.8 5.6 1.8 8 0" fill="none" stroke="#8f4e42" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export default ProfileAvatar
