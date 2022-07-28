import { useEffect, useState, useRef } from 'react'
import Banner from '../../../components/Banner'
import Page from '../../../components/common/Page'
import PageHeader from '../../../components/common/PageHeader'
import { APP_NAME } from '../../../app/appConfig'
import PageBody from '../../../components/common/PageBody'

import { IoIosArrowForward, IoIosClose, IoIosPause, IoIosPlay, IoIosRefresh } from 'react-icons/io'
import { FaChevronDown, FaChevronUp, FaPlus, FaTrash } from 'react-icons/fa'

import ReactPlayer from 'react-player/youtube'
import { Alert, AlertTitle, Button, Fab, IconButton } from '@mui/material'
import validateUrl from '../../../app/appFunctions'
import FinalOutput from '../../../components/FinalOutput'
import { addchaptergroup, removechaptergroup, selectApp } from '../../../reducers/appreducer'
import { useDispatch, useSelector } from 'react-redux'

import { nanoid } from 'nanoid'
import CustomSnackbar from '../../../components/CustomSnackbar'

function convertHMS(value) {
  const sec = parseInt(value, 10); // convert value to number if it's string
  let hours = Math.floor(sec / 3600); // get hours
  let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
  let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  return hours + ':' + minutes + ':' + seconds; // Return is HH : MM : SS
}

