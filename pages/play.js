import { useState } from 'react'
import dynamic from 'next/dynamic'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Select from '@mui/material/Select'
import InboxIcon from '@mui/icons-material/Inbox'
import MenuItem from '@mui/material/MenuItem'

const MainCanvas = dynamic(() => import('../components/MainCanvas'), { ssr: false })

function BoxParameterForm({ onDone }) {
  const [ length, setLength ] = useState(0)
  const [ x, setX ] = useState(0)
  const [ y, setY ] = useState(0)
  const [ z, setZ ] = useState(0)
  const onChangeHandler = (handler => (e) => {
    console.log(e)
    const v = parseInt(e.target.value)
    handler(v)
  })
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <TextField type="number" value={length} onChange={onChangeHandler(setLength)} label="Length"></TextField>
      <TextField type="number" value={x} onChange={onChangeHandler(setX)} label="X"></TextField>
      <TextField type="number" value={y} onChange={onChangeHandler(setY)} label="Y"></TextField>
      <TextField type="number" value={z} onChange={onChangeHandler(setZ)} label="Z"></TextField>
      <Button
        variant="contained"
        onClick={() => {
          onDone({
            length,
            x,
            y,
            z
          })
        }}
      >
        Continue
      </Button>
    </Box>
  )
}

function SphereParameterForm({ onDone }) {
  const [ radius, setRadius ] = useState(0)
  const [ x, setX ] = useState(0)
  const [ y, setY ] = useState(0)
  const [ z, setZ ] = useState(0)
  const onChangeHandler = (handler => (e) => {
    console.log(e)
    const v = parseInt(e.target.value)
    handler(v)
  })
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <TextField type="number" value={radius} onChange={onChangeHandler(setRadius)} label="Radius"></TextField>
      <TextField type="number" value={x} onChange={onChangeHandler(setX)} label="X"></TextField>
      <TextField type="number" value={y} onChange={onChangeHandler(setY)} label="Y"></TextField>
      <TextField type="number" value={z} onChange={onChangeHandler(setZ)} label="Z"></TextField>
      <Button
        variant="contained"
        onClick={() => {
          onDone({
            radius,
            x,
            y,
            z
          })
        }}
      >
        Continue
      </Button>
    </Box>
  )
}

export default function PlayPage() {
  const [ newObjectType, setNewObjectType ] = useState('box')
  const [ objects, setObjects ] = useState([])
  const [ showDialog, setShowDialog ] = useState(false)

  function onClickAdd() {
    setShowDialog(true)
  }

  function onCloseDialog() {
    setShowDialog(false)
  }

  function onDoneInputObjectParams (payload) {
    setObjects(currentObjects => {
      const newObject = {
        type: newObjectType,
        params: payload
      }
      return [
        ...currentObjects,
        newObject
      ]
    })
    setShowDialog(false)
  }

  function renderParameterForm () {
    switch (newObjectType) {
      case 'box': return (<BoxParameterForm onDone={onDoneInputObjectParams} />);
      case 'sphere': return (<SphereParameterForm onDone={onDoneInputObjectParams} />);
      default: return null;
    }
  }

  return (
    <div>
      <Drawer
        sx={{
          width: 256,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 256,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" sx={{
            fontWeight: 'bold'
          }}>
            Play With Ray Tracing
          </Typography>
        </Toolbar>
        <Divider />
        <List>

          <ListItem>
            <Box>
              <Select
                label="Pilih Tipe Objek"
                value={newObjectType}
                onChange={e => {
                  setNewObjectType(e.target.value)
                }}
                sx={{
                  width: '100%'
                }}
              >
                <MenuItem value={"box"}>Box</MenuItem>
                <MenuItem value={"sphere"}>Sphere</MenuItem>
                <MenuItem value={"pyramid"}>pyramid</MenuItem>
              </Select>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  mt: 2,
                  fontSize: 10,
                  pt: 1
                }}
                css={{
                  iconSizeMedium: 8
                }}
                onClick={onClickAdd}
              >
                <InboxIcon/>
                Tambah Object
              </Button>
            </Box>
          </ListItem>

        </List>        
      </Drawer>

      <div
        style={{
          paddingLeft: '256px',
          height: '100vh',
          width: '100vw',
          display: 'flex',
        }}
      >
        <MainCanvas
          objects={objects}
        ></MainCanvas>
      </div>

      <Dialog onClose={onCloseDialog} open={showDialog}>
        <DialogTitle>Parameter Object</DialogTitle>
        {renderParameterForm()}
      </Dialog>

    </div>
  )
  
}
