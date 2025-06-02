import Form from "./Form/Form"

function CreateBook() {
  const isBaseCreateRoute = location.pathname === "/admin/books/create" || location.pathname === "/admin/books/create/";
  return (<>
    {
      isBaseCreateRoute && (<>
        <div>
          <Form />
        </div>
      </>)
    }
  </>)
}

export default CreateBook