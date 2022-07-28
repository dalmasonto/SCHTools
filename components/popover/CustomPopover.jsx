import { useState } from "react";
import { Popover } from "@mui/material";
import { FaInfoCircle } from 'react-icons/fa';

const CustomPopover = ({ content }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        className='custom-popover'
      >
        <div className='p-2 custom-'>
          {content}
        </div>
      </Popover>
      <FaInfoCircle size={18} onClick={handleClick} className="cursor-pointer" />
    </>
  )
}

export default CustomPopover;