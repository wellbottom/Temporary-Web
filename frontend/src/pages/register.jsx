import Form from "../components/Login-Register_Form"
function Register() {
    return <Form route={"/api/user/register/"} method={"register"} />
}

export default Register