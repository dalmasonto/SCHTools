import Head from "next/head"

const PageHeader = ({ children }) => {
  return (
    <div>
      <Head>
        {children}
      </Head>
    </div>
  )
}

export default PageHeader