import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Highlighter from "react-highlight-words";
import CustomPopover from '../popover/CustomPopover';


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


const KeywordsSelector = ({ keywords, selectKeyword }) => {
  return (
    <>
      {
        keywords.map((keyword, index) => {
          return (
            <div key={index} className={`keyword-container d-flex text-${getCountClass(keyword.count)}`} onClick={e => selectKeyword(keyword)}>
              <span>{keyword.keyword}</span>
              <span className="ms-auto keyword-count">{keyword.count}</span>
            </div>
          )
        })
      }
    </>
  )
}

export default function TransitionsModal({ modalOpen, description, selectedKeyword, onclose, keywords, selectKeyword }) {
  const [open, setOpen] = React.useState(false);
  const [highlight, setHighlight] = React.useState(null);

  React.useEffect(() => {
    setOpen(modalOpen)
  }, [modalOpen])

  React.useEffect(() => {
    setHighlight(selectedKeyword)
    console.log(selectedKeyword)
  }, [selectedKeyword])

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={onclose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>

        <div className="custom-modal">
          <div className="custom-modal-header">
            <h2 className='p-0 m-0'>
              <span className='me-4'>
                {
                  highlight?.keyword
                }
              </span>
              <CustomPopover content={<>
                <KeywordsSelector keywords={keywords} selectKeyword={selectKeyword} />
              </>} />
            </h2>
            <p className='p-0 m-0'>Appearances: {highlight?.count}</p>
          </div>
          <div className="custom-modal-body">
            <Highlighter
              className='custom-highlighter'
              highlightClassName="YourHighlightClass"
              searchWords={[highlight?.keyword]}
              autoEscape={true}
              textToHighlight={description}
              activeClassName="highlighted-text"
              highlightStyle={{ borderBottom: "2px solid #16a131" }}
            />
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
