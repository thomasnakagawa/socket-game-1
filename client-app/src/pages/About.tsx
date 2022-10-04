import { useNavigate } from "react-router-dom";

export function About() {
  const navigate = useNavigate();
  return (
    <>
      <h2>About</h2>
      <p>some stuff here</p>
      <button onClick={() => {
        navigate("/");
      }}>back</button>
    </>
  );
}
