const { useNavigate } = require("react-router-dom");
const {useSelector}=require("react-redux");
const { useEffect } = require("react");

const ProtectedRoute =({children})=>{
    const {user}=useSelector(store=>store.auth);

    const navigate=useNavigate();

    useEffect(()=>{
   if(user===null || user.role!='recruiter'){
    navigate("/");
   }
    },[]);
    return (
        <>
        {children}
        </>
    )
}
export default ProtectedRoute;