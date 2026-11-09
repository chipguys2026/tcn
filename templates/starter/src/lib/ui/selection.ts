export type SelectionProps =
  | {
      type: 'single'
      value?: string
      defaultValue?: string
      onValueChange?: (value: string) => void
    }
  | {
      type: 'multiple'
      value?: string[]
      defaultValue?: string[]
      onValueChange?: (value: string[]) => void
    }
