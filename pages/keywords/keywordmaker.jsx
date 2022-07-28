import { useState, useRef } from 'react'

import Banner from '../../components/Banner'
import Page from '../../components/common/Page'
import PageHeader from '../../components/common/PageHeader'
import { APP_NAME } from '../../app/appConfig'
import PageBody from '../../components/common/PageBody'
import { Alert, AlertTitle, Button, Snackbar } from '@mui/material'
import { FaCopy } from 'react-icons/fa'
import { IoIosRefresh } from 'react-icons/io'

const separators = [
  {
    title: 'Comma',
    slug: 'comma',
    value: ','
  },
  {
    title: 'Space',
    slug: 'space',
    value: ' '
  },
  {
    title: 'Dash',
    slug: 'dash',
    value: '-'
  },
  {
    title: 'Pipe',
    slug: 'pipe',
    value: '|'
  },
  {
    title: 'Semicolon',
    slug: 'semicolon',
    value: ';'
  },
  {
    title: 'Colon',
    slug: 'colon',
    value: ':'
  },
  {
    title: 'Tab',
    slug: 'tab',
    value: '\t'
  },
  {
    title: 'Newline',
    slug: 'newline',
    value: '\n'
  }
]

const getSeparator = (slug) => {
  const separator = separators.find(separator => separator.slug === slug)
  return separator.value
}

const KeywordMaker = () => {
  const [keywords, setKeywords] = useState('')
  const [finalCopy, setFinalCopy] = useState('')

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const formRef = useRef(null)
  const separatorRef = useRef(null)
  const keywordsInputRef = useRef(null)

  const processInput = (separator, keywords) => {
    const keywordsArray = keywords.split(separator)
    return keywordsArray.join(', ')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const keywords = keywordsInputRef.current.value
    const separator = separatorRef.current.value
    if (separator === '' || keywords === '') {
      openAlert('Please enter a separator and keywords', 'error')
      return
    }
    setKeywords(processInput(getSeparator(separator), keywords))
    formRef.current.reset()
    separatorRef.current.focus()
  }

  const addToFinalCopy = () => {
    if (keywords === '') {
      openAlert('Please enter keywords', 'error')
      return
    }
    if (finalCopy === '') {
      setFinalCopy(keywords)
    } else {
      setFinalCopy(current => current + ", " + keywords)
    }
  }

  const openAlert = (msg, severity) => {
    setAlert({
      open: true,
      message: msg,
      severity: severity
    })
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlert({
      open: false,
      message: '',
      severity: 'success'
    })
  };

  const copyToClipboard = () => {
    const textarea = document.createElement('textarea')
    textarea.value = finalCopy;
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    openAlert('Keywords copied to clipboard', 'success')
  }


  return (
    <Page>
      <PageHeader>
        <title>{APP_NAME}Keyword Maker Tool</title>
      </PageHeader>
      <Banner title={"Keyword Maker Tool"} tagline="Arrange your keywords before you copy them to your site." />
      <PageBody>

        <div className="container my-5">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <div className="custom-card p-2 py-md-5">
                <div>
                  <h3 className='text-center m-0'>Enter Keywords</h3>
                </div>
                <div>
                  <form className="form-holder mt-4" ref={formRef}>
                    <div className='form-group mb-3'>
                      <label htmlFor="keywords" className='mb-2'>Select separator</label>
                      <select className="form-select shadow-none outline-none" id="keywords" ref={separatorRef}>
                        {separators.map(separator => (
                          <option key={separator.slug} value={separator.slug}>{separator.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className='form-group mb-3'>
                      <label htmlFor="keywords" className='mb-2'>Paste keywords</label>
                      <textarea className='form-control shadow-none outline-none' ref={keywordsInputRef} id='keywords' rows='10'></textarea>
                    </div>
                    <div className="form-group">
                      <Button type="submit" className="btn custom-btn btn-primary shadow-none outline-none" onClick={handleSubmit}>Submit</Button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="container my-5">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <div className="custom-card p-2 py-md-5">
                <div>
                  <h3 className='text-center m-0 mb-2'>Processed Keywords</h3>
                  <Alert severity='info'>
                    <AlertTitle>Use</AlertTitle>
                    <p className='m-0 '>
                      Use this input to make any other necessary changes before adding to final copy.
                    </p>
                  </Alert>
                </div>
                <div className='mt-3'>
                  <textarea className='form-control keywordsOutput mb-3 shadow-none outline-none' onChange={e => setKeywords(e.target.value)} rows='10' value={keywords}></textarea>
                  <div className="form-group">
                    <Button type="submit" className="btn custom-btn shadow-none outline-none" onClick={addToFinalCopy}>Add To Final Copy</Button>
                    <Button className="btn custom-btn shadow-none outline-none ms-3" onClick={e => setFinalCopy('')}>
                      <IoIosRefresh className='me-3' />
                      Reset Final Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container my-5">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <div className="custom-card p-2 py-md-3">
                <h3 className='text-center m-0 mb-3'>Final Copy</h3>
                <div>
                  {finalCopy}
                </div>
                <div className='mt-3'>
                  <Button className="btn custom-btn shadow-none outline-none" onClick={copyToClipboard}>
                    <FaCopy className='me-3' />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>


      </PageBody>
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleAlertClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleAlertClose} severity={alert.severity} sx={{ width: '100%' }} variant='filled'>
          {alert.message}
        </Alert>
      </Snackbar>

    </Page>
  )
}

export default KeywordMaker