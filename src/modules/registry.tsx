import type { ComponentType } from 'react'
import type { DictKey } from '../i18n/dict'
import type { ModuleId } from '../state/AppState'
import ComingSoon from './ComingSoon'
import Module1ChordLab from './Module1ChordLab'
import Module2DoublingMachine from './Module2DoublingMachine'
import Module3Semicircle from './Module3Semicircle'

interface ModuleEntry {
  id: ModuleId
  titleKey: DictKey
  Component: ComponentType
}

function comingSoon(titleKey: DictKey): ComponentType {
  return () => <ComingSoon titleKey={titleKey} />
}

export const MODULE_REGISTRY: ModuleEntry[] = [
  { id: '1', titleKey: 'mod1', Component: Module1ChordLab },
  { id: '2', titleKey: 'mod2', Component: Module2DoublingMachine },
  { id: '3', titleKey: 'mod3', Component: Module3Semicircle },
  { id: '4', titleKey: 'mod4', Component: comingSoon('mod4') },
  { id: '5', titleKey: 'mod5', Component: comingSoon('mod5') },
  { id: '6', titleKey: 'mod6', Component: comingSoon('mod6') },
  { id: '7', titleKey: 'mod7', Component: comingSoon('mod7') },
  { id: '8', titleKey: 'mod8', Component: comingSoon('mod8') },
  { id: '9', titleKey: 'mod9', Component: comingSoon('mod9') },
  { id: '0', titleKey: 'mod0', Component: comingSoon('mod0') },
]

export function getModule(id: ModuleId): ModuleEntry {
  return MODULE_REGISTRY.find((m) => m.id === id) ?? MODULE_REGISTRY[0]
}
