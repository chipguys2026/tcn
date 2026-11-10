import { useState } from 'react'
import type { DemoProps } from '@/components/shared/component-demos/catalog'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { icons } from '@/lib/ui/icons'

export function InputGroupDemo({ report }: DemoProps) {
  const [query, setQuery] = useState(''),
    [message, setMessage] = useState('')
  return (
    <>
      <InputGroup>
        <InputGroupInput
          label="Search projects"
          placeholder="Search projects"
          value={query}
          onValueChange={setQuery}
          onSubmit={report}
        />
        <InputGroupAddon>
          <InputGroupText>{icons.search}</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton onPress={() => report(query || 'No search query')}>
            Search
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea
          label="Message"
          placeholder="Write a message…"
          height={3}
          value={message}
          onValueChange={setMessage}
          onSubmit={report}
        />
        <InputGroupAddon align="block-start">
          <InputGroupText>New message</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="block-end">
          <InputGroupText>{`${message.length} characters`}</InputGroupText>
          <InputGroupButton onPress={() => report(message || 'Empty message')}>
            Send
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup disabled>
        <InputGroupInput label="Disabled group" defaultValue="Unavailable" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>Send</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup invalid>
        <InputGroupInput label="Invalid group" placeholder="Required value" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>Required</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </>
  )
}
export function PaginationDemo({ report }: DemoProps) {
  const [page, setPage] = useState(1)
  const select = (next: number) => {
    setPage(next)
    report(`Page ${next}`)
  }
  return (
    <>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={page === 1}
              onPress={() => select(page - 1)}
            />
          </PaginationItem>
          {[1, 2, 3].map((value) => (
            <PaginationItem key={value}>
              <PaginationLink
                isActive={page === value}
                label={`Page ${value}`}
                onPress={() => select(value)}
              >
                {String(value)}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={page === 10} onPress={() => select(10)}>
              10
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              disabled={page === 10}
              onPress={() => select(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <text>
        Page {page} of 10 — data and route changes belong to the application.
      </text>
    </>
  )
}
export const formControlDemos = [
  {
    name: 'input-group',
    hint: 'Shared input surface, addons on four sides, editor ring surrounds the group.',
    render: InputGroupDemo,
  },
  {
    name: 'pagination',
    hint: 'Application-owned page state. Disabled boundaries; Enter / Space / click activate.',
    render: PaginationDemo,
  },
]
