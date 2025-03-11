"use client"

import { useState } from "react"
import { format, subYears, addDays, differenceInDays, startOfWeek, isFirstDayOfMonth } from "date-fns"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Code } from "lucide-react"
import { DateRangePicker } from "./DateRangePicker"
import type { DateRange } from "react-day-picker"
import { Footer } from "./Footer"
import { Header } from "./Header"

export default function GitHubTimeTravel() {
  const today = new Date()
  const oneYearAgo = subYears(today, 1)

  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<DateRange>({
    from: oneYearAgo,
    to: today,
  })
  const [codeDialogOpen, setCodeDialogOpen] = useState(false)

  const generateWeeks = () => {
    if (!dateRange?.from || !dateRange?.to) return []

    const start = dateRange.from
    const end = dateRange.to
    const totalDays = differenceInDays(end, start) + 1
    const totalWeeks = Math.ceil(totalDays / 7)

    const startOfWeekDate = startOfWeek(start, { weekStartsOn: 1 })

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

  const toggleDateSelection = (dateString: string) => {
    if (selectedDates.includes(dateString)) {
      setSelectedDates(selectedDates.filter((d) => d !== dateString))
    } else {
      setSelectedDates([...selectedDates, dateString])
    }
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setDateRange(range)
    }
  }

  const generateBashScript = () => {
    const formattedDates = selectedDates.map((date) => date)

    return `#!/bin/bash

# Initialize repo if not already exists
# git init

# Set up Git user
git config user.name "username"
git config user.email "email@example.com"

# List of commit dates selected from dateRangePicker
dates=(${formattedDates.map((date) => `"${date}"`).join(" ")})

# Loop through each date and create commit
for date in "\${dates[@]}"; do
  echo "Commit for $date" >> README.md
  git add README.md
  GIT_COMMITTER_DATE="$date 12:00:00" git commit --date="$date 12:00:00" -m "Commit on $date"
done

# Push commit to GitHub (replace <your-repo-url> with your repo link)
git branch -M main
git push -u origin main
`
  }

  const getContributionColor = (isSelected: boolean, isInRange: boolean) => {
    if (!isInRange) return "bg-transparent"
    if (isSelected) return "bg-emerald-500 dark:bg-emerald-500"
    return "bg-gray-100 dark:bg-gray-800"
  }

  return (
    <>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between max-w-5xl mx-auto">
          {/* Date Range Picker */}
          <DateRangePicker dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />

          {/* Code Dialog */}
          <Dialog open={codeDialogOpen} onOpenChange={setCodeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Code className="mr-2 h-4 w-4" />
                Generate Code
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Bash Script for Selected Dates</DialogTitle>
              </DialogHeader>
              <div className="bg-muted p-4 rounded-md overflow-auto">
                <pre className="text-sm">{generateBashScript()}</pre>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                This script will create backdated commits for each selected date.
              </p>
            </DialogContent>
          </Dialog>
        </div>

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
                    left: `${label.position * (12 + 2)}px`,
                  }}
                >
                  {label.month}
                </div>
              ))}
            </div>

            <div className="flex">
              <div className="flex flex-col justify-around h-[104px] text-xs text-muted-foreground mr-2">
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
                              onClick={() => day.isInRange && toggleDateSelection(day.dateString)}
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
      </main>

      {/* Footer */}
      <Footer />
    </>
  )
}

