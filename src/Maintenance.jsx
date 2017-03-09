import Debug from 'debug'
import React from 'react'
import {
  AppBar, Avatar, Badge, Checkbox, Chip, Divider, Paper, Menu, MenuItem, Dialog, IconButton, TextField, Toggle, CircularProgress
} from 'material-ui'
import muiThemeable from 'material-ui/styles/muiThemeable'
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import { List, ListItem } from 'material-ui/List'
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app'
import ActionDns from 'material-ui/svg-icons/action/dns'
import ActionDonutSmall from 'material-ui/svg-icons/action/donut-small'
import ImageCropPortrait from 'material-ui/svg-icons/image/crop-portrait'
import ContentContentCopy from 'material-ui/svg-icons/content/content-copy'
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more'
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import NavigationMoreVert from 'material-ui/svg-icons/navigation/more-vert'
import ContentAddCircle from 'material-ui/svg-icons/content/add-circle'
import {
  pinkA200, grey300, grey400, greenA400, green400, amber400,
  redA200, red400, lightGreen100, lightGreen400, lightGreenA100,
  lightGreenA200, lightGreenA400, lightGreenA700
} from 'material-ui/styles/colors'
import UUID from 'node-uuid'
import request from 'superagent'
import validator from 'validator'
import prettysize from 'prettysize'
import FlatButton from '../common/FlatButton'
import {
  operationTextConfirm, operationBase, Operation, operationBusy, operationSuccess, operationFailed, createOperation
} from '../common/Operation'
import { CatSilhouette, BallOfYarn, Account, ReportProblem, HDDIcon, RAIDIcon, UpIcon, DownIcon
} from './svg'
import { InitVolumeDialogs } from './InitVolumeDialogs'

const debug = Debug('component:maintenance')
const SUBTITLE_HEIGHT = 32
const TABLEHEADER_HEIGHT = 48
const TABLEDATA_HEIGHT = 48
const HEADER_HEIGHT = 104
const FOOTER_HEIGHT = 48
const SUBTITLE_MARGINTOP = 24

const alphabet = 'abcdefghijklmnopqrstuvwxyz'

const diskDisplayName = (name) => {
  const chr = name.charAt(2)
  const number = alphabet.indexOf(chr) + 1
  return `硬盘 #${number}`
}

const partitionDisplayName = (name) => {
  const numstr = name.slice(3)
  return `分区 #${numstr}`
}

const Checkbox40 = props => (
  <div style={{ width: 40, height: 40 }}>
    <Checkbox
      {...props} style={{ margin: 8 }}
      iconStyle={{ fill: props.fill }}
    />
  </div>
)

const ReportProblemIcon = props => (
  <ReportProblem style={{ verticalAlign: '-18%', marginRight: 8 }} {...props} />
)

const HeaderIcon = props => (
  <div
    style={{
      width: 40,
    // height: HEADER_HEIGHT,
      marginLeft: 24,
      marginTop: 24,
      marginRight: 16
    }}
  >
    { props.children }
  </div>
)


const styles = {
  chip: {
    backgroundColor: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'medium',
    height: 26,
    marginRight: 5,
    border: '1px solid #e6e6e6'
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  paperHeader: {
    position: 'relative',
    width: '100%',
    height: HEADER_HEIGHT,
    border: '1px solid #e6e6e6',
    display: 'flex',
    alignItems: 'center'
  }
}

const HeaderTitle1 = props => (
  <div style={props.style} onTouchTap={props.onTouchTap}>
    <div style={{ marginBottom: 2 }}>
      {props.title}
    </div>
    <div style={styles.wrapper}>
      {props.textFilesystem &&
        <Chip style={styles.chip} labelStyle={{ marginTop: -4 }}>
          <span style={{ color: '#9e9e9e' }}>
            {props.textFilesystem}
          </span>
        </Chip> }
      {props.volumemode &&
        <Chip style={styles.chip} labelStyle={{ marginTop: -4 }}>
          <span style={{ color: '#9e9e9e' }}>
            {props.volumemode}
          </span>
        </Chip> }
    </div>
  </div>
)

class KeyValueList extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  render() {
    const style = { flexGrow: 1 }
    if (this.props.right === true) { style.textAlign = 'right' }

    return (
      <div style={this.props.style}>
        { this.props.items.map(item => (
          <div
            style={{
              height: 24,
              display: 'flex',
              alignItems: 'center',
              fontSize: 13,
              color: this.props.disabled ? 'rgba(0,0,0,0.38)' : 'rgba(0,0,0,0.87'
            }}
          >
            <div style={{ width: 184 }}>{item[0]}</div>
            <div style={style}>{item[1]}</div>
          </div>
          ))}
      </div>
    )
  }
}

const SubTitleRow = props => (
  <div style={{ width: '100%', height: SUBTITLE_HEIGHT, display: 'flex', alignItems: 'center' }}>
    <div style={{ flex: '0 0 256px' }} />
    <div
      style={{ flex: '0 0 184px',
        fontSize: 13,
        color: props.disabled ? 'rgba(0,0,0,0.38)' : 'rgba(0,0,0,0.87)',
        fontWeight: 'bold'
      }}
    >
      {props.text}
    </div>
  </div>
)

// disabled
const TableHeaderRow = (props) => {
  const style = {
    height: TABLEHEADER_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    fontSize: 11,
    color: props.disabled ? 'rgba(0,0,0,0.38)' : 'rgba(0,0,0,0.54)',
    fontWeight: props.disabled ? 'normal' : 'bold'
  }

  return (
    <div style={props.style}>
      <div style={style}>
        { props.items.map((item) => {
          const style = { flex: `0 0 ${item[1]}px` }
          if (item[2] === true) { style.textAlign = 'right' }
          return (<div style={style}>{item[0]}</div>)
        }) }
      </div>
    </div>
  )
}

// disabled, selected
const TableDataRow = (props) => {
  const containerStyle = {
    height: TABLEDATA_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    fontSize: 13,
    color: props.disabled ? 'rgba(0,0,0,0.38)' : 'rgba(0,0,0,0.87)'
  }

  if (!props.disabled && props.selected) { containerStyle.backgroundColor = '#F5F5F5' }

  return (
    <div style={props.style}>
      <div style={containerStyle}>
        { props.items.map((item) => {
          if (typeof item[0] === 'string') {
            const style = { flex: `0 0 ${item[1]}px` }
            if (item[2] === true) style.textAlign = 'right'
            return <div style={style}>{item[0]}</div>
          }
          const style = {
            flex: `0 0 ${item[1]}px`,
            display: 'flex',
            alignItems: 'center'
          }

          if (item[2] === true) style.justifyContent = 'center'
          return <div style={style}>{item[0]}</div>
        }) }
      </div>
    </div>
  )
}

const TableDataRowDark = (props) => {
  if (props.disabled) return <TableDataRow {...props} />

  const newProps = Object.assign({}, props, {
    style: Object.assign({}, props.style, {
      color: 'rgba(0,0,0,0.87)'
    })
  })

  return <TableDataRow {...newProps} />
}


// grayLeft and colorLeft

@muiThemeable()
class DoubleDivider extends React.PureComponent {

  render() {
    const primary1Color = this.props.muiTheme.palette.primary1Color
    const accent1Color = this.props.muiTheme.palette.accent1Color

    return (
      <div>
        { this.props.grayLeft &&
          <Divider
            style={{
              marginLeft: this.props.grayLeft,
              transition: 'margin 300ms'
            }}
          /> }

        { this.props.colorLeft &&
          <Divider
            style={{
              marginLeft: this.props.colorLeft,
              backgroundColor: accent1Color,
              transition: 'margin 300ms'
            }}
          /> }
      </div>
    )
  }
}

