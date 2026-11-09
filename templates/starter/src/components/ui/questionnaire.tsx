import type { BoxRenderable, Renderable } from '@opentui/core'
import { type PropsWithChildren, useRef, useState } from 'react'
import { createStrictContext } from '@/lib/ui/create-context'
import { useFocusScope } from '@/lib/ui/focus/focus-scope'
import { PartBox, PartText } from '@/lib/ui/parts'
import { useControllable } from '@/lib/ui/use-controllable'
import { Button } from './button'
import { Checkbox } from './checkbox'
import { Input } from './input'
import { questionnaireDefaults as d } from './questionnaire.styles'
import { RadioGroup, RadioGroupItem } from './radio-group'

export type QuestionnaireAnswer = { choices: string[]; text: string }
export type QuestionnaireValues = Record<string, QuestionnaireAnswer>
export type QuestionnaireQuestion = {
  name: string
  required?: boolean
  multiple?: boolean
  validate?: (answer: QuestionnaireAnswer) => string | undefined
}
const empty: QuestionnaireAnswer = { choices: [], text: '' }
const [Context, useQuestionnaire] = createStrictContext<{
  items: QuestionnaireQuestion[]
  index: number
  values: QuestionnaireValues
  errors: Record<string, string>
  answer: (name: string, value: QuestionnaireAnswer) => void
  navigate: (kind: 'previous' | 'next' | 'skip' | 'submit') => void
}>('Questionnaire')
const [Item, useItem] =
  createStrictContext<QuestionnaireQuestion>('QuestionnaireItem')
