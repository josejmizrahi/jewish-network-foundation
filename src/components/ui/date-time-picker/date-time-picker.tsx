"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DateTimePickerProps {
  date: Date
  setDate: (date: Date) => void
  disabled?: (date: Date) => boolean
}

export function DateTimePicker({
  date,
  setDate,
  disabled,
}: DateTimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null)
  const hourRef = React.useRef<HTMLInputElement>(null)

  const [selectedDate, setSelectedDate] = React.useState<Date>(date)
  const [hour, setHour] = React.useState<string>(format(date, "HH"))
  const [minute, setMinute] = React.useState<string>(format(date, "mm"))

  // Update the date when the time changes
  React.useEffect(() => {
    const newDate = new Date(selectedDate)
    newDate.setHours(parseInt(hour), parseInt(minute))
    setDate(newDate)
  }, [hour, minute, selectedDate, setDate])

  // Update the time inputs when the date changes
  React.useEffect(() => {
    setSelectedDate(date)
    setHour(format(date, "HH"))
    setMinute(format(date, "mm"))
  }, [date])

  const handleTimeChange = (value: string, type: "hour" | "minute") => {
    let numValue = parseInt(value)
    if (isNaN(numValue)) return

    if (type === "hour") {
      if (numValue > 23) numValue = 23
      if (numValue < 0) numValue = 0
      setHour(numValue.toString().padStart(2, "0"))
      if (value.length === 2) minuteRef.current?.focus()
    }

    if (type === "minute") {
      if (numValue > 59) numValue = 59
      if (numValue < 0) numValue = 0
      setMinute(numValue.toString().padStart(2, "0"))
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP HH:mm") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={disabled}
          initialFocus
        />
        <div className="border-t border-border p-3 space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Input
              ref={hourRef}
              value={hour}
              onChange={(e) => handleTimeChange(e.target.value, "hour")}
              type="number"
              min={0}
              max={23}
              className="w-[4rem]"
            />
            <span className="text-sm">:</span>
            <Input
              ref={minuteRef}
              value={minute}
              onChange={(e) => handleTimeChange(e.target.value, "minute")}
              type="number"
              min={0}
              max={59}
              className="w-[4rem]"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}