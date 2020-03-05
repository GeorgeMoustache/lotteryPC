export default {
  name: 'TableExpand',
  functional: true,
  props: {
    row: Object,
    index: Number,
    render: Function,
    column: {
      type: Object,
      default: null
    }
  },
  render: (h, ctx) => {
    let props = ctx.props
    let params = {
      index: props.index,
      row: props.row
    }
    if (props.column) params.column = props.column
    return props.render(h, params)
  }
}
