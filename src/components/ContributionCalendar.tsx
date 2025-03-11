"use client"
import { format, isFirstDayOfMonth, startOfWeek, addDays, differenceInDays } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ContributionCalendarProps {
  displayRange: Date[]
  selectedDates: string[]
  onToggleDate: (date: string) => void
}

export function ContributionCalendar({ displayRange, selectedDates, onToggleDate }: ContributionCalendarProps) {
  const generateWeeks = () => {
    if (!displayRange || displayRange.length !== 2) return []
    const [start, end] = displayRange
    const totalDays = differenceInDays(end, start) + 1
    const totalWeeks = Math.ceil(totalDays / 7)

    const startOfWeekDate = startOfWeek(start, { weekStartsOn: 0 })

    const weeks = []
    for (let i = 0; i < totalWeeks; i++) {
      const week = []
      for (let j = 0; j < 7; j++) {
        const date = addDays(startOfWeekDate, i * 7 + j)
        const dateString = format(date, "yyyy-MM-dd")
        const isSelected = selectedDates.includes(dateString)

        week.push({
          date,
          dateString,
          isSelected,
          isInRange: date >= start && date <= end,
          isFirstDayOfMonth: isFirstDayOfMonth(date),
        })
      }
      weeks.push(week)
    }

    return weeks
  }

  const weeks = generateWeeks()

  const getMonthLabels = () => {
    if (!weeks.length) return []

    const monthLabels = []

    const allDays = weeks.flat()

    for (let i = 0; i < allDays.length; i++) {
      const day = allDays[i]

      if (day.isFirstDayOfMonth) {
        const weekIndex = Math.floor(i / 7)
        const dayIndex = i % 7
        const position = weekIndex + dayIndex / 7

        monthLabels.push({
          month: format(day.date, "MMM"),
          position: Math.floor(position),
        })
      }
    }

    return monthLabels
  }

  const monthLabels = getMonthLabels()

  const getContributionColor = (isSelected: boolean, isInRange: boolean) => {
    if (!isInRange) return "bg-transparent"
    if (isSelected) return "bg-emerald-500 dark:bg-emerald-500"
    return "bg-gray-100 dark:bg-gray-800"
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <p className="text-sm text-muted-foreground mb-4">
        Click on dates to select or deselect them for your time travel commits.
      </p>

      <div className="flex flex-col min-w-3xl">
        <div className="relative flex text-xs text-muted-foreground mb-5 ml-10">
          {monthLabels.map((label, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${label.position * 12 + (label.position - 2 ) * 2}px`,
              }}
            >
              {label.month}
            </div>
          ))}
        </div>

        <div className="flex">
          <div className="flex flex-col justify-evenly h-[104px] text-xs text-muted-foreground mr-2 pb-2">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          <div className="flex gap-[2px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[2px]">
                {week.map((day, dayIndex) => (
                  <TooltipProvider key={dayIndex} delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`w-3 h-3 rounded-[4px] ${getContributionColor(
                            day.isSelected,
                            day.isInRange,
                          )} hover:ring-1 hover:ring-gray-400`}
                          onClick={() => day.isInRange && onToggleDate(day.dateString)}
                          disabled={!day.isInRange}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <div>
                          {!day.isInRange ? (
                            <>Outside selected range</>
                          ) : day.isSelected ? (
                            <>
                              Selected for commit on {format(day.date, "MMM d, yyyy")}
                              <br />
                              Click to remove
                            </>
                          ) : (
                            <>
                              Not selected on {format(day.date, "MMM d, yyyy")}
                              <br />
                              Click to select for commit
                            </>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center mt-4 text-xs text-muted-foreground">
          <span className="mr-2">Not Selected</span>
          <div className={`w-3 h-3 rounded-[4px] bg-gray-100 dark:bg-gray-800 mr-4`}></div>
          <span className="mr-2">Selected</span>
          <div className={`w-3 h-3 rounded-[4px] bg-emerald-500 dark:bg-emerald-500 mr-1`}></div>
        </div>
      </div>
    </div>
  )
}