const VerticalExpandable = props => (
  <div style={{ width: '100%', height: props.height, transition: 'height 300ms', overflow: 'hidden' }}>
    { props.children }
  </div>
)

class RaidModePopover extends React.Component {

  constructor(props) {
    super(props)
    this.state = { open: false, hover: false }
    this.label = () => this.props.list.find(item => item[0] === this.props.select)[1]
    this.handleRequestClose = () => this.setState({ open: false, anchorEl: null })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled) this.setState({ open: false, hover: false })
  }

  render() {
    return (
      <div style={this.props.style}>
        <div

          style={{
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            padding: 8,
            display: 'flex',
            alignItems: 'center',
            fontSize: 13,
            color: this.props.disabled ? 'rgba(0,0,0,0.38)' : this.props.color,
            borderRadius: '2px',
            backgroundColor: this.state.hover || this.state.open ? '#EEEEEE' : undefined
          }}

          onMouseEnter={() => !this.props.disabled && this.setState({ hover: true })}
          onMouseLeave={() => !this.props.disabled && this.setState({ hover: false })}
          onTouchTap={e => !this.props.disabled && this.setState({ open: true, anchorEl: e.currentTarget })}
        >
          {this.label()}
          <NavigationExpandMore
            style={{ width: 18, height: 18, marginLeft: 8 }}
            color={this.props.disabled ? 'rgba(0,0,0,0.38)' : this.props.color}
          />
        </div>

        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
          animation={PopoverAnimationVertical}
        >
          <Menu>
            { this.props.list.map(item => (
              <MenuItem
                style={{ fontSize: 13 }}
                primaryText={item[1]}
                disabled={item[2]}
                onTouchTap={() => {
                  this.handleRequestClose()
                  this.props.onSelect(item[0])
                }}
              />
            )) }
          </Menu>
        </Popover>
      </div>
    )
  }
}

@muiThemeable()
class Maintenance extends React.Component {

