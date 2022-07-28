import { useState } from 'react';
import { Alert, Button, Snackbar } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import CustomSnackbar from './CustomSnackbar';

const FinalOutput = ({ title, valuetocopy, successcopymsg }) => {

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const copyToClipboard = () => {
    const textarea = document.createElement('textarea')
    textarea.value = valuetocopy;
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    openAlert(successcopymsg, 'success')
  }

  const openAlert = (msg, severity) => {
    setAlert({
      open: true,
      message: msg,
      severity: severity
    })
  };


  return (
    <>
      <div className="container py-5">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="custom-card mb-2 p-2 py-3">
              <h3 className="text-center m-0 p-0 mb-2">{title}</h3>
              <CodeMirror
                value={valuetocopy}
                editable={false}
                options={{
                  theme: 'monokai',
                  keyMap: 'sublime',
                  mode: 'json-ld',
                }}
                maxWidth="100%"
                width='100%'
                className="custom-code-mirror"
              />
              {/* <div value={valuetocopy} className="form-control w-100 shadow-none outline-none custom-content">
                {valuetocopy}
              </div> */}
            </div>
            <div className='mt-3'>
              <Button className="btn btn-outline-primary outline-none shadow-none custom-btn text-capitalize" onClick={copyToClipboard}>Copy to clipboard</Button>
            </div>
            <CustomSnackbar alert={alert} />
          </div>
        </div>
      </div>
    </>
  )
}

export default FinalOutput