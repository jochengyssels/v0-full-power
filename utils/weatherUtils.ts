// Format timestamp to hour
export function timestampToHour(timestamp: string): string {
  const date = new Date(Number(timestamp) * 1000)
  return date.getHours().toString().padStart(2, "0")
}

// Format date to day name
export function formatDay(date: Date): string {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) {
    return "Today"
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow"
  } else {
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }
}