const Videochapters = () => {
  const [videoUrl, setVideoUrl] = useState(null)
  const [videoUrl1, setVideoUrl1] = useState(null)
  const [playing, setPlaying] = useState(false)

  const [played, setPlayed] = useState(0)
  const playerRef = useRef(null)

  const [videoTitle, setVideoTitle] = useState('')

  const playerContainerRef = useRef(null)
  const topRef = useRef(null)
  const bottomRef = useRef(null)

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const [playbackRate, setPlaybackRate] = useState(1.0)

  const [chapters, setChapters] = useState([])
  const [chaptersStr, setChaptersStr] = useState(null)

  const [groups, setGroups] = useState([])

  const dispatch = useDispatch()
  const { chaptergroups } = useSelector(selectApp)

  const scrollTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    else {
      console.log('topRef is not defined')
    }
  }

  const scrollBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const onStart = () => {
    addChapter(0)
  }

  const onEnd = () => {
    addChapter(playerContainerRef.current.getCurrentTime())
  }

  const addChapter = (start) => {
    const sortedChapters = [...chapters, {
      start: convertHMS(start),
      title: '',
      seconds: start
    }].sort((a, b) => a.seconds - b.seconds)
    setChapters(sortedChapters)
  }

  const editChapter = (index, field, value) => {
    const newChapters = [...chapters]
    newChapters[index][field] = value
    setChapters(newChapters)
  }

  const removeChapter = (index) => {
    const newChapters = [...chapters]
    newChapters.splice(index, 1)
    setChapters(newChapters)
  }

  const play = () => {
    setPlaying(true)
  }

  const pause = () => {
    setPlaying(false)
    addChapter(playerContainerRef.current.getCurrentTime())
  }

  const pauseOrPlay = () => {
    if (playing) {
      setPlaying(false)
      // addChapter(playerContainerRef.current.getCurrentTime())
    } else {
      setPlaying(true)
    }
  }

  const handleSeekChange = e => {
    setPlayed(parseFloat(e.target.value))
  }
  const handleSeekMouseUp = e => {
    // setState({ seeking: false })
    playerContainerRef.current.seekTo(parseFloat(e.target.value))
  }

  const handleSeekMouseDown = e => {
    // this.setState({ seeking: true })
  }

  const loadVideo = () => {
    if (videoTitle === '' || videoTitle === null) {
      openAlert('Please enter a title for the video', 'error')
      return
    }
    if (videoUrl1 === null || videoUrl1 === "") {
      openAlert('Please enter a YouTube URL', 'error')
      return
    }
    if (!validateUrl(videoUrl1)) {
      openAlert('Invalid URL', 'error')
      return;
    }
    else {
      setVideoUrl(videoUrl1)
    }
  }

  const openAlert = (msg, severity) => {
    setAlert({
      open: true,
      message: msg,
      severity: severity
    })
  };

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


  const compileChapters = () => {
    const chaptersStr_ = ``
    chapters.forEach((chapter) => {
      chaptersStr_ += `${chapter.start} ${chapter.title}\n`
    })
    setChaptersStr(chaptersStr_)

  }

  const loadNewvideo = () => {
    setVideoUrl(null)
    setVideoUrl1(null)
    setPlaying(false)
    setChapters([])
    setChaptersStr(null)
    setVideoTitle('')
  }

  const saveGroup = (event) => {
    event.preventDefault()

    const group_id = nanoid()

    const newgroup = {
      id: group_id,
      name: videoTitle,
      chapters: [...chapters]
    }

    dispatch(addchaptergroup(newgroup))
    openAlert('Video chapters saved', 'success')
  }

  const deleteGroup = (id) => {
    dispatch(removechaptergroup(id))
    openAlert(`Chapter Group Deleted`, "success")
  }

  useEffect(() => {
    setGroups(chaptergroups)
  }, [chaptergroups])

  return (
    <Page>
      <PageHeader>
        <title>{APP_NAME}YouTube Video Chapter Generation</title>
      </PageHeader>
      <Banner title={"YouTube Video Chapter Generation"} tagline="Generate YouTube video chapters" />
      <PageBody>
        <Fab size="small" className="custom-fab-top" aria-label="scroll down" onClick={scrollBottom}>
          <FaChevronDown size={22} />
        </Fab>
        <Fab size="small" className="custom-fab-bottom" aria-label="scroll down" onClick={scrollTop}>
          <FaChevronUp size={22} />
        </Fab>

        <div className="container mt-5">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              {
                groups.map((group, index) => {
                  return (
                    <div key={`chapter_group__${index}`} className="custom-card p-2 mb-3">
                      <div className="d-flex align-items-center">
                        <h4 className='m-0 p-0 ms-md-3'>{group.name}</h4>
                        <div className='ms-auto h-100 d-flex align-items-center'>
                          <span className='me-2'>{group.chapters?.length}</span>
                          <IconButton>
                            <IoIosArrowForward />
                          </IconButton>
                          <IconButton className="ms-2 text-danger" onClick={e => deleteGroup(group.id)}>
                            <FaTrash size={16} />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  )
                })
              }

            </div>
          </div>
        </div>


        {
          !videoUrl && (
            <div className="container mt-2 mb-3">
              <div className="row">
                <div className="col-md-8 offset-md-2">
                  <div className="custom-card p-2 mb-3">
                    <div className="form-group">
                      <label htmlFor="videoTitle" className='mb-2'>YouTube Video Title</label>
                      <input type="text" className="form-control shadow-none w-100" value={videoTitle || ''} id="videoTitle" onChange={e => setVideoTitle(e.target.value)} placeholder="YouTube Video Title" />
                    </div>
                  </div>
                  <div className="custom-card p-2 d-flex align-items-center">
                    <div className="w-75">
                      <input type="text" className="form-control shadow-none w-100" value={videoUrl1 || ''} onChange={e => setVideoUrl1(e.target.value)} placeholder="Enter YouTube video URL" />
                    </div>
                    <div className="w-25 d-flex justify-content-center">
                      <Button className="btn custom-btn shadow-none outline-none" onClick={loadVideo}>
                        Load Video
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        {
          videoUrl && (
            <div className="container py-5">
              <div className="row">
                <div className="col-md-8 offset-md-2">
                  <div ref={topRef} className="custom-card">
                    {
                      videoUrl && (
                        <>
                          <ReactPlayer ref={playerContainerRef} url={videoUrl} width={"100%"} playing={playing} onPause={pause} onPlay={play} onStart={onStart} onEnded={onEnd} controls={false} playbackRate={playbackRate} played={played} />

                          <div className="mt-2 p-2">
                            <label htmlFor="range">Seek</label>
                            <input
                              type='range' id='range' min={0} max={0.999999} step='any'
                              value={played}
                              // onMouseDown={handleSeekMouseDown}
                              onChange={handleSeekChange}
                              onMouseUp={handleSeekMouseUp}
                              className="form-range"
                            />
                          </div>
                          <div className="p-2">
                            <Alert severity='info'>
                              <small>1. Always use the pause/play button to pause and play in order to capture the time.</small>
                              <br />
                              <small>2. Use the seek above to do fast forwading.</small>
                            </Alert>
                          </div>
                          <div className='p-2 mt-2 custom-sticky-top d-flex align-items-center'>
                            <IconButton onClick={() => pauseOrPlay()} className="me-2 custom-btn">
                              {playing ? <IoIosPause size={22} /> : <IoIosPlay size={22} />}
                            </IconButton>
                            <Button className={`btn custom-outline-btn ${playbackRate === 1.0 && 'c-o-b-active'} outline-none shadow-none`} onClick={e => setPlaybackRate(1.0)}>
                              1x
                            </Button>
                            <Button className={`btn custom-outline-btn ${playbackRate === 1.5 && 'c-o-b-active'} outline-none shadow-none`} onClick={e => setPlaybackRate(1.5)}>
                              1.5x
                            </Button>
                            <Button className={`btn custom-outline-btn ${playbackRate === 2.0 && 'c-o-b-active'} outline-none shadow-none`} onClick={e => setPlaybackRate(2.0)}>
                              2x
                            </Button>

                            <Button className="ms-auto btn custom-btn outline-none shadow-none" onClick={loadNewvideo}>
                              <IoIosRefresh size={26} />
                              <span className='ms-2'>
                                New Video
                              </span>
                            </Button>
                          </div>
                        </>
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
          )
        }

        {
          videoUrl && (
            <div className="container mb-5">
              <div className="row">
                <div className="col-md-8 offset-md-2">
                  <div className="custom-card mb-2 py-3">
                    <h3 className="text-center m-0 p-0">{chapters.length} - Video Chapters</h3>
                  </div>

                  <div>

                    {
                      chapters.length === 0 && (
                        <Alert severity='info'>
                          <AlertTitle>No Chapters</AlertTitle>
                          <p>No chapters have been added yet. Click on the play button to start adding chapters.</p>
                        </Alert>
                      )
                    }

                    {
                      [...chapters].sort((a, b) => {
                        return parseFloat(a.seconds) - parseFloat(b.seconds)
                      }).map((chapter, index) => (
                        <div key={`chapter__ ${index}`} className="mb-1">
                          <div className="row">
                            <div className="col-3 p-1 p-md-2">
                              <div className='custom-card p-2'>
                                <input type="text" className="form-control shadow-none w-100" value={chapter.start} onChange={e => editChapter(index, 'start', e.target.value)} />
                              </div>
                            </div>
                            <div className="col-7 p-1 p-md-2">
                              <div className='custom-card p-2'>
                                <input type="text" className="form-control shadow-none w-100" value={chapter.title} onChange={e => editChapter(index, 'title', e.target.value)} />
                              </div>
                            </div>
                            <div className="col-2 p-1 p-md-2">
                              <div className='h-100 d-flex align-items-center justify-content-center'>
                                <IconButton onClick={e => removeChapter(index)}>
                                  <IoIosClose size={26} className="text-danger" />
                                </IconButton>
                              </div>
                            </div>

                          </div>
                        </div>
                      ))
                    }
                    {
                      chapters.length > 0 && (
                        <div className="mt-3">
                          <hr />
                          <Button className="custom-btn me-3" onClick={e => addChapter(0)}>
                            <FaPlus />
                            <span className='ms-3'>
                              Add Chapter
                            </span>
                          </Button>
                          <Button className="custom-btn me-3" onClick={saveGroup}>
                            Save Group
                          </Button>
                          <Button className="custom-btn" onClick={compileChapters}>
                            Compile Chapters
                          </Button>
                        </div>
                      )
                    }

                    <div ref={bottomRef}></div>

                  </div>

                </div>
              </div>
            </div>
          )
        }

        {
          chapters.length > 0 && chaptersStr && (
            <>
              <FinalOutput title={"Video Chapters"} valuetocopy={`${chaptersStr}\nChapters compiled by: Super Code Hive Tools, https://schtools.supercodehive.com`} successcopymsg="Video chapters copied successfully" />
            </>
          )
        }

      </PageBody>

      <CustomSnackbar alert={alert} />
    </Page>
  )
}

export default Videochapters