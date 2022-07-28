import { useEffect, useRef, useState } from 'react'
import Banner from '../../components/Banner'
import Page from '../../components/common/Page'
import PageHeader from '../../components/common/PageHeader'
import { APP_NAME } from '../../app/appConfig'
import PageBody from '../../components/common/PageBody'
import { FaArrowRight, FaMinus, FaPlus } from 'react-icons/fa'
import { IoMdRefresh } from 'react-icons/io'

import CodeMirror from '@uiw/react-codemirror';
import { Alert, AlertTitle, Button, Snackbar } from '@mui/material'
import validateUrl from '../../app/appFunctions'

const fields = {
  "@context": "http://schema.org",
  "@type": "Organization",
  "name": "",
  "url": "",
  "sameAs": [

  ]
}

const Organization = () => {
  const [schema, setSchema] = useState(fields)
  const [showSchema, setShowSchema] = useState(false)

  const schemaPreviewRef = useRef(null)

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const openAlert = (severity, msg) => {
    setAlertSeverity(severity)
    setAlertMessage(msg)
    setAlertOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertOpen(false);
  };

  const updateSchema = (field, value) => {
    setSchema({ ...schema, [field]: value })
  }

  const addSameAs = () => {
    setSchema({ ...schema, sameAs: [...schema.sameAs, ''] })
  }

  const removeSameAs = (index) => {
    const newSameAs = [...schema.sameAs]
    if (newSameAs.length > 1) {
      newSameAs.splice(index, 1)
      setSchema({ ...schema, sameAs: newSameAs })
    }
  }

  const updateSameAs = (url, index) => {
    const newSameAs = [...schema.sameAs]
    newSameAs[index] = url
    setSchema({ ...schema, sameAs: newSameAs })
  }

  const reset = () => {
    setSchema(fields)
    setShowSchema(false)
  }

  const proceed = (e) => {
    e.preventDefault()
    if (schema.name === "" || schema.url === "") {
      openAlert('error', 'Please fill in the name and url of the organization')
      return
    }

    if (!validateUrl(schema.url)) {
      openAlert('error', 'Please enter a valid url')
      return
    }

    if (schema.sameAs.length === 0) {
      openAlert('error', 'Please enter at least one sameAs url')
      return
    }
    // Loop through same as urls and check if they are valid
    for (let i = 0; i < schema.sameAs.length; i++) {
      if (!validateUrl(schema.sameAs[i])) {
        openAlert('error', 'Please enter a valid sameAs url - ' + schema.sameAs[i])
        return
      }
    }

    setShowSchema(true)
    setTimeout(() => {
      window.scroll({ top: schemaPreviewRef.current.offsetTop, left: 0, behavior: 'smooth' })
    }, 300);
  }

  const copyToClipboard = () => {
    const textarea = document.createElement('textarea')
    textarea.value = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    openAlert('success', 'Schema copied to clipboard')
  }

  useEffect(() => {
    setShowSchema(false)
    if (Object.keys(schema.sameAs).length === 0) {
      addSameAs()
    }
  }, [schema])

  return (
    <Page>
      <PageHeader>
        <title>{APP_NAME}Organization Schema Generation</title>
      </PageHeader>
      <Banner title={"Organization Schema Generation"} tagline="Generate organization schemas for your website." />
      <PageBody>
        <div className="container py-5">
          <div className="mb-3">
            <Alert severity='info' elevation={6}>
              <AlertTitle>NB: About tool</AlertTitle>
              <p>
                Currently this schema only takes a generic organization structure inputs. That is, the minimal data required to describe any organization. More specific options will be available in the future.
              </p>
            </Alert>
          </div>
          <div className="row mb-5">
            <form>
              <div className="col-md-6 offset-md-3">
                <div className="custom-form-holder">
                  <h2 className='text-center'>Enter Details</h2>
                  <div className="form-group mb-3">
                    <label htmlFor="org-name" className='mb-2'>Organization Name</label>
                    <input type="text" id='org-name' onChange={e => updateSchema('name', e.target.value)} className="form-control shadow-none" placeholder='Organization Name' autoComplete='none' />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="org-name" className='mb-2'>Organization Url</label>
                    <input type="text" id='org-name' onChange={e => updateSchema('url', e.target.value)} className="form-control shadow-none" placeholder='Organization URL' autoComplete='none' />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="org-name" className='mb-2'>Organization Social Media</label>
                    {
                      Object.keys(schema.sameAs).map((key, index) => {
                        return (
                          <div key={key} className="d-flex">
                            <div className='w-75'>
                              <input type="text" className='form-control shadow-none mb-2' onChange={e => updateSameAs(e.target.value, key)} value={schema.sameAs[key]} placeholder="https://facebook.com/livesoftwaredeveloper" />
                            </div>
                            <div>
                              {
                                index === Object.keys(schema.sameAs).length - 1 ? (
                                  <>
                                    <button className='btn shadow-none outline-none' onClick={() => removeSameAs(index)} role="button" type='button'>
                                      <FaMinus />
                                    </button>
                                    <button className='btn shadow-none outline-none ms-2' onClick={addSameAs} role="button" type='button'>
                                      <FaPlus />
                                    </button>
                                  </>
                                )
                                  :
                                  <>
                                    <button className='btn shadow-none outline-none' onClick={() => removeSameAs(index)} role="button" type='button'>
                                      <FaMinus />
                                    </button>
                                  </>
                              }
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>

                  <div className="form-group d-flex">
                    <button className='btn shadow-none outline-none btn-secondary' role="button" type='reset' onClick={reset}>
                      <IoMdRefresh size={26} />
                      <span className='ms-2'>Reset</span>
                    </button>
                    <button className='btn shadow-none outline-none btn-primary ms-auto' role="button" type='submit' onClick={proceed}>
                      <FaArrowRight size={20} />
                      <span className='ms-2'>Proceed</span>
                    </button>
                  </div>

                </div>

              </div>
            </form>
          </div>

          <div className="row pt-5" ref={schemaPreviewRef}>
            <div className="col-md-6 offset-md-3">
              {
                showSchema && (
                  <div className="custom-form-holder">
                    <CodeMirror
                      value={`<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`}
                      editable={false}
                      options={{
                        theme: 'monokai',
                        keyMap: 'sublime',
                        mode: 'json-ld',
                      }}
                    />
                    <div className='mt-3 d-flex'>
                      <Button className="btn btn-outline-primary outline-none shadow-none custom-btn text-capitalize" onClick={copyToClipboard}>Copy to clipboard</Button>
                      <a href="https://validator.schema.org/" target='_blank' className="btn outline-none shadow-none custom-btn text-capitalize ms-auto" rel="noreferrer">Validate your Schema</a>
                    </div>
                  </div>
                )
              }
            </div>
          </div>

        </div>

        <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }} variant='filled'>
            {alertMessage}
          </Alert>
        </Snackbar>

      </PageBody>
    </Page>
  )
}

export default Organization