export function Questionnaire({
  children,
  items,
  value,
  defaultValue = {},
  onValueChange,
  step,
  defaultStep = 0,
  onStepChange,
  onSubmit,
}: PropsWithChildren<{
  items: QuestionnaireQuestion[]
  value?: QuestionnaireValues
  defaultValue?: QuestionnaireValues
  onValueChange?: (v: QuestionnaireValues) => void
  step?: number
  defaultStep?: number
  onStepChange?: (step: number) => void
  onSubmit?: (v: QuestionnaireValues) => void
}>) {
  if (!items.length || new Set(items.map((i) => i.name)).size !== items.length)
    throw new Error('Questionnaire requires non-empty, unique question names')
  const [values, setValues] = useControllable(
      value,
      defaultValue,
      onValueChange,
    ),
    [current, setStep] = useControllable(step, defaultStep, onStepChange),
    [errors, setErrors] = useState<Record<string, string>>({})
  const index = Math.max(0, Math.min(items.length - 1, current))
  const validate = (questions: QuestionnaireQuestion[]) => {
    const next: Record<string, string> = {}
    for (const q of questions) {
      const a = values[q.name] ?? empty
      const error =
        q.required && !a.choices.length && !a.text.trim()
          ? 'A response is required.'
          : q.validate?.(a)
      if (error) next[q.name] = error
    }
    setErrors(next)
    return !Object.keys(next).length
  }
  const navigate = (kind: 'previous' | 'next' | 'skip' | 'submit') => {
    if (kind === 'previous') setStep(Math.max(0, index - 1))
    else if (kind === 'submit') {
      if (validate(items)) onSubmit?.(values)
      else {
        const first = items.findIndex(
          (q) =>
            (q.required &&
              !(
                values[q.name]?.choices.length || values[q.name]?.text.trim()
              )) ||
            q.validate?.(values[q.name] ?? empty),
        )
        if (first >= 0) setStep(first)
      }
    } else if (
      kind === 'skip'
        ? !items[index]?.required
        : validate(items.slice(index, index + 1))
    )
      setStep(Math.min(items.length - 1, index + 1))
  }
  return (
    <Context
      value={{
        items,
        index,
        values,
        errors,
        answer: (name, a) => {
          setValues({ ...values, [name]: a })
          setErrors((old) => {
            const next = { ...old }
            delete next[name]
            return next
          })
        },
        navigate,
      }}
    >
      <PartBox
        source="questionnaire"
        part="Questionnaire"
        width="100%"
        gap={d.gap}
      >
        {children}
      </PartBox>
    </Context>
  )
}
export function QuestionnaireProgress() {
  const q = useQuestionnaire()
  return (
    <PartText
      source="questionnaire"
      part="QuestionnaireProgress"
      tone="mutedForeground"
    >{`${q.index + 1} / ${q.items.length}`}</PartText>
  )
}
export function QuestionnaireItem({
  children,
  name,
}: PropsWithChildren<{ name: string }>) {
  const q = useQuestionnaire(),
    item = q.items.find((i) => i.name === name)
  if (!item) throw new Error(`Unknown question: ${name}`)
  if (q.items[q.index]?.name !== name) return null
  return (
    <Item value={item}>
      <ActiveQuestion>{children}</ActiveQuestion>
    </Item>
  )
}
function ActiveQuestion({ children }: PropsWithChildren) {
  const scope = useFocusScope()
  const ref = useRef<BoxRenderable>(null),
    pending = useRef(true)
  const focusFirst = () => {
    if (!pending.current || !ref.current) return
    if (scope && !scope.canFocus()) return
    pending.current = false
    function first(node: Renderable): Renderable | undefined {
      if (!node.visible || node.isDestroyed) return
      if (node.focusable) return node
      for (const child of node.getChildren()) {
        const found = first(child)
        if (found) return found
      }
    }
    first(ref.current)?.focus()
  }
  return (
    <PartBox
      ref={ref}
      renderBefore={focusFirst}
      source="questionnaire"
      part="QuestionnaireItem"
      width="100%"
      gap={d.gap}
    >
      {children}
    </PartBox>
  )
}
export function QuestionnaireTitle({ children }: { children: string }) {
  return (
    <PartText source="questionnaire" part="QuestionnaireTitle" bold>
      {children}
    </PartText>
  )
}
export function QuestionnaireDescription({ children }: { children: string }) {
  return (
    <PartText
      source="questionnaire"
      part="QuestionnaireDescription"
      tone="mutedForeground"
    >
      {children}
    </PartText>
  )
}
export function QuestionnaireChoices({ children }: PropsWithChildren) {
  const q = useQuestionnaire(),
    item = useItem(),
    a = q.values[item.name] ?? empty
  return (
    <PartBox source="questionnaire" part="QuestionnaireChoices" gap={d.gap}>
      {item.multiple ? (
        children
      ) : (
        <RadioGroup
          value={a.choices[0] ?? ''}
          onValueChange={(v) => q.answer(item.name, { ...a, choices: [v] })}
        >
          {children}
        </RadioGroup>
      )}
    </PartBox>
  )
}
export function QuestionnaireChoice({
  value,
  children,
  disabled = false,
}: {
  value: string
  children: string
  disabled?: boolean
}) {
  const q = useQuestionnaire(),
    item = useItem(),
    a = q.values[item.name] ?? empty
  return (
    <PartBox source="questionnaire" part="QuestionnaireChoice">
      {item.multiple ? (
        <Checkbox
          label={children}
          disabled={disabled}
          checked={a.choices.includes(value)}
          onCheckedChange={(on) =>
            q.answer(item.name, {
              ...a,
              choices: on
                ? [...a.choices, value]
                : a.choices.filter((v) => v !== value),
            })
          }
        >
          {children}
        </Checkbox>
      ) : (
        <RadioGroupItem value={value} label={children} disabled={disabled} />
      )}
    </PartBox>
  )
}
export function QuestionnaireInput({
  placeholder = 'Your response',
  label = 'Response',
}: {
  placeholder?: string
  label?: string
}) {
  const q = useQuestionnaire(),
    item = useItem(),
    a = q.values[item.name] ?? empty
  return (
    <PartBox source="questionnaire" part="QuestionnaireInput" width="100%">
      <Input
        label={label}
        placeholder={placeholder}
        value={a.text}
        invalid={!!q.errors[item.name]}
        onValueChange={(text) => q.answer(item.name, { ...a, text })}
      />
    </PartBox>
  )
}
export function QuestionnaireError() {
  const q = useQuestionnaire(),
    item = useItem()
  return (
    <PartBox source="questionnaire" part="QuestionnaireError">
      {q.errors[item.name] ? (
        <PartText
          source="questionnaire"
          part="QuestionnaireError.text"
          tone="destructive"
        >
          {q.errors[item.name] ?? ''}
        </PartText>
      ) : null}
    </PartBox>
  )
}
export function QuestionnaireActions({ children }: PropsWithChildren) {
  return (
    <PartBox
      source="questionnaire"
      part="QuestionnaireActions"
      flexDirection="row"
      flexWrap="wrap"
      gap={d.gap}
    >
      {children}
    </PartBox>
  )
}
export function QuestionnairePrevious() {
  const q = useQuestionnaire()
  return (
    <Button
      variant="secondary"
      styleSource="questionnaire"
      stylePart="QuestionnairePrevious"
      disabled={q.index === 0}
      onPress={() => q.navigate('previous')}
    >
      Previous
    </Button>
  )
}
export function QuestionnaireNext() {
  const q = useQuestionnaire()
  return (
    <Button
      styleSource="questionnaire"
      stylePart="QuestionnaireNext"
      disabled={q.index === q.items.length - 1}
      onPress={() => q.navigate('next')}
    >
      Next
    </Button>
  )
}
export function QuestionnaireSkip() {
  const q = useQuestionnaire()
  return (
    <Button
      variant="ghost"
      styleSource="questionnaire"
      stylePart="QuestionnaireSkip"
      disabled={q.items[q.index]?.required || q.index === q.items.length - 1}
      onPress={() => q.navigate('skip')}
    >
      Skip
    </Button>
  )
}
export function QuestionnaireSubmit() {
  const q = useQuestionnaire()
  return (
    <Button
      styleSource="questionnaire"
      stylePart="QuestionnaireSubmit"
      disabled={q.index !== q.items.length - 1}
      onPress={() => q.navigate('submit')}
    >
      Submit
    </Button>
  )
}
