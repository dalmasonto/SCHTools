import toolcategories, { APP_NAME } from '../app/appConfig'
import Page from '../components/common/Page'
import PageBody from '../components/common/PageBody'
import PageHeader from '../components/common/PageHeader'
import ToolCategory from '../components/ToolCategory'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <Page>
      <PageHeader>
        <title>{APP_NAME}Best SEO &amp; Website Tools. </title>
        <meta name="description" content="SCH Tools are web tools for website SEO and Development. They help developers to quickly do local and onpage SEO." />
      </PageHeader>

      <PageBody>
        <main>
          <div className="container py-2 py-md-5">
            <div className="row">
              <div className="col-md-12">
                <div className="jumbotron">
                  <div className="row">
                    <div className="col-md-6">
                      <h1 className="display-4">Welcome to SCH Tools</h1>
                      <p className="lead">
                        Super Code Hive, SCH, is a software development compnany that provides a wide range of IT services to
                        its
                        clients.
                      </p>
                      <p className="lead">
                        In this case, SCH Tools are tools to help you develop your site in terms of SEO, Backlinks, Keywords,
                        blogs, etc.
                      </p>
                      <a className="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
                    </div>
                  </div>
                  <div className="col-md-6"></div>
                </div>
                <hr className="my-4" />

              </div>
            </div>
          </div>

          <div>
            {
              toolcategories.map((category) => {
                return (
                  <ToolCategory key={category.id} category={category} />
                )
              })
            }
          </div>


        </main>
      </PageBody>

    </Page>
  )
}
