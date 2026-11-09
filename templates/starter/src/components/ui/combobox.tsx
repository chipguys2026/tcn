import { useState } from 'react'
import { useControllable } from '@/lib/ui/use-controllable'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
export type ComboboxOption = {
  value: string
  label: string
  keywords?: readonly string[]
  disabled?: boolean
}
export function Combobox({
  options,
  value,
  defaultValue = '',
  onValueChange,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  emptyText = 'No options found.',
  disabled = false,
  width = 34,
}: {
  options: readonly ComboboxOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  width?: number
}) {
  const [selected, select] = useControllable(value, defaultValue, onValueChange)
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger
        label={placeholder}
        disabled={disabled}
      >{`${options.find((option) => option.value === selected)?.label ?? placeholder} \uf0d7`}</PopoverTrigger>
      <PopoverContent width={width} height={15}>
        <Command defaultValue={selected}>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList height={8}>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                keywords={option.keywords}
                disabled={option.disabled}
                onSelect={(next) => {
                  select(next)
                  setOpen(false)
                }}
              >
                {option.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
