import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'
import styles from '../styles/Home.module.css'
import { NextLinkComposed } from '../components/Link'

const label = {
  inputProps: {
    "aria-label": "Switch Demo"
  }
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Typography variant="h2" gutterBottom sx={{
        fontWeight: 'bold'
      }}>
        Play With Ray Tracing
      </Typography>
      <Button 
        component={NextLinkComposed}
        to={{
          pathname: '/play'
        }}
        variant="contained" 
        color="primary"
      >
        Get Started
      </Button>
    </div>
  )
}
