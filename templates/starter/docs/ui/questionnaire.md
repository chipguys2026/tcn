# Questionnaire

[Source](../../src/components/ui/questionnaire.tsx) · [Defaults](../../src/components/ui/questionnaire.styles.ts) · Gallery: `/gallery/questionnaire`

Imports come from `@/components/ui/questionnaire`.

```tsx
<Questionnaire items={[{ name: 'tools', required: true, multiple: true }]} onSubmit={save}>
  <QuestionnaireProgress />
  <QuestionnaireItem name="tools">
    <QuestionnaireTitle>Which tools?</QuestionnaireTitle>
    <QuestionnaireDescription>Select tools or write your own.</QuestionnaireDescription>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="bun">Bun</QuestionnaireChoice>
      <QuestionnaireChoice value="typescript">TypeScript</QuestionnaireChoice>
    </QuestionnaireChoices>
    <QuestionnaireInput placeholder="Other tools" />
    <QuestionnaireError />
  </QuestionnaireItem>
  <QuestionnaireActions>
    <QuestionnairePrevious /><QuestionnaireSkip />
    <QuestionnaireNext /><QuestionnaireSubmit />
  </QuestionnaireActions>
</Questionnaire>
```

Root items are ordered question metadata: unique name, required=false, multiple=false, optional validate(answer) returning an error string. At least one item is required. Item renders only the active question and focuses its first enabled control. Root owns answers and step; value/defaultValue/onValueChange and step/defaultStep/onStepChange support controlled use. Values are `Record<string, { choices: string[]; text: string }>` so a free response can coexist with selections. Persist values and submit effects in the application.

Choices uses RadioGroup for one choice, Checkbox for multiple choices. Choice takes value/string children/disabled. Input reuses Input and accepts label/placeholder. Required validation succeeds when a choice or nonblank text exists; custom validation runs otherwise. Next validates the active item; Submit validates every item and returns to the first invalid question. Previous preserves answers; Skip is disabled for required questions and the last step. Next is disabled on the last step; Submit is disabled before it. Errors clear when that answer changes. Controlled owners can reject proposed answers or steps.

Title, Description, Progress, Error and Actions are composition parts with gap=1. Tweak edits the wrappers and reused primitives; defaults remain source-owned. Transport, branching logic, persistence and containing Dialog/Card belong to the application.
