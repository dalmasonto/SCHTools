import { useState, useEffect } from 'react'
import { Alert, AlertTitle, Button, Popover, TextareaAutosize } from '@mui/material'

import { APP_NAME } from '../../../app/appConfig'
import Banner from '../../../components/Banner'
import Page from '../../../components/common/Page'
import PageBody from '../../../components/common/PageBody'
import PageHeader from '../../../components/common/PageHeader'

import CustomModal from '../../../components/modals/CustomModal'

// import CodeMirror from '@uiw/react-codemirror';

import { FaInfoCircle } from 'react-icons/fa'
import FinalOutput from '../../../components/FinalOutput'
import { useDispatch, useSelector } from 'react-redux'
import { selectApp } from '../../../reducers/appreducer'
import CustomSnackbar from '../../../components/CustomSnackbar'

import keyword_extractor from 'keyword-extractor'
import CustomPopover from '../../../components/popover/CustomPopover'

const getCountClass = (count) => {
  let c_class = ''
  if (count === 0 || count > 6) {
    c_class = "danger"
  }
  else if (count > 0 && count < 3) {
    c_class = "warning"
  }
  else if (count >= 3 && count <= 6) {
    c_class = "success"
  }
  return c_class
}

function countOccurences(string, word) {
  return string.split(word).length - 1;
}

