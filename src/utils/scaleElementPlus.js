import { h, ref } from 'vue'
import { ElTable, ElTableColumn, ElDialog, ElForm, ElFormItem, ElDrawer } from 'element-plus'
import { uiScale, scaleCssSize } from './uiScale'

const COLUMN_KEYS = ['width', 'minWidth', 'min-width']
const TABLE_KEYS = ['height', 'maxHeight', 'max-height']
const DIALOG_KEYS = ['width']
const FORM_KEYS = ['labelWidth', 'label-width']
const DRAWER_KEYS = ['size']

function pickScaledAttrs(attrs, keys) {
  const s = uiScale.value
  const next = { ...attrs }
  keys.forEach((key) => {
    if (next[key] != null && next[key] !== '') {
      next[key] = scaleCssSize(next[key], s)
    }
  })
  return next
}

function wrapComponent(name, Original, keys) {
  return {
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots, expose }) {
      const innerRef = ref(null)
      // 透传 doLayout / clearSelection 等实例方法与属性
      expose(
        new Proxy(
          {},
          {
            get(_target, prop) {
              if (prop === '__v_isRef') return false
              const inst = innerRef.value
              if (inst == null) return undefined
              const val = inst[prop]
              return typeof val === 'function' ? val.bind(inst) : val
            },
            has(_target, prop) {
              return innerRef.value != null && prop in innerRef.value
            }
          }
        )
      )
      return () =>
        h(
          Original,
          {
            ...pickScaledAttrs(attrs, keys),
            ref: innerRef
          },
          slots
        )
    }
  }
}

/**
 * 覆盖 Element Plus 关键组件：让模板里的固定 px 列宽/弹框宽/label 宽
 * 随 uiScale（rem/192）放大，避免大分辨率下字变大、列宽不变导致换行。
 */
export function installScaledElementPlus(app) {
  const column = wrapComponent('ElTableColumn', ElTableColumn, COLUMN_KEYS)
  const table = wrapComponent('ElTable', ElTable, TABLE_KEYS)
  const dialog = wrapComponent('ElDialog', ElDialog, DIALOG_KEYS)
  const form = wrapComponent('ElForm', ElForm, FORM_KEYS)
  const formItem = wrapComponent('ElFormItem', ElFormItem, FORM_KEYS)
  const drawer = wrapComponent('ElDrawer', ElDrawer, DRAWER_KEYS)

  ;[
    ['ElTableColumn', column],
    ['el-table-column', column],
    ['ElTable', table],
    ['el-table', table],
    ['ElDialog', dialog],
    ['el-dialog', dialog],
    ['ElForm', form],
    ['el-form', form],
    ['ElFormItem', formItem],
    ['el-form-item', formItem],
    ['ElDrawer', drawer],
    ['el-drawer', drawer]
  ].forEach(([name, comp]) => {
    app.component(name, comp)
  })
}
