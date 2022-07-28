import Link from 'next/link'
import React from 'react'
import { IoIosApps, IoMdApps } from 'react-icons/io'
import toolcategories from '../app/appConfig'
import '../styles/Navbar.module.css'

const makeStyles = (styles_array) => {
  let styles_string = ''
  styles_array.forEach(style => {
    styles_string += ` ${styles[style]}`
  })
  return styles_string;
}

const Navbar = () => {
  return (
    <nav className="navbar sticky-top navbar-expand-lg custom-nav">
      <div className="container-fluid">
        <a className="navbar-brand custom-nav-li-a" href="#">
          <h1>SCH Tools</h1>
        </a>
        <button className="navbar-toggler outline-none shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <IoMdApps size={32} />
        </button>
        <div className="collapse navbar-collapse bg-white" id="navbarSupportedContent">
          <ul className="navbar-nav mx-md-auto mb-2 mb-lg-0 custom-nav-ul">
            <li className="nav-item custom-nav-li">
              <Link className="nav-link custom-nav-li-a" aria-current="page" href="/">
                <a className="nav-link custom-nav-li-a">Home</a>
              </Link>
            </li>

            {
              toolcategories.map((category, index) => {
                if (category.tools.length > 0) {
                  return (
                    <li key={`category_${category.id}`} className="nav-item dropdown custom-nav-li">
                      <a className="nav-link dropdown-toggle custom-nav-li-a" href={category.url} id="navbarDropdown" role="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        {category.category}
                      </a>
                      <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                        {
                          category.tools.map((tool, index) => {
                            return (
                              <li key={`tool_${tool.id}`}>
                                <Link href={tool.isActive ? tool.url : '#'}>
                                  <a className={`dropdown-item ${tool.isActive ? '' : 'disabled'}`} disabled={tool.isActive ? true : true} aria-disabled={tool.isActive ? false : true} aria-current="page" tabIndex="0">
                                    {tool.name}
                                  </a>
                                </Link>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </li>
                  )
                }
                else {
                  return (
                    <li key={`category_${category.id}`} className="nav-item custom-nav-li">
                      <Link className="nav-link custom-nav-li-a" aria-current="page" href={category.url}>
                        <a className="nav-link custom-nav-li-a">{category.category}</a>
                      </Link>
                    </li>
                  )
                }
              })

            }
          </ul>
          {/* <form className="d-flex mb-sm-2">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form> */}
        </div>
      </div>
    </nav>
  )
}

export default Navbar