const Videodescription = () => {
  const [title, setTitle] = useState('')
  const [titleKeywords, setTitleKeywords] = useState([])
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [keywords, setKeywords] = useState('')
  const [splitKeywords, setSplitKeywords] = useState([])

  const [chapters, setChapters] = useState('')
  const [chapterGroups, setChapterGroups] = useState([])

  const [socialLinks, setSocialLinks] = useState('')
  const [groups, setGroups] = useState([])

  const [finalDescription, setFinalDescription] = useState(null)

  const { linkgroups, chaptergroups } = useSelector(selectApp)
  const dispatch = useDispatch()

  const [selectedKeyword, setSelectedKeyword] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const makeFinalDescription = (e) => {
    e.preventDefault()
    let socialdesc = ``
    let chapterdesc = ``
    if (socialLinks !== '') {
      socialdesc = `\nFollow us through :\n`
      const links = groups.find(group => group.id === socialLinks)?.links
      if (links) {
        links.forEach((link) => {
          socialdesc += `${link.platform} : ${link.link}\n`
        })
      }
    }
    else {
      openAlert('No group of social links selected, you might consider to add some in the future.', 'info')
    }


    if (chapters !== '' || chapters !== null || chapters !== undefined) {
      const chaps = chapterGroups.find(group => group.id === chapters)?.chapters
      if (chaps) {
        chapterdesc = `\nChapters :\n`
        chaps.forEach((chap) => {
          chapterdesc += `${chap.start} : ${chap.title}\n`
        })
      }
      else {
        openAlert('No chapter group selected, you might consider to add some in the future.', 'info')
      }
    }

    const desc = `${title} \n\n${description} \nQuick keywords :\n${keywords} \n\nRelated tags :\n${tags} \n${socialdesc} ${chapterdesc} \nVideo description compiled by Super Code Hive Tools: https://supercodehive.com`
    setFinalDescription(desc)

  }
  const insertMyText = (e, text) => {
    let textToInsert = text
    let cursorPosition = e.target.selectionStart
    let textBeforeCursorPosition = e.target.value.substring(0, cursorPosition)
    let textAfterCursorPosition = e.target.value.substring(cursorPosition, e.target.value.length)
    e.target.value = textBeforeCursorPosition + textToInsert + textAfterCursorPosition
  }

  const openAlert = (msg, severity) => {
    setAlert({
      open: true,
      message: msg,
      severity: severity
    })
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
    const extracted_keywords = keyword_extractor.extract(e.target.value, {
      language: 'english',
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true,
      // return_chained_words: true,
      remove_duplicate_chained_words: true,

    })
    const new_kywords = []
    extracted_keywords.forEach((keyword) => {
      const title_keyword = {
        keyword: keyword.trim(),
        count: countOccurences(description, keyword.trim())
      }
      new_kywords.push(title_keyword)

    })
    setTitleKeywords(new_kywords)
  }

  const handleKeywordsChange = (e) => {
    setKeywords(e.target.value)
    const keys = e.target.value.split(',')
    const new_kywords = []
    keys.forEach((keyword) => {
      if (keyword.trim() !== '') {
        const title_keyword = {
          keyword: keyword.toLowerCase(),
          count: countOccurences(description.toLowerCase(), keyword.trim().toLowerCase())
        }
        new_kywords.push(title_keyword)
      }
    })
    setSplitKeywords(new_kywords)
  }

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value)
    const desc = e.target.value || ""
    // Loop through the splitKeywords array and update the count and the titleKeywords
    const new_kywords = []
    splitKeywords.forEach((keyword) => {
      let _keyword = {
        keyword: keyword.keyword,
        count: countOccurences(desc?.toLowerCase(), keyword.keyword)
      }
      new_kywords.push(_keyword)
    })
    setSplitKeywords(new_kywords)

    const othertitlekeywords = []
    titleKeywords.forEach((keyword) => {
      let _keyword = {
        keyword: keyword.keyword,
        count: countOccurences(desc?.toLowerCase(), keyword.keyword)
      }
      othertitlekeywords.push(_keyword)
    })
    setTitleKeywords(othertitlekeywords)

  }

  const openHightlightModal = (keyword) => {
    selectKeyword(keyword)
    setModalOpen(true)
  }

  const selectKeyword = (keyword) => {
    setSelectedKeyword(keyword)
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

  useEffect(() => {
    setGroups(linkgroups)
  }, [linkgroups])

  useEffect(() => {
    setChapterGroups(chaptergroups)
  }, [chaptergroups])

  return (
    <Page>
      <PageHeader>
        <title>{APP_NAME}YouTube Video Description</title>
      </PageHeader>
      <Banner title={"YouTube Video Description"} tagline="Make YouTube Video description easily" />
      <PageBody>

        <CustomModal modalOpen={modalOpen} description={description} selectedKeyword={selectedKeyword} onclose={handleModalClose} keywords={titleKeywords.concat(splitKeywords)} selectKeyword={selectKeyword} />

        <div className="container my-5">
          <div className="row">
            {/* <div className="col-md-2"></div> */}
            <div className="col-md-8">
              <div className="custom-card p-2 py-md-4">
                <form>
                  <div className="form-group mb-3">
                    <label htmlFor="video-title" className='mb-2'>Video Title</label>
                    <input type="text" className="form-control shadow-none outline-none" id="video-title" placeholder="Enter video title" value={title} onChange={e => handleTitleChange(e)} />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="video-keywords" className='mb-2'>
                      <span>
                        Keywords To Track
                      </span>
                      <span className='ms-3'>
                        <CustomPopover content={<>
                          <p>The keywords will help you track if you have written enough of them within your description. </p>
                          <p>Keywords are important for SEO purposes, kindly make sure that you have  the keywords you are tracking for this particular video.
                          </p>
                          <p>Our software will help you know how many times you have used your keyword.
                          </p>
                          <Alert severity='info'>
                            <AlertTitle>
                              <strong>
                                Note
                              </strong>
                            </AlertTitle>
                            <p className='p-0 m-0'>
                              We will not add the keywords to your final description
                            </p>
                            <p className='p-0 m-0 mt-2'>
                              <strong>HINT: </strong>
                              Use our tips button to get to know more about keywords and other tactics.
                            </p>
                          </Alert>
                        </>} />
                      </span>
                    </label>
                    <textarea className="form-control shadow-none outline-none" id="video-keywords" rows="4" placeholder="Enter keywords separated by commas" value={keywords} onChange={e => handleKeywordsChange(e)} />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="video-description" className='mb-2'>Video Description</label>
                    {/* <textarea className="form-control shadow-none outline-none" id="video-description" rows="10" placeholder="Enter video description" value={description} onChange={e => handleDescriptionChange(e)}></textarea> */}
                    <TextareaAutosize
                      aria-label="Video description textarea input"
                      minRows={6}
                      placeholder="Enter your description here"
                      className='form-control shadow-none outline-none'
                      value={description}
                      onChange={e => handleDescriptionChange(e)}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="video-tags" className='mb-2'>Video Tags</label>
                    {/* Use textarea */}
                    <textarea className="form-control shadow-none outline-none" id="video-tags" rows="3" placeholder="Enter video tags like #angularjs, #nextjs" value={tags} onChange={e => setTags(e.target.value)}></textarea>
                  </div>
                  {/* Select group of video chapters from chapters video title */}
                  <div className="form-group mb-3">
                    <label htmlFor="video-chapters" className='mb-2'>Video Chapters</label>
                    <select className="form-select shadow-none outline-none" id="video-chapters" value={chapters} onChange={e => setChapters(e.target.value)}>
                      <option value="">Select Video Chapters</option>
                      {
                        chapterGroups.map(group => {
                          return (
                            <option key={group.id} value={group.id}>{group.name}</option>
                          )
                        })
                      }
                    </select>

                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="video-chapters" className='mb-2'>Social Links Group</label>
                    <select className="form-select shadow-none outline-none" id="video-social-links" value={socialLinks} onChange={e => setSocialLinks(e.target.value)}>
                      <option value="">Select Video Links</option>
                      {
                        groups.map(group => {
                          return (
                            <option key={group.id} value={group.id}>{group.name}</option>
                          )
                        })
                      }
                    </select>
                  </div>
                  <Button type="submit" className="btn custom-btn shadow-none outline-none" onClick={makeFinalDescription}>Create</Button>
                </form>
              </div>
            </div>
            <div className="col-md-4">
              <div className="sticky-top custom-sticky-top">
                <div className="custom-card p-2 py-md- mb-2">
                  <div className="keywords">
                    <h3>Title words overview</h3>
                    {
                      titleKeywords.map((keyword, index) => {
                        return (
                          <div key={index} className={`keyword-container d-flex text-${getCountClass(keyword.count)}`} onClick={e => openHightlightModal(keyword)}>
                            <span>{keyword.keyword}</span>
                            <span className="ms-auto keyword-count">{keyword.count}</span>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
                <div className="custom-card p-2 py-md- mb-2">
                  <div className="keywords">
                    <h3>Keywords overview</h3>
                    {
                      splitKeywords.map((keyword, index) => {
                        return (
                          <div key={index} className={`keyword-container d-flex text-${getCountClass(keyword.count)}`} onClick={e => openHightlightModal(keyword)}>
                            <span>{keyword.keyword}</span>
                            <span className="ms-auto keyword-count">{keyword.count}</span>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {
          finalDescription && (
            <>
              <p className="text-center">{finalDescription?.length}/5000 </p>
              <FinalOutput title={"Video Description"} valuetocopy={finalDescription} successcopymsg="Video description copied successfully" />
            </>
          )
        }
      </PageBody >
      <CustomSnackbar alert={alert} />
    </Page >
  )
}

export default Videodescription