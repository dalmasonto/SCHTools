
import { useState, useEffect } from 'react'

import { Alert, AlertTitle, Button, IconButton } from '@mui/material'
import { FaChevronRight, FaMinus, FaPlus, FaTrash } from 'react-icons/fa'

import { APP_NAME } from '../../../app/appConfig'
import Banner from '../../../components/Banner'
import Page from '../../../components/common/Page'
import PageBody from '../../../components/common/PageBody'
import PageHeader from '../../../components/common/PageHeader'
import { IoIosArrowDropright, IoIosArrowForward } from 'react-icons/io'
import CustomSnackbar from '../../../components/CustomSnackbar'
import validateUrl from '../../../app/appFunctions'

import { useDispatch, useSelector } from 'react-redux'
import { addgroup, removegroup, selectApp } from '../../../reducers/appreducer'

import { nanoid } from 'nanoid'

const Addlinks = () => {
  const [groups, setGroups] = useState([])

  const [groupName, setGroupName] = useState('')
  const [groupLinks, setGroupLinks] = useState([])
  const [socialMediaPlatforms, setSocialMediaPlatforms] = useState([
    'Facebook', 'Twitter', 'LinkedIn', 'WhatsApp', 'Telegram', 'Website', 'Instagram', 'Reddit', 'Medium', 'Patreon', 'TikTok', 'Line', "Snapchat", "Viber", "WeChat", "Vimeo", "Youtube", "Tumblr", "Pinterest", "SoundCloud", "Flickr", "Twitch", "Vine", "GitHub", "Steam", "Discord", "Etsy", "Dribbble", 'Behance', "Foursquare", "Resource", "Other"
  ])

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const { linkgroups } = useSelector(selectApp)
  const dispatch = useDispatch()

  const addLink = () => {
    const link = {
      platform: '',
      link: ''
    }
    setGroupLinks([...groupLinks, link])
  }

  const updateLink = (index, key, value) => {
    const alllinks = [...groupLinks];
    alllinks[index][key] = value
    setGroupLinks(alllinks)
  }

  const removeLink = (index) => {
    const alllinks = [...groupLinks]
    if (alllinks.length > 1) {
      alllinks.splice(index, 1)
      setGroupLinks(alllinks)
    }
  }

  const addGroup = (event) => {
    event.preventDefault()

    if (groupName === "") {
      openAlert("Please Enter group Name", "error")
      return
    }
    else {
      const group_id = nanoid()

      // Check all links whehter they are valid or not before saving the group
      const alllinks = [...groupLinks]
      const invalidLinks = alllinks.filter((link, index) => {
        if (link.platform === "") {
          openAlert(`Please select platform for link ${index + 1}`, "error")
          return true
        }
        else if (!validateUrl(link.link)) {
          openAlert(`Please enter valid URL for ${link.platform}`, "error")
          return true
        }
        return false
      })

      if (invalidLinks.length > 0) {
        return
      }

      const newgroup = {
        id: group_id,
        name: groupName,
        links: groupLinks,
      }

      dispatch(addgroup(newgroup))
      setGroupName('')
      setGroupLinks([])
    }
  }

  const openAlert = (msg, severity) => {
    setAlert({
      open: true,
      message: msg,
      severity: severity
    })
  };

  const deleteGroup = (id) => {
    dispatch(removegroup(id))
    openAlert(`Group Deleted`, "success")
  }

  useEffect(() => {
    if (groupLinks.length === 0) {
      addLink()
    }
  }, [groupLinks])

  useEffect(() => {
    console.log(linkgroups)
    // setGroups(linkgroups)
  }, [linkgroups])

  return (
    <Page>
      <PageHeader>
        <title>{APP_NAME}Adding Social Links</title>
      </PageHeader>
      <Banner title={"Add Social Links"} tagline={<>Add social links to the platform to quickly integrate them to your content when sharing <br />or creating youtube video description</>} />
      <PageBody>
        <div className="container py-5">
          <div className="mb-5">
            <Alert severity='info' elevation={6}>
              <AlertTitle>NB: About tool</AlertTitle>
              <p>
                This tool currently stores data locally, incase you clear your browser cache the data is also deleted.
                <br />
                If your browser does not store cache, then the tool won&apos;t be of any help!
              </p>
            </Alert>
          </div>

          <div className="mt-5">
            <div className="row">
              <div className="col-md-8 offset-md-2">

                {
                  groups.map((group, index) => (
                    <div key={`link__group__${index}`} className="custom-card p-2 mb-3">
                      <div className="d-flex align-items-center">
                        <h4 className='m-0 p-0 ms-md-3'>{group.name}</h4>
                        <div className='ms-auto h-100 d-flex align-items-center'>
                          <span className='me-2'>{group.links.length}</span>
                          <IconButton>
                            <IoIosArrowForward />
                          </IconButton>
                          <IconButton className="ms-2 text-danger" onClick={e => deleteGroup(group.id)}>
                            <FaTrash size={16} />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  ))
                }

              </div>
            </div>
          </div>

          <div className='mt-2'>
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <div className="custom-card p-2 py-md-4">
                  <h6 className="m-0 p-0 text-center">Add new group</h6>
                  <h2 className='text-center mb-3'>Enter Group Details</h2>
                  <form action="">
                    <div className="form-group mb-3">
                      <label htmlFor="video-title" className='mb-2'>Group Name</label>
                      <input type="text" className="form-control shadow-none outline-none" id="video-title" placeholder="Enter group Name ie Live Software Developer Links" value={groupName} onChange={e => setGroupName(e.target.value)} />
                    </div>
                    <div className="form-group mb-3">
                      <label className='mb-2'>Social Media Links</label>
                      {
                        groupLinks.map((link, index) => {
                          return (
                            <div key={`social_link__${index}`}>

                              <div className="row">
                                <div className="col-md-3">
                                  <select className='form-select shadow-none mb-2' onChange={e => updateLink(index, 'platform', e.target.value)} value={link.platform}>
                                    <option value="">Select</option>
                                    {
                                      Object.keys(socialMediaPlatforms).map((key, index) => (
                                        <option key={index} value={socialMediaPlatforms[key]}>{socialMediaPlatforms[key]}</option>
                                      ))
                                    }
                                  </select>
                                </div>
                                <div className="col-md-7">
                                  <input type="text" className='form-control shadow-none mb-2' onChange={e => updateLink(index, 'link', e.target.value)} value={link.link} placeholder="Enter Link here" />
                                </div>
                                <div className="col-md-2">
                                  <div>
                                    {
                                      index === groupLinks.length - 1 ? (
                                        <>
                                          <button className='btn shadow-none outline-none' onClick={() => removeLink(index)} role="button" type='button'>
                                            <FaMinus />
                                          </button>
                                          <button className='btn shadow-none outline-none ms-2' onClick={addLink} role="button" type='button'>
                                            <FaPlus />
                                          </button>
                                        </>
                                      )
                                        :
                                        <>
                                          <button className='btn shadow-none outline-none' onClick={() => removeLink(index)} role="button" type='button'>
                                            <FaMinus />
                                          </button>
                                        </>
                                    }
                                  </div>
                                </div>
                              </div>

                            </div>
                          )
                        })
                      }
                    </div>
                    <div className="form-group mt-2">
                      <Button className="btn custom-btn shadow-none outline-none" onClick={addGroup}>
                        <FaPlus size={22} />
                        <span className='ms-3'>
                          Add Group
                        </span>
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageBody>
      <CustomSnackbar alert={alert} />
    </Page >

  )
}

export default Addlinks