  constructor(props) {
    super(props)
    const that = this

    this.unmounted = false
    this.createOperation = (operation, ...args) =>
      createOperation(this, 'dialog', operation, ...args)

    this.colors = {

      primary: this.props.muiTheme.palette.primary1Color,
      accent: this.props.muiTheme.palette.accent1Color,

      fillGrey: grey400,
      fillGreyFaded: grey300
    }

    this.dim = {

    }

    this.state = {
      creatingNewVolume: null,
      expanded: [],
      operation: null
    }

    this.reloadBootStorage = (callback) => {
      let storage
      let boot
      let done = false
      const device = window.store.getState().maintenance.device
      const finish = () => {
        if (storage && boot) {
          debug('reload boot storage', boot, storage)
          this.setState({
            storage,
            boot,
            creatingNewVolume: this.state.creatingNewVolume ? { disks: [], mode: 'single' } : null
          })

          if (callback) callback(null, { storage, boot })
          done = true
        }
      }

      request.get(`http://${device.address}:3000/system/storage?wisnuc=true`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (this.unmounted) {
            if (!done) {
              if (callback) callback(new Error('unmounted'))
              done = true
            }
            return
          }
          storage = err ? err.message : res.body
          finish()
        })

      request.get(`http://${device.address}:3000/system/boot`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (this.unmounted) {
            if (!done) {
              if (callback) callback(new Error('unmounted'))
              done = true
            }
          }
          boot = err ? err.message : res.body
          finish()
        })
    }

    // //////////////////////////////////////////////////////////////////////////
    //
    // operation
    //
    this.operationOnCancel = () => {
      this.setState({ operation: null })
    }

    this.UsernamePasswordContent = (props) => {
      const onChange = (name, value) => {
        const operation = Object.assign({}, this.state.operation)
        operation[name] = value
        this.setState({ operation })
      }

      return (
        <div>
          <TextField
            hintText="" floatingLabelText="用户名"
            onChange={e => onChange('username', e.target.value)}
          />
          <TextField
            hintText="" floatingLabelText="输入密码" type="password"
            onChange={e => onChange('password', e.target.value)}
          />
          <TextField
            hintText="" floatingLabelText="再次输入密码" type="password"
            onChange={e => onChange('passwordAgain', e.target.value)}
          />
        </div>
      )
    }

    // Sub Component
    this.OperationTextContent = props => (
      <div style={{ width: '100%' }}>
        { this.state.operation.text.map((line, index, array) => (
          <div
            style={{
              fontSize: 15,
              lineHeight: '24px',
              marginBottom: index === array.length - 1 ? 0 : 20
            }}
          >{ line }</div>))}
      </div>
    )

    // Sub Component
    this.OperationBusy = props => (
      <div
        style={{ width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center' }}
      >
        <CircularProgress color={pinkA200} />
      </div>
    )

    // state transition
    this.setOperationDialogBusy = () => {
      const operation = {
        stage: 'WIP',
        title: '执行操作',
        Content: this.OperationBusy,
        actions: [
          {
            label: ' ',
            disabled: true
          }
        ]
      }

      this.setState({ operation })
    }

    this.setOperationDialogSuccess = (text) => {
      const operation = {
        stage: 'SUCCESS',
        title: '操作成功',
        text,
        Content: this.OperationTextContent,
        actions: [
          {
            label: '晓得了',
            onTouchTap: this.operationOnCancel
          }
        ]
      }

      this.setState({ operation })
    }

    this.setOperationDialogFailed = (text) => {
      const operation = {
        stage: 'FAILED',
        title: '操作失败',
        text,
        Content: this.OperationTextContent,
        actions: [
          {
            label: '晓得了',
            onTouchTap: this.operationOnCancel
          }
        ]
      }

      this.setState({ operation })
    }

    // TODO move to main render
    this.OperationDialog = (props) => {
      const operation = this.state.operation
      return (
        <Dialog
          contentStyle={{ width: (this.state.operation && this.state.operation.width) || 560 }}
          title={operation && operation.title}
          open={operation !== null}
          modal
          actions={operation && operation.actions &&
            operation.actions.map(action =>
              <FlatButton
                label={action.label}
                onTouchTap={action.onTouchTap}
                disabled={typeof action.disabled === 'function' ? action.disabled() : action.disabled}
              />)
          }
        >
          { operation && operation.Content && <operation.Content /> }
        </Dialog>
      )
    }

    // //////////////////////////////////////////////////////////////////////////
    //
    // operations
    //

    this.errorText = (err, res) => {
      const text = []

      // see superagent documentation on error handling
      if (err.status) {
        text.push(`${err.status} ${err.message}`)
        if (res && res.body && res.body.message) { text.push(`message: ${res.body.message}`) }
      } else {
        text.push('错误信息：', err.message)
      }

      return text
    }

    this.startWisnucOnVolume = (volume) => {
      const text = ['启动安装于Btrfs磁盘阵列上的WISNUC应用？']

      this.createOperation(operationTextConfirm, text, () => {
        this.state.dialog.setState(operationBusy)

        const device = window.store.getState().maintenance.device
        const url = `http://${device.address}:3000/system/mir/run`

        request
          .post(url)
          .set('Accept', 'application/json')
          .send({ target: volume.fileSystemUUID })
          .end((err, res) => {
            if (err) {
              this.reloadBootStorage((err2, { boot, storage }) => {
                this.state.dialog.setState(operationFailed, this.errorText(err, res))
              })
            } else {
              this.reloadBootStorage((err2, { boot, storage }) => {
                // FIXMED
                for (let i = 3; i >= 0; i--) {
                  const time = (3 - i) * 1000
                  const that = this
                  setTimeout(() => { that.state.dialog.setState(operationSuccess, [`启动成功，系统将在${i}秒钟后跳转到登录页面`]) }, time)
                }
                setTimeout(() => { window.store.dispatch({ type: 'EXIT_MAINTENANCE' }) }, 4000)
              })
            }
          })
      })
    }

    this.initWisnucOnVolume = (volume) => {
      debug('initWisnucOnVolume', volume)
      // TODO FIXME
      if (typeof volume.wisnuc !== 'object') {
        alert('功能开发中......')
        return
      }
      this.setState({ initVolume: volume })
    }

    this.mkfsBtrfsVolume = () => {
      if (this.state.creatingNewVolume === null) return

      const target = this.state.creatingNewVolume.disks.map(disk => disk.name)
      const type = 'btrfs'
      const mode = this.state.creatingNewVolume.mode

      const text = []

      text.push(`使用设备${target.join()}和${mode}模式创建新磁盘阵列，` +
        '这些磁盘和包含这些磁盘的磁盘阵列上的数据都会被删除且无法恢复。确定要执行该操作吗？')

      this.createOperation(operationTextConfirm, text, () => {
        // set dialog state to busy
        this.state.dialog.setState(operationBusy)

        const device = window.store.getState().maintenance.device
        request
          .post(`http://${device.address}:3000/system/mir/mkfs`)
          .set('Accept', 'application/json')
          .send({ type, target, mode })
          .end((err, res) => {
            debug('mkfs btrfs request', err || res.body)

            // set dialog state to success or failed
            if (err) {
              this.reloadBootStorage((err2, { boot, storage }) => {
                this.state.dialog.setState(operationFailed, this.errorText(err, res))
              })
            } else {
              this.reloadBootStorage((err2, { boot, storage }) => {
                this.state.dialog.setState(operationSuccess, ['成功'])
              })
            }
          })
      })
    }

    // //////////////////////////////////////////////////////////////////////////
    //
    // actions
    //

    this.onToggleCreatingNewVolume = () => {
      this.setState((state) => {
        if (state.creatingNewVolume === null) {
          return {
            creatingNewVolume: { disks: [], mode: 'single' },
            expanded: []
          }
        }
        return { creatingNewVolume: null }
      })
    }

    this.toggleExpanded = (disvol) => {
      const index = this.state.expanded.indexOf(disvol)
      if (index === -1) { this.setState({ expanded: [...this.state.expanded, disvol] }) } else {
        this.setState({
          expanded: [...this.state.expanded.slice(0, index), ...this.state.expanded.slice(index + 1)]
        })
      }
    }

    this.toggleCandidate = (disk) => {
      if (this.state.creatingNewVolume === null) return
      const arr = this.state.creatingNewVolume.disks
      const index = arr.indexOf(disk)
      let nextArr
      // TODO not necessary as immutable
      if (index === -1) { nextArr = [...arr, disk] } else { nextArr = [...arr.slice(0, index), ...arr.slice(index + 1)] }

      this.setState({
        creatingNewVolume: {
          disks: nextArr,
          mode: nextArr.length > 1 ? this.state.creatingNewVolume.mode : 'single'
        }
      })
    }

    this.setVolumeMode = (mode) => {
      if (this.state.creatingNewVolume === null) return
      this.setState({
        creatingNewVolume: Object.assign({}, this.state.creatingNewVolume, { mode })
      })
    }

    this.extractAllCardItems = storage => ([
      ...storage.volumes,
      ...storage.blocks.filter(blk => blk.isDisk && !blk.isVolumeDevice)
    ])

    this.cardStyle = (item) => {
      const expanded = this.state.expanded.indexOf(item) !== -1
      if (this.state.creatingNewVolume === null) {
        // if(item.missing){
        if (0) {
          return {
            width: 1200,
            margin: expanded ? 24 : 8,
            transition: 'all 300ms',
            backgroundColor: red400
          }
        }
        return {
          width: 1200,
          margin: expanded ? 24 : 8,
          transition: 'all 300ms'
        }
      }
      return {
        width: 1200,
        margin: 2,
        transition: 'all 300ms'
      }
    }

    this.cardDepth = (item) => {
      const expanded = this.state.expanded.indexOf(item) !== -1
      if (this.state.creatingNewVolume === null) { return expanded ? 2 : 1 }
      return 0
    }

    // //////////////////////////////////////////////////////////////////////////
    //
    // widget
    //

    this.ExpandToggle = props => (
      <IconButton
        onTouchTap={() => this.toggleExpanded(props.item)}
        color="red"
      >
        { this.state.expanded.indexOf(props.item) === -1 ?
          <NavigationExpandMore color="rgba(0,0,0,0.54)" /> :
          <NavigationExpandLess color="rgba(0,0,0,0.54)" /> }
      </IconButton>
    )

    // frame height should be 36 + marginBottom (12, supposed)
    this.TextButtonTop = props => (
      <div
        style={{ width: '100%',
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between' }}
      >
        <div>{ props.text || '' }</div>
        <FlatButton
          label="创建磁盘阵列"
          labelPosition="before"
          icon={<ContentAddCircle color={this.props.muiTheme.palette.primary1Color} style={{ verticalAlign: '-18%' }} />}
          disableTouchRipple
          disableFocusRipple
          onTouchTap={this.onToggleCreatingNewVolume}
          disabled={props.disabled}
        />
      </div>
    )

    // frame height should be 48 + 16 + 64 + 8 = 136
    this.NewVolumeTop = () => {
      const cnv = this.state.creatingNewVolume

      const actionEnabled = cnv.disks.length > 0
      const raidEnabled = cnv.disks.length > 1

      const hint = cnv.disks.length > 0 ?
        `已选中${cnv.disks.length}个磁盘` : '请选择磁盘'

      const wrap = {
        FB: FlatButton
      }

      return (
        <div style={{ width: '100%', height: 136 - 48 - 16 }}>

          <Paper
            style={{ width: '100%',
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: this.props.muiTheme.palette.accent1Color
            }}
          >

            <div style={{ marginLeft: 16, fontSize: 16 }}>{ hint }</div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RaidModePopover
                list={[
                  ['single', '使用SINGLE模式', false],
                  ['raid0',
                    raidEnabled ? '使用RAID0模式' : '使用RAID0模式 (需选择至少两块磁盘)',
                    !raidEnabled
                  ],
                  ['raid1',
                    raidEnabled ? '使用RAID1模式' : '使用RAID1模式 (需选择至少两块磁盘)',
                    !raidEnabled
                  ]
                ]}
                color={this.props.muiTheme.palette.accent1Color}
                select={cnv.mode}
                disabled={!actionEnabled}
                onSelect={this.setVolumeMode}
              />

              <FlatButton
                label="创建" secondary
                onTouchTap={this.mkfsBtrfsVolume}
                disabled={this.state.creatingNewVolume.disks.length === 0}
              />

              <FlatButton
                label="取消" secondary
                onTouchTap={this.onToggleCreatingNewVolume}
              />
            </div>

          </Paper>
        </div>
      )
    }

    this.VolumeWisnucBadge = class extends React.Component {

    /** **

          ENOWISNUC         // wisnuc folder does not exist         // no fruitmix
          EWISNUCNOTDIR     // wisnuc folder is not a dir           // no fruitmix
          ENOFRUITMIX       // fruitmix folder does not exist       // no fruitmix
          EFRUITMIXNOTDIR   // fruitmix folder is not a dir         // no fruitmix
          ENOMODELS         // models folder does not exist         // ambiguous
          EMODELSNOTDIR     // models folder is not a dir           // ambiguous
          ENOUSERS          // users.json file does not exist       // ambiguous
          EUSERSNOTFILE     // users.json is not a file             // ambiguous
          EUSERSPARSE       // users.json parse fail                // damaged        RED
          EUSERSFORMAT      // users.json is not well formatted     // damaged        RED

    ****/

      constructor(props) {
        super(props)
        this.state = {
          open: false,
          anchorEl: null
        }
        this.toggleList = (target) => {
          if (this.state.open === false) {
            this.setState({
              open: true,
              anchorEl: target
            })
          } else {
            this.setState({
              open: false,
              anchorEl: null
            })
          }
        }
      }

      render() {
        const VolumeisMissing = this.props.volume.isMissing
        // debug("VolumeWisnucBadge props, VolumeisMissing, UUID",this.props,VolumeisMissing,this.props.volume.fileSystemUUID)
        if (VolumeisMissing) {
          return (
            <div style={{ display: 'flex' }}>
              <ReportProblemIcon color={that.state.creatingNewVolume === null ? redA200 : 'rgba(0,0,0,0.38)'} />
              <div
                style={{
                // height: 28,
                // display: 'flex', alignItems: 'center',
                // boxSizing: 'border-box', padding: 8, borderRadius: 4,
                  fontSize: 13,
                  fontWeight: 'bold',
                  color: that.state.creatingNewVolume === null ? redA200 : 'rgba(0,0,0,0.38)'
                // backgroundColor: that.state.creatingNewVolume === null ? '#FF8A80' : '#E0E0E0'
                }}
              >
              发现有磁盘缺失
            </div>
            </div>
          )
        }
        if (typeof this.props.volume.wisnuc !== 'object') return null // ENOFRUITMIX can't work
        const { status, users, error, message } = this.props.volume.wisnuc
        if (users) {
          if (users.length === 0) {
            return <div>WISNUC已安装但尚未创建用户。</div>
          }
          return (<div />)
        } else if (status === 'NOTFOUND') {
          // debug("status",status)
          // debug("error",error)
          let text = ''
          switch (error) {
            case 'ENOWISNUC' :
              text = 'WISNUC未安装'; break
            case 'EWISNUCNOTDIR':
              text = 'WISNUC未安装,wisnuc路径存在但不是文件夹'; break
            case 'ENOFRUITMIX':
              text = 'WISNUC未正确安装,不存在wisnuc/fruitmix文件夹'; break
            case 'EFRUITMIXNOTDIR':
              text = 'WISNUC未正确安装,wisnuc/fruitmix不是文件夹'; break
          }
          // debug("text",text)
          return (
            <div style={{ display: 'flex' }}>
              <ReportProblemIcon color={that.state.creatingNewVolume === null ? redA200 : 'rgba(0,0,0,0.38)'} />
              <div
                style={{
                // display: 'flex', alignItems: 'center',
                  fontSize: 13,
                  fontWeight: 'bold',
                  color: that.state.creatingNewVolume === null ? redA200 : 'rgba(0,0,0,0.38)'
                }}
              >{ text }
              </div>
            </div>
          )
        } else if (error) {
          return (
            <div style={{ display: 'flex' }}>
              <ReportProblemIcon color={that.state.creatingNewVolume === null ? redA200 : 'rgba(0,0,0,0.38)'} />
              <div
                style={{
                  // height: 28,
                  // display: 'flex', alignItems: 'center',
                  // boxSizing: 'border-box', padding: 8, borderRadius: 4,
                  fontSize: 13,
                  fontWeight: 'bold',
                  color: that.state.creatingNewVolume === null ? redA200 : 'rgba(0,0,0,0.38)'
                  // backgroundColor: that.state.creatingNewVolume === null ? '#B9F6CA' : '#E0E0E0'
                }}
                onTouchTap={(e) => {
                  e.stopPropagation()
                  this.toggleList(e.currentTarget)
                }}
              >
                <div>检测WISNUC时遇到问题</div>
                <Popover
                  open={this.state.open}
                  anchorEl={this.state.anchorEl}
                  anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                  targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                  onRequestClose={() => this.setState({ open: false, anchorEl: null })}
                  animated={false}
                  animation={PopoverAnimationVertical}
                >
                  <div style={{ width: 240, margin: 8 }}>
                    文件系统存在{'wisnuc/fruitmix'}目录，但是
                    {
                      error === 'ENOMODELS' ? '没有models目录' :
                      error === 'EMODELS' ? 'models不是目录' :
                      error === 'ENOUSERS' ? '没有users.json文件' :
                      error === 'EUSERSNOTFILE' ? 'users.json不是文件' :
                      error === 'EUSERSPARSE' ? 'users.json无法解析，不是合法的json格式' :
                      error === 'EUSERSFORMAT' ? 'users.json文件内部数据格式错误' : '未知的错误'
                    }
                  </div>
                </Popover>
              </div>
            </div>
          )
        }
        return <div />
      }
    }

    this.UserBadge = class extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          hover: false
        }
        this.toggleHover = () => {
          this.setState({ hover: !this.state.hover })
        }
      }
      render() {
        if (typeof this.props.volume.wisnuc !== 'object') return null // ENOFRUITMIX can't work
        const { status, users, error, message } = this.props.volume.wisnuc
        if (users) {
          if (users.length === 0) {
            return (
              <div
                style={{
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                  padding: 8,
                  borderRadius: 4,
                  fontSize: 18,
                  marginLeft: 80,
                  marginBottom: 8,
                  fontWeight: 'bold',
                  color: that.state.creatingNewVolume === null ?
                lightGreen400 : 'rgba(0,0,0,0.38)'
                }}
              >
                WISNUC<span style={{ width: 4, display: 'inline-block' }} />
                已安装<span style={{ width: 8, display: 'inline-block' }} />
                但尚未创建用户
              </div>
            )
          }

          return (
            <div
              style={{
                height: 24,
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box',
                padding: 8,
                borderRadius: 4,
                fontSize: 18,
                fontWeight: 'regular',
                marginLeft: 80,
                marginBottom: 8,
                color: that.state.creatingNewVolume === null ? '#212121' : 'rgba(0,0,0,0.38)'
              }}
            >
                  WISNUC<span style={{ width: 4, display: 'inline-block' }} />已安装
                  <Badge
                    style={{ verticalAlign: '0%', padding: 0, marginLeft: -4 }}
                    badgeContent={users.length}
                    secondary
                    badgeStyle={{ fontWeight: 'regular',
                      fontSize: 12,
                      height: 16,
                      width: 16,
                      backgroundColor: 'white',
                      color: '#757575',
                      top: 10,
                      right: 4 }}
                    onMouseEnter={this.toggleHover}
                    onMouseLeave={this.toggleHover}
                  >
                    <IconButton>
                      <Avatar
                        style={{}}
                        size={24}
                        color={'white'}
                        backgroundColor={that.state.creatingNewVolume === null ? '#8C9EFF' : 'rgba(0,0,0,0.38)'}
                        icon={<Account />}
                      />
                    </IconButton>
                  </Badge>
              <div
                style={{
                  transition: 'all 450ms',
                  overflow: 'hidden',
                  opacity: this.state.hover ? 1 : 0,
                  marginTop: this.state.hover ? -4 : 12
                }}
              >
                {users.map((user, index) =>
                  <Avatar size={24} style={{ marginRight: 8 }}>
                    {user.username.slice(0, 2).toUpperCase()}
                  </Avatar>
                    )}
              </div>
            </div>
          )
        }
        return <div />
      }
    }


    this.volumeUnformattable = volume => []

    this.diskUnformattable = (disk) => {
      const K = x => y => x
      const blocks = this.state.storage.blocks

      if (disk.isVolumeDevice) { throw new Error('diskUnformattable requires non-volume disk as arguments') }

      if (disk.isPartitioned) {
        return blocks
          .filter(blk => blk.parentName === disk.name && !blk.isExtended)
          .reduce((p, c) => (c.isActiveSwap || c.isRootFS) ? K(p)(p.push(c)) : p, [])
      } else if (disk.isFileSystem) {
        return (disk.isActiveSwap || disk.isRootFS) ? [disk] : []
      } return []
    }

    this.volumeIconColor = (volume) => {
      if (this.state.creatingNewVolume) { return this.colors.fillGreyFaded }

      if (volume.isMissing) return redA200
      if (typeof volume.wisnuc !== 'object') return '#000'
      // debug("volume.wisnuc.status",volume.wisnuc.status)
      switch (volume.wisnuc.status) {
        case 'READY':
          return lightGreen400
        case 'NOTFOUND':
          return this.colors.fillGrey
        case 'AMBIGUOUS':
          return amber400
        case 'DAMAGED':
          return red400
      }

      return '#000'
    }

    this.VolumeTitle = (props) => {
      const volume = props.volume
      return (
        <div style={{ width: '100%', height: HEADER_HEIGHT, display: 'flex' }}>
          <HeaderIcon>
            <Avatar
              size={40}
              color={'white'}
              backgroundColor={this.volumeIconColor(volume)}
              icon={<RAIDIcon />}
            />
          </HeaderIcon>
          <HeaderTitle1
            style={{
              fontWeight: 'regular',
              fontSize: 26,
              width: 176,
              marginTop: 18,
              color: this.state.creatingNewVolume ? 'rgba(0,0,0,0.38)' : '#212121'
            }}
            volumemode={volume.usage.data.mode.toUpperCase()}
            title="磁盘阵列"
            textFilesystem="Btrfs"
          />
        </div>
      )
    }

    this.DiskHeadline = (props) => {
      const disk = props.disk
      let text

      if (disk.isPartitioned) {
        text = '分区使用的磁盘'
      } else if (disk.idFsUsage === 'filesystem') {
        text = '包含文件系统，无分区表'
      } else if (disk.idFsUsage === 'other') {
        text = '包含特殊文件系统，无分区表'
      } else if (disk.idFsUsage === 'raid') {
        text = 'Linux RAID设备'
      } else if (disk.idFsUsage === 'crypto') {
        text = '加密文件系统'
      } else if (disk.idFsUsage) {
        text = `未知的使用方式 (ID_FS_USAGE=${disk.idFsUsage})`
      } else {
        text = '未发现文件系统或分区表'
      }

      return (
        <div
          style={{
            fontSize: 13,
            color: this.state.creatingNewVolume ? 'rgba(0,0,0,0.38)' : 'rgba(0,0,0,0.87)'
          }}
        >
          {text}
        </div>
      )
    }

    this.DiskTitle = (props) => {
      const disk = props.disk
      const { primary1Color, accent1Color } = this.props.muiTheme.palette
      const cnv = !!this.state.creatingNewVolume
      const uf = this.diskUnformattable(disk).length > 0

      return (
        <div
          style={{ position: 'absolute',
            width: 256,
            display: 'flex',
            top: props.top,
            height: cnv ? TABLEDATA_HEIGHT : HEADER_HEIGHT,
            transition: 'all 300ms' }}
        >
          <HeaderIcon>
            { cnv ?
              <div style={{ marginTop: -16, marginLeft: 56 }}>
                <Checkbox40
                  fill={accent1Color}
                  disabled={uf}
                  onTouchTap={e => e.stopPropagation()}
                  checked={!!this.state.creatingNewVolume.disks.find(d => d === disk)}
                  onCheck={() => this.toggleCandidate(disk)}
                />
              </div>
              :
              <Avatar
                size={40}
                color="white"
                backgroundColor="#BDBDBD"
                icon={<HDDIcon />}
              />
             }
          </HeaderIcon>
          <HeaderTitle1
            style={{
              fontWeight: 'regular',
              fontSize: cnv ? 13 : 26,
              height: cnv ? TABLEDATA_HEIGHT : HEADER_HEIGHT,
              width: 176,
              marginTop: 18,
              marginLeft: cnv ? 40 : 0,
              color: (!cnv || !uf) ? '#212121' : 'rgba(0,0,0,0.38)',
              transition: 'height 300ms'
            }}
            title={diskDisplayName(disk.name)}
            onTouchTap={e => cnv && e.stopPropagation()}
          />
        </div>
      )
    }

    // props: 1) volume; 2) actions [[], []]
    this.VolumeMenu = class extends React.Component {

      constructor(props) {
        super(props)
        this.state = {
          open: false
        }

        this.handleRequestClose = () => this.setState({ open: false })
        // debug("this.VolumeMenu, this.props",this.props)
      }
      render() {
        const volume = this.props.volume
        return (
          <div>
            <IconButton
              onTouchTap={(e) => {
                e.stopPropagation()
                this.setState({
                  open: true,
                  anchorEl: e.currentTarget
                })
              }}
            >
              <NavigationMoreVert />
            </IconButton>
            <Popover
              open={this.state.open}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              onRequestClose={this.handleRequestClose}
              animation={PopoverAnimationVertical}
            >
              <Menu>
                { this.props.actions.map(act => (
                  <MenuItem
                    style={{ fontSize: 13 }}
                    primaryText={act[0]}
                    disabled={act[2]}
                    onTouchTap={() => {
                      this.handleRequestClose()
                      if (act[1]) act[1](volume)
                    }}
                  />
                  )) }
              </Menu>
            </Popover>
          </div>
        )
      }
    }

    this.BtrfsVolume = (props) => {
      const primary1Color = this.props.muiTheme.palette.primary1Color
      const accent1Color = this.props.muiTheme.palette.accent1Color

      const volume = props.volume
      const boot = this.state.boot
      const { volumes, blocks } = this.state.storage
      const cnv = !!this.state.creatingNewVolume

      const expandableHeight = this.state.expanded.indexOf(volume) !== -1 ?
        17 * 24 + 3 * SUBTITLE_HEIGHT + SUBTITLE_MARGINTOP : 0
      // debug("BtrfsVolume props",props)
      // debug("BtrfsVolume volumes",volumes)
      const comment = () => volume.missing ? '有磁盘缺失' : '全部在线' // TODO if(volume.missing === true)
      const DivStyle = (VolumeIsMissing) => {
      // debug("VolumeIsMissing",VolumeIsMissing)
        if (VolumeIsMissing) {
          return {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '',
            border: '1px solid #e6e6e6'
            // backgroundColor: red400
          }
        }
        return {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '',
          border: '1px solid #e6e6e6'
        }
      }
      return (
        <Paper {...props}>
          <div
            style={DivStyle(volume.missing)}
            onTouchTap={() => this.toggleExpanded(volume)}
          >
            <div style={{ flex: '0 0 900px', height: '100%', display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: '0 0 256px' }}>
                <this.VolumeTitle volume={volume} />
              </div>
              <this.VolumeWisnucBadge volume={volume} />
            </div>
            <div style={{ marginRight: 24 }}>
              {expandableHeight ? <UpIcon color={'#9e9e9e'} /> : <DownIcon color={'#9e9e9e'} />}
            </div>

          </div>
          <VerticalExpandable height={expandableHeight}>

            <SubTitleRow text="磁盘阵列信息" disabled={cnv} />

            <div style={{ width: '100%', display: 'flex' }}>
              <div style={{ flex: '0 0 256px' }} />
              <KeyValueList
                disabled={cnv}
                items={[
                  ['磁盘数量', (volume.total >= 2) ? `${volume.total}（${comment()}）` : `${volume.total}`],
                  ['文件系统UUID', volume.uuid.toUpperCase()],
                  ['访问路径', volume.mountpoint]
                ]}
              />
            </div>

            <SubTitleRow text="数据使用" disabled={cnv} />

            <div style={{ width: '100%', display: 'flex' }}>
              <div style={{ flex: '0 0 256px' }} />
              <KeyValueList
                style={{ width: 336 }}
                disabled={cnv}
                right
                items={[
                  ['总容量', prettysize(volume.usage.overall.deviceSize)],
                  ['已分配容量', prettysize(volume.usage.overall.deviceAllocated)],
                  ['未分配容量', prettysize(volume.usage.overall.deviceUnallocated)],
                  ['已用空间', prettysize(volume.usage.overall.used)],
                  ['可用空间（估计）', prettysize(volume.usage.overall.free)],
                  ['可用空间（最少）', prettysize(volume.usage.overall.freeMin)],
                  ['全局保留空间', prettysize(volume.usage.overall.globalReserve)],
                  ['全局保留空间（已使用）', prettysize(volume.usage.overall.globalReserveUsed)],
                  ['用户数据空间', prettysize(volume.usage.data.size)],
                  ['用户数据空间（已使用）', prettysize(volume.usage.data.used)],
                  ['元数据空间', prettysize(volume.usage.metadata.size)],
                  ['元数据空间（已使用）', prettysize(volume.usage.metadata.used)],
                  ['系统数据空间', prettysize(volume.usage.system.size)],
                  ['系统数据空间（已使用）', prettysize(volume.usage.system.used)]
                ]}
              />
              <div style={{ flex: '0 0 56px' }} />
              <KeyValueList
                style={{ width: 336 }}
                disabled={cnv}
                right
                items={[
                  ['用户数据', volume.usage.data.mode],
                  ['元数据', volume.usage.metadata.mode],
                  ['系统数据', volume.usage.system.mode]
                ]}
              />
            </div>
            <div style={{ width: '100%', height: SUBTITLE_MARGINTOP }} />
            <SubTitleRow text="磁盘信息" disabled={cnv && this.volumeUnformattable(volume).length > 0} />
          </VerticalExpandable>

          <TableHeaderRow
            style={{ fontWeight: 'regular', fontSize: 18, color: '#212121' }}
            items={[
              ['', 256],
              ['接口', 64],
              ['容量', 64, true],
              ['', 56],
              ['设备名', 96],
              ['型号', 208],
              ['序列号', 208],
              ['DEV ID', 96],
              ['已使用', 64, true]
            ]}
          />

          { blocks.filter(blk => blk.isVolumeDevice && blk.fileSystemUUID === volume.uuid)
              .map(blk => (
                <TableDataRow
                  disabled={this.volumeUnformattable(volume).length > 0}
                  selected={cnv && !!this.state.creatingNewVolume.disks.find(d => d === blk)}
                  style={{ marginLeft: 80, fontFamily: '宋体, roboto', fontWeight: 'medium', fontSize: 14, color: '#212121' }}
                  items={[
                    [(cnv ?
                      <Checkbox40
                        fill={accent1Color}
                        checked={!!this.state.creatingNewVolume.disks.find(d => d === blk)}
                        onCheck={() => this.toggleCandidate(blk)}
                      /> :
                      <HDDIcon
                        color="rgba(0,0,0,0.38)"
                        viewBox="0 0 24 24"
                      />), 36
                    ],
                    [diskDisplayName(blk.name), 140],
                    [blk.idBus, 64],
                    [prettysize(blk.size * 512), 64, true],
                    ['', 56],
                    [blk.name, 96],
                    [blk.model || '', 208],
                    [blk.serial || '', 208],
                    [volume.devices.find(d => d.name === blk.name).id.toString(), 96],
                    [volume.devices.find(d => d.name === blk.name).used, 64, true]
                  ]}
                />
              ))
              .reduce((p, c, index, array) => {
                p.push(c)
                p.push(
                  <DoubleDivider
                    grayLeft={index === array.length - 1 ? null : 80}
                    colorLeft={cnv ? 80 : '100%'}
                  />
                )
                return p
              }, []) }

          <div
            style={{ width: '100%',
              height: cnv ? FOOTER_HEIGHT : 0,
              transition: 'height 300ms',
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden' }}
          >
            <div style={{ flex: '0 0 80px' }} />
            <div style={{ fontSize: 14, color: accent1Color }}>
              { cnv && '选择该磁盘阵列中的磁盘建立新的磁盘阵列，会摧毁当前磁盘阵列存储的所有数据。' }
            </div>
          </div>
          <DoubleDivider grayLeft={80} colorLeft={cnv ? 80 : '100%'} />
          <div>
            <div style={{ height: 24 }} />
            <this.UserBadge volume={volume} />
            <div
              style={{ display: 'flex',
                alignItems: 'center',
                marginLeft: 80,
                height: 36,
                marginBottom: 24,
                fontSize: 14
              }}
            >
              { this.state.boot.state === 'maintenance' &&
                this.state.creatingNewVolume === null &&
                !volume.isMissing && typeof volume.wisnuc === 'object' &&
                volume.wisnuc.status === 'READY' &&
                <div>
                  <FlatButton
                    style={{ marginLeft: -8 }}
                    label="启动"
                    primary
                    onTouchTap={(e) => {
                      e.stopPropagation()
                      this.startWisnucOnVolume(volume)
                    }}
                  />
                  <span style={{ width: 8, display: 'inline-block' }} />
                </div>
              }
              { this.state.boot.state === 'maintenance' &&
                this.state.creatingNewVolume === null &&
                <FlatButton
                  style={{ marginLeft: -8 }}
                  label={
                    typeof volume.wisnuc === 'object'
                      ? [[volume.wisnuc.error === 'ENOWISNUC' ? '安装' : '重新安装']]
                      : [['修复问题']] // TODO
                  }
                  primary
                  onTouchTap={() => this.initWisnucOnVolume(volume)}
                />
              }

            </div>
          </div>
        </Paper>
      )
    }

    this.partitionedDiskNewVolumeWarning = (parts) => {
      if (parts.length === 0) { return '选择该磁盘建立新的磁盘阵列，会摧毁磁盘上的所有数据。' }

      return parts
              .reduce((p, c, i, a) => {
                let s
                if (c.isActiveSwap) { s = `${p}在使用的交换分区(${c.name})` } else if (c.isRootFS) { s = `${p}在使用的系统分区(${c.name})` }

                if (i === a.length - 2) {
                  s += '和'
                } else if (i === a.length - 1) {
                  s += '。'
                } else {
                  s += '，'
                }
                return s
              }, '该磁盘不能加入磁盘阵列；它包含')
    }

    this.PartitionedDisk = (props) => {
      // K combinator
      const K = x => y => x

      const disk = props.disk
      const boot = this.state.boot
      const { blocks } = this.state.storage
      const cnv = !!this.state.creatingNewVolume

      const parts = blocks.filter(blk => blk.parentName === disk.name && !blk.isExtended)

      const floatingTitleTop = () => {
        if (!cnv) return 0
        const inner = TABLEHEADER_HEIGHT + (parts.length * TABLEDATA_HEIGHT) + SUBTITLE_MARGINTOP + (2 * SUBTITLE_HEIGHT)
        const outer = HEADER_HEIGHT + TABLEHEADER_HEIGHT

        debug('partitioned disk floatingTitleTop', cnv, inner, outer)

        return this.state.expanded.indexOf(disk) !== -1 ? inner + outer : outer
      }

      // return array of unformattable partitions
      const unformattable = () =>
        parts.reduce((p, c) =>
          (c.isActiveSwap || c.isRootFS) ?
            K(p)(p.push(c)) :
              p, [])

      return (

        <Paper {...props}>
          <div style={styles.paperHeader} onTouchTap={() => this.toggleExpanded(disk)}>
            <div style={{ flex: '0 0 256px' }}>
              <this.DiskTitle disk={disk} top={floatingTitleTop()} />
            </div>
            <div style={{ flex: '0 0 336px' }}>
              <this.DiskHeadline disk={disk} />
            </div>
            <div style={{ marginLeft: 560 }}>
              {this.state.expanded.indexOf(disk) !== -1 ? <UpIcon color={'#9e9e9e'} /> : <DownIcon color={'#9e9e9e'} />}
            </div>
          </div>
          <VerticalExpandable
            height={this.state.expanded.indexOf(disk) !== -1 ?
            SUBTITLE_HEIGHT * 2 +
            TABLEHEADER_HEIGHT +
            TABLEDATA_HEIGHT * parts.length +
            SUBTITLE_MARGINTOP : 0
          }
          >

            <SubTitleRow text="分区信息" disabled={cnv} />
            <TableHeaderRow
              disabled={cnv}
              items={[
                ['', 256],
                ['文件系统', 64],
                ['容量', 64, true],
                ['', 56],
                ['设备名', 96],
                ['路径（挂载点）', 416]
              ]}
            />
            { parts.map(blk => (
              <TableDataRow
                disabled={cnv}
                selected={false}
                items={[
                    ['', 72],
                    [partitionDisplayName(blk.name), 184],
                    [(blk.idFsUsage && blk.fileSystemType) ? blk.fileSystemType : '(未知)', 64],
                    [prettysize(blk.size * 512), 64, true],
                    ['', 56],
                    [blk.name, 96],
                    [blk.isMounted ? blk.mountpoint : '', 416]
                ]}
              />
                ))
                .reduce((p, c, index) => {
                  p.push(c)
                  p.push(<Divider inset />)
                  return p
                }, []) }
            <div style={{ width: '100%', height: SUBTITLE_MARGINTOP }} />

            <SubTitleRow text="磁盘信息" disabled={cnv && this.diskUnformattable(disk).length > 0} />
          </VerticalExpandable>
          <TableHeaderRow
            disabled={cnv && this.diskUnformattable(disk).length > 0}
            items={[
              ['', 256],
              ['接口', 64],
              ['容量', 64, true],
              ['', 56],
              ['设备名', 96],
              ['型号', 208],
              ['序列号', 208],
              ['分区表类型', 112]
            ]}
          />

          <TableDataRow
            disabled={cnv && this.diskUnformattable(disk).length > 0}
            selected={cnv && !!this.state.creatingNewVolume.disks.find(d => d === disk)}
            items={[
              ['', 72],
              ['', 184],
              [disk.idBus, 64],
              [prettysize(disk.size * 512), 64, true],
              ['', 56],
              [disk.name, 96],
              [disk.model || '', 208],
              [disk.serial || '', 208],
              [disk.partitionTableType, 112]
            ]}
          />

          {/* exclusive OR */}
          <DoubleDivider
            grayLeft={unformattable().length > 0 ? (cnv ? 80 : '100%') : null}
            colorLeft={unformattable().length === 0 ? (cnv ? 80 : '100%') : null}
          />

          <div
            style={{ width: '100%',
              height: cnv ? FOOTER_HEIGHT : 0,
              transition: 'height 300ms',
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden' }}
          >
            <div style={{ flex: '0 0 80px' }} />
            <div
              style={{
                fontSize: 14,
                color: unformattable().length > 0 ? 'rgba(0,0,0,0.87)' :
                this.props.muiTheme.palette.accent1Color
              }}
            >
              { cnv && this.partitionedDiskNewVolumeWarning(unformattable()) }
            </div>
          </div>
        </Paper>
      )
    }

    // file system disk is determined by idFsUsage
    this.FileSystemUsageDisk = (props) => {
      const primary1Color = this.props.muiTheme.palette.primary1Color
      const accent1Color = this.props.muiTheme.palette.accent1Color

      const boot = this.state.boot
      const storage = this.state.storage
      const disk = props.disk

      const cnv = !!this.state.creatingNewVolume

      const floatingTitleTop = () => {
        if (!cnv) return 0
        const outer = HEADER_HEIGHT + TABLEHEADER_HEIGHT
        const inner = TABLEHEADER_HEIGHT + TABLEDATA_HEIGHT + SUBTITLE_MARGINTOP + 2 * SUBTITLE_HEIGHT
        return this.state.expanded.indexOf(disk) !== -1 ? inner + outer : outer
      }

      return (
        <Paper {...props}>
          <div style={styles.paperHeader} onTouchTap={() => this.toggleExpanded(disk)}>
            <div style={{ flex: '0 0 256px' }}>
              <this.DiskTitle disk={disk} top={floatingTitleTop()} />
            </div>
            <div style={{ flex: '0 0 336px' }}>
              <this.DiskHeadline disk={disk} />
            </div>
            <div style={{ marginLeft: 560 }}>
              {this.state.expanded.indexOf(disk) !== -1 ? <UpIcon color={'#9e9e9e'} /> : <DownIcon color={'#9e9e9e'} />}
            </div>
          </div>

          <VerticalExpandable
            height={
            this.state.expanded.indexOf(disk) !== -1 ?
              SUBTITLE_HEIGHT * 2 +
              TABLEHEADER_HEIGHT +
              TABLEDATA_HEIGHT +
              SUBTITLE_MARGINTOP : 0
          }
          >

            <SubTitleRow text="文件系统信息" disabled={cnv} />

            <TableHeaderRow
              disabled={cnv}
              items={[
                ['', 256],
                ['文件系统', 184],
                ['文件系统UUID', 304],
                ['路径（挂载点）', 416]
              ]}
            />
            <Divider style={{ marginLeft: 256 }} />
            <TableDataRow
              disabled={cnv}
              selected={false}
              items={[
                ['', 256],
                [disk.fileSystemType, 184],
                [disk.fileSystemUUID, 304],
                [disk.isMounted ? disk.mountpoint : '(未挂载)']
              ]}
            />
            <Divider style={{ marginLeft: 256 }} />
            <div style={{ width: '100%', height: SUBTITLE_MARGINTOP }} />

            <SubTitleRow text="磁盘信息" disabled={cnv && this.diskUnformattable(disk).length > 0} />

          </VerticalExpandable>

          <TableHeaderRow
            disabled={cnv && this.diskUnformattable(disk).length > 0}
            items={[
              ['', 256],
              ['接口', 64],
              ['容量', 64, true],
              ['', 56],
              ['设备名', 96],
              ['型号', 208],
              ['序列号', 208]
            ]}
          />
          <DoubleDivider grayLeft={256} colorLeft={cnv ? 256 : '100%'} />

          <TableDataRow
            disabled={cnv && this.diskUnformattable(disk).length > 0}
            selected={cnv && !!this.state.creatingNewVolume.disks.find(d => d === disk)}
            items={[
              ['', 256],
              [disk.idBus, 64],
              [prettysize(disk.size * 512), 64, true],
              ['', 56],
              [disk.name, 96],
              [disk.model || '', 208],
              [disk.serial || '', 208]
            ]}
          />
          <DoubleDivider colorLeft={cnv ? 80 : '100%'} />
          <div
            style={{ width: '100%',
              height: cnv ? FOOTER_HEIGHT : 0,
              transition: 'height 300ms',
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden' }}
          >
            <div style={{ flex: '0 0 80px' }} />
            <div
              style={{
                fontSize: 14,
                color: (disk.isActiveSwap || disk.isRootFS) ? 'rgba(0,0,0,0.87)' : accent1Color
              }}
            >
              { cnv &&
                (disk.isActiveSwap ? '该磁盘不能加入磁盘阵列；它是在使用的交换文件系统。' :
                  disk.isRootFS ? '该磁盘不能加入磁盘阵列；它是在使用的系统文件系统。' :
                  '选择该磁盘加入新的磁盘阵列，会摧毁该磁盘上的所有数据。'
                )
              }
            </div>
          </div>
        </Paper>
      )
    }

    this.NoUsageDisk = (props) => {
      const primary1Color = this.props.muiTheme.palette.primary1Color
      const accent1Color = this.props.muiTheme.palette.accent1Color

      const boot = this.state.boot
      const storage = this.state.storage
      const disk = props.disk

      const cnv = !!this.state.creatingNewVolume

      const expandableHeight = this.state.expanded.indexOf(disk) !== -1 ?
        24 + SUBTITLE_HEIGHT + SUBTITLE_MARGINTOP : 0

      const floatingTitleTop = () => {
        if (!cnv) return 0
        return HEADER_HEIGHT + TABLEHEADER_HEIGHT + expandableHeight
      }

      return (
        <Paper {...props}>
          <div style={styles.paperHeader} onTouchTap={() => this.toggleExpanded(disk)}>
            <div style={{ flex: '0 0 256px' }}>
              <this.DiskTitle disk={disk} top={floatingTitleTop()} />
            </div>
            <div style={{ flex: '0 0 336px' }}>
              <this.DiskHeadline disk={disk} />
            </div>
            <div style={{ marginLeft: 560 }}>
              {this.state.expanded.indexOf(disk) !== -1 ? <UpIcon color={'#9e9e9e'} /> : <DownIcon color={'#9e9e9e'} />}
            </div>
          </div>

          <VerticalExpandable height={expandableHeight}>

            <div style={{ height: 24, lineHeight: '24px', marginLeft: 256, fontSize: 14 }}>
              该信息仅供参考；有可能磁盘上的文件系统特殊或者较新，本系统未能正确识别。
            </div>
            <div style={{ height: SUBTITLE_MARGINTOP }} />
            <SubTitleRow text="磁盘信息" />

          </VerticalExpandable>

          <TableHeaderRow
            disabled={false}
            items={[
              ['', 256],
              ['接口', 64],
              ['容量', 64, true],
              ['', 56],
              ['设备名', 96],
              ['型号', 208],
              ['序列号', 208]
            ]}
          />
          <DoubleDivider grayLeft={256} colorLeft={cnv ? 256 : '100%'} />
          <TableDataRow
            disabled={false}
            selected={cnv && this.state.creatingNewVolume.disks.find(d => d === disk)}
            items={[
              ['', 256],
              [disk.idBus, 64],
              [prettysize(disk.size * 512), 64, true],
              ['', 56],
              [disk.name, 96],
              [disk.model || '', 208],
              [disk.serial || '', 208]
            ]}
          />
          <DoubleDivider colorLeft={cnv ? 80 : '100%'} />
          <div
            style={{ width: '100%',
              height: cnv ? FOOTER_HEIGHT : 0,
              transition: 'height 300ms',
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden' }}
          >
            <div style={{ flex: '0 0 80px' }} />
            <div
              style={{
                fontSize: 14,
                color: (disk.isActiveSwap || disk.isRootFS) ? 'rgba(0,0,0,0.87)' : accent1Color
              }}
            >
              { cnv && '选择该磁盘加入新的磁盘阵列，会摧毁该磁盘上的所有数据。' }
            </div>
          </div>
        </Paper>
      )
    }
    this.renderAppBar = () => (<AppBar
      style={{ position: 'absolute', height: 128, width: 'calc(100% - 16px)' }}
      showMenuIconButton={false}
      iconElementRight={
        <IconButton onTouchTap={() => window.store.dispatch({ type: 'EXIT_MAINTENANCE' })}>
          <ActionExitToApp />
        </IconButton>}
      zDepth={2}
    />)

    this.renderCat = () => (<CatSilhouette
      style={{ position: 'absolute',
        top: 34,
        left: 48,
        width: 120,
        height: 114,
        zIndex: 10000
      }}
      color="#E0E0E0"
    />)
  }

  componentDidMount() {
    this.reloadBootStorage()
  }

  componentWillUnmount() {
    this.unmounted = true
  }


  renderBootStatus() {
    const data = window.store.getState().maintenance.device
    const TextMaintence = `该设备已正常启动，此界面仅用于浏览；设备的ip为 ${data.address}，model为 ${data.model}，serial为 ${data.serial}。`
    // debug("data = window.store.getState().maintenance = ", data);
    return (
      <this.TextButtonTop
        text={this.state.boot.state !== 'maintenance' ? TextMaintence : ''}
        disabled={this.state.boot.state !== 'maintenance'}
      />
    )
  }
  renderTitle() {
    return (
      <div
        style={{
          position: 'absolute',
          top: 64,
          height: 64,
          width: 'calc(100% - 16px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            width: 1200,
            fontSize: 24,
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            zIndex: 1200
          }}
        >
          <div style={{ width: 72, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BallOfYarn style={{ width: 24, height: 24 }} color="#FFF" />
          </div>
          <div>
            WISNUC - {
              !this.state.boot ? '' :
              this.state.boot.state === 'maintenance' ? '维护模式' : '已正常启动'
            }
          </div>
        </div>
      </div>
    )
  }

  render() {
    // debug('main render', this.state)

    const primary1Color = this.props.muiTheme.palette.primary1Color
    const accent1Color = this.props.muiTheme.palette.accent1Color

    const cnv = !!this.state.creatingNewVolume
    const raidDisabled = !this.state.creatingNewVolume || this.state.creatingNewVolume.disks.length < 2
    const bright = 'rgba(255,255,255,0.7)'
    const dim = 'rgba(0,0,0,0.54)'

    const cardStyle = {
      width: 1200,
      marginBottom: cnv ? 4 : 24,
      transition: 'margin-bottom 300ms'
    }

    if (typeof this.state.boot !== 'object' || typeof this.state.storage !== 'object') return <div />

    return (

      <div style={{ width: '100%', height: '100%', backgroundColor: '#F5F5F5', overflowY: 'scroll' }}>

        { this.renderAppBar() }
        { this.renderCat() }
        { this.renderTitle() }

        <this.OperationDialog />

        {/* page container */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* placeholde for AppBar */}
          <div style={{ width: '100%', height: 128, marginBottom: 24 }} />

          {/* gray box begin */}
          <div
            style={{
              backgroundColor: cnv ? '#E0E0E0' : '#F5F5F5',
              padding: cnv ? '24px 16px 24px 16px' : 0,
              transition: 'all 300ms',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >

            {/* top panel selector */}
            <div style={{ width: 1200, height: cnv ? 136 - 48 - 16 : 48, transition: 'height 300ms' }}>
              { cnv ? <this.NewVolumeTop /> : this.renderBootStatus()}
            </div>

            { typeof this.state.boot === 'object' && typeof this.state.storage === 'object' &&
              this.state.storage.volumes.map(vol =>
                <this.BtrfsVolume style={this.cardStyle(vol)} volume={vol} zDepth={this.cardDepth(vol)} />) }

            { typeof this.state.boot === 'object' && typeof this.state.storage === 'object' &&
              this.state.storage.blocks
                .filter(blk => blk.isDisk && !blk.isVolumeDevice)
                .map(disk => React.createElement(
                  disk.isPartitioned ? this.PartitionedDisk :
                  disk.idFsUsage ? this.FileSystemUsageDisk : this.NoUsageDisk, {
                    style: this.cardStyle(disk), zDepth: this.cardDepth(disk), disk
                  }, null)) }

          </div>
          {/* gray box end */}

          <div style={{ width: '100%', height: 48 }} />
        </div>

        <Operation substate={this.state.dialog} />

        <InitVolumeDialogs
          volume={this.state.initVolume}
          onRequestClose={() => this.setState({ initVolume: undefined })}
          onResponse={() => this.reloadBootStorage()}
        />

      </div>
    )
  }
}

export default Maintenance
