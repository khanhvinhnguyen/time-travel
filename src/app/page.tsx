"use client"
import { useState } from "react"
import { subYears } from "date-fns"
import type { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/DateRangePicker"
import { ContributionCalendar } from "@/components/ContributionCalendar"
import { CodeDialog } from "@/components/CodeDialog"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export default function Home() {
  const today = new Date()
  const oneYearAgo = subYears(today, 1)

  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<DateRange>({
    from: oneYearAgo,
    to: today,
  })

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range || { from: undefined, to: undefined });
  };

  const handleToggleDate = (dateString: string) => {
    if (selectedDates.includes(dateString)) {
      setSelectedDates(selectedDates.filter((d) => d !== dateString))
    } else {
      setSelectedDates([...selectedDates, dateString])
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between max-w-5xl mx-auto">
          {/* Date Range Picker */}
          <DateRangePicker dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />

          {/* Code Dialog */}
          <CodeDialog selectedDates={selectedDates} />
        </div>

        {/* Contribution Calendar */}
        {dateRange.from && dateRange.to && (
          <ContributionCalendar 
            displayRange={[dateRange.from, dateRange.to]} 
            selectedDates={selectedDates} 
            onToggleDate={handleToggleDate} 
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

