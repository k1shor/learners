export const getCourseStatus = (startDate, duration) => {
  const start = new Date(`${startDate}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (today < start) return 'Upcoming'

  const durationMatch = duration.match(/(\d+)\s*(day|week|month)/i)
  const end = new Date(start)
  if (durationMatch) {
    const amount = Number(durationMatch[1])
    const unit = durationMatch[2].toLowerCase()
    if (unit === 'day') end.setDate(end.getDate() + amount)
    if (unit === 'week') end.setDate(end.getDate() + amount * 7)
    if (unit === 'month') end.setMonth(end.getMonth() + amount)
  }

  return today < end ? 'Ongoing' : 'Completed'
}