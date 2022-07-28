import { Button } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import styles from '../styles/Home.module.css'

const Tool = ({ tool }) => {
  return (
    <div className="col-md-4 mb-3 mb-md-5">
      <div className={styles.toolWrapper}>
        <div className={`${tool.ribbonclass}-ribbon ribbon ribbon-${tool.ribbonposition}`}><span>{tool.ribbonclass}</span></div>
        <div className={`${styles.tool} h-100`}>
          {
            tool.failed && !tool.isActive && (
              <div className={styles.toolFailed}>Tool Failed!</div>
            )
          }

          {
            !tool.isActive && !tool.failed && (
              <div className={styles.toolComingSoon}>Coming soon!</div>
            )
          }

          <div className={styles.toolImg}>
            <Image src={tool.image} alt="keyword research image" className="img-fluid"
              width={200} height={200}
            />
          </div>
          <div className={`${styles.toolInfo} h-100`}>
            <h3>{tool.name}</h3>
            <p className="m-0 p-0 mt-3">
              {tool.description}
            </p>
            <Link href={tool.url}>
              <Button className="btn custom-btn mt-3">
                Start Using
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tool