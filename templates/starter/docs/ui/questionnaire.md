# Questionnaire

Collect choices and free-text answers across a sequence of validated questions.

[Source](../../src/components/ui/questionnaire.tsx) · [Defaults](../../src/lib/ui/styles.ts) · Gallery: `/gallery/questionnaire`

## Usage

```tsx
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from '@/components/ui/questionnaire'

<Questionnaire
  items={[{ name: 'tools', required: true, multiple: true }]}
  onSubmit={save}
>
  <QuestionnaireProgress />
  <QuestionnaireItem name="tools">
    <QuestionnaireTitle>Which tools?</QuestionnaireTitle>
    <QuestionnaireDescription>
      Select tools or write your own.
    </QuestionnaireDescription>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="bun">Bun</QuestionnaireChoice>
      <QuestionnaireChoice value="typescript">TypeScript</QuestionnaireChoice>
    </QuestionnaireChoices>
    <QuestionnaireInput placeholder="Other tools" />
    <QuestionnaireError />
  </QuestionnaireItem>
  <QuestionnaireActions>
    <QuestionnairePrevious />
    <QuestionnaireSkip />
    <QuestionnaireNext />
    <QuestionnaireSubmit />
  </QuestionnaireActions>
</Questionnaire>
```

Supply `save` from your application to handle submitted answers.

## Questions and answers

`items` is an ordered list of question metadata. At least one question is required.

| Item field | Purpose |
| --- | --- |
| `name` | Unique question name matching its `QuestionnaireItem`. |
| `required` | Require a choice or nonblank text; default false. |
| `multiple` | Allow multiple choices; default false. |
| `validate(answer)` | Optional custom validator returning an error string. |

Answer values have this shape:

```ts
type Answers = Record<string, { choices: string[]; text: string }>
```

A free-text response can coexist with selected choices. The root supports controlled `value`/`onValueChange` or initial `defaultValue`. Use `step`/`onStepChange` or `defaultStep` for the active question. Your application owns persistence and submission effects.

## Composition

Only the active `QuestionnaireItem` is displayed, and its first enabled control receives focus. Choices reuse Radio Group for single selection and Checkbox for multiple selection. Each choice accepts a value, string children and a disabled state.

The input reuses Input and accepts a label and placeholder. Title, Description, Progress, Error and Actions provide layout with a gap of one.

## Validation and navigation

Next validates the active question. Submit validates all questions and returns to the first invalid one. Required validation checks for a choice or nonblank text before the custom validator runs. Errors clear when the corresponding answer changes.

Previous preserves answers. Skip is disabled on required questions and the last step. Next is disabled on the last step; Submit is disabled before it. Controlled owners can reject proposed answer or step changes.

Use application code for conditional question flows, network requests and persistence. Compose the questionnaire inside a Dialog or Card when needed.
