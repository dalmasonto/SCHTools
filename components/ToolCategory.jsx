import Tool from "./Tool"

const ToolCategory = ({ category }) => {
  return (
    <div className="container py-2 mb-3 mb-md-5">
      <h2 className="mb-4">{category.category}</h2>
      <div>
        <div className="row">
          {category.tools.map((tool) => {
            return (
              <Tool key={tool.id} tool={tool} />
            )
          })}
        </div>
        {
          category.tools.length === 0 && (
            <div className="no-tools">
              <h3 className="text-center">No tools available</h3>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default ToolCategory