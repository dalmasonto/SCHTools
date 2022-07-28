
const Sitemap = () => {

  const generateSitemap = (e) => {
    e.preventDefault()

  }

  return (
    <div className='container'>
      <h1 className='text-center my-4'>Sitemap Generator tool</h1>
      <div className='row'>
        <div className='col-md-12'>
          <form className='text-center'>

            <div className="row">
              <div className="col-md-8 offset-md-2">
                <div className="row">
                  <div className="col-md-2 mb-3">
                    <label htmlFor='url'>Enter Website URL</label>
                  </div>
                  <div className="col-md-10 mb-3">
                    <input type='text' className='form-control' id='url' value="npm i get-site-urls" />
                  </div>
                </div>
              </div>
            </div>

            <div className='form-group'>
              <button className='btn btn-primary' onClick={generateSitemap}>Generate Sitemap</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Sitemap