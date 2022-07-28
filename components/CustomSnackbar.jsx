import { useEffect, useState } from 'react'
import { Alert, Snackbar } from '@mui/material'

const CustomSnackbar = ({ alert }) => {
  const [alert1, setAlert] = useState(alert)
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlert({
      open: false,
      message: '',
      severity: 'success'
    })
  };
  useEffect(() => {
    setAlert(alert)
  }, [alert])
  return (

    <Snackbar open={alert1.open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert onClose={handleClose} severity={alert1.severity} sx={{ width: '100%' }} variant='filled'>
        {alert1.message}
      </Alert>
    </Snackbar>

  )
}

export default CustomSnackbar