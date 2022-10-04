import { useNavigate } from "react-router-dom";

export function FourOhFour() {
  const navigate = useNavigate();
  return (
    <>
      <h2>404</h2>
      <p>something wrong with this page</p>
      <button onClick={() => {
        navigate("/");
      }}>back</button>
    </>
  );
}
