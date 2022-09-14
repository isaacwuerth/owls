import { createPlugin, Theme } from '@fullcalendar/common'

export class MaterialUITheme extends Theme {
}

MaterialUITheme.prototype.classes = {
  root: 'fc-theme-materialui MuiBox-root',
  tableCellShaded: 'fc-theme-bootstrap5-shaded',
  buttonGroup: 'btn-group',
  button: '',
  buttonActive: 'active',
  popover: 'popover',
  popoverHeader: 'popover-header',
  popoverContent: 'popover-body'
}

// wtf
MaterialUITheme.prototype.iconOverrideOption = 'buttonIcons' // TODO: make TS-friendly
MaterialUITheme.prototype.iconOverrideCustomButtonOption = 'icon'
MaterialUITheme.prototype.iconOverridePrefix = 'bi-'

const FullCalendarMaterialUI = createPlugin({
  themeClasses: {
    materialui: MaterialUITheme
  }
})

export default FullCalendarMaterialUI
