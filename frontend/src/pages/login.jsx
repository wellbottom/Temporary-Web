import Form from "../components/Login-Register_Form"
function Login() {
    return <Form route={"/api/token/"} method={"login"} />
}

export default Login