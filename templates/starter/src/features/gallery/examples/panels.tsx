import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Slider } from '@/components/ui/slider'
import type { DemoProps } from '../catalog'

export function SliderDemo({ report }: DemoProps) {
  const [volume, setVolume] = useState([40]),
    [range, setRange] = useState([20, 80])
  return (
    <>
      <text>Volume: {volume.join(', ')}</text>
      <Slider
        label="Volume"
        value={volume}
        onValueChange={setVolume}
        onValueCommit={(values) => report(`Volume: ${values.join(', ')}`)}
      />
      <text>Range: {range.join(' – ')}</text>
      <Slider label="Range" value={range} onValueChange={setRange} step={5} />
      <Slider label="Disabled slider" defaultValue={[60]} disabled />
      <box flexDirection="row" gap={2}>
        <Slider
          label="Vertical slider"
          orientation="vertical"
          defaultValue={[30]}
          height={5}
        />
        <text>Arrows / Home / End / Page Up / Page Down</text>
      </box>
    </>
  )
}
export function ResizableDemo({ report }: DemoProps) {
  return (
    <>
      <ResizablePanelGroup
        height={6}
        onLayoutChange={(values) =>
          report(values.map((value) => `${Math.round(value)}%`).join(' / '))
        }
      >
        <ResizablePanel defaultSize={30} minSize={15}>
          <text>Navigation</text>
          <Button variant="ghost" onPress={() => report('Inbox')}>
            Inbox
          </Button>
        </ResizablePanel>
        <ResizableHandle withHandle label="Resize navigation" />
        <ResizablePanel minSize={20}>
          <text>Workspace</text>
          <text>Drag the divider, or focus it and use arrows.</text>
        </ResizablePanel>
      </ResizablePanelGroup>
      <ResizablePanelGroup orientation="vertical" height={7}>
        <ResizablePanel minSize={20}>
          <text>Editor</text>
        </ResizablePanel>
        <ResizableHandle withHandle label="Resize editor" />
        <ResizablePanel minSize={20}>
          <text>Terminal</text>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}
export const panelDemos = [
  {
    name: 'slider',
    hint: 'One or multiple thumbs. Arrows/Shift/Page keys, Home/End or pointer drag; values snap to step.',
    render: SliderDemo,
  },
  {
    name: 'resizable',
    hint: 'Drag or focus the separator. Arrows resize one cell; Shift resizes ten; Home/End honor adjacent limits.',
    render: ResizableDemo,
  },
]
