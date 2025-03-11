import { subDays } from "date-fns"

export function getDefaultDisplayRange(): Date[] {
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? 6 : day - 1
  const currentWeekMonday = subDays(today, diff)
  const start = subDays(currentWeekMonday, 51 * 7)
  return [start, today]
}
