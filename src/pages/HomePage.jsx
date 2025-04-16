import LeftPart from "../components/layout/LeftPart.jsx";
import MiddlePart from "../components/layout/MiddlePart.jsx";
import RightPart from "../components/layout/RightPart.jsx";

import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [isLoading, user, navigate]);

  return (
    <div className="flex">
      <div className="w-3/12 h-screen">
        <LeftPart></LeftPart>
      </div>
      <div className="w-6/12 h-screen">
        <MiddlePart></MiddlePart>
      </div>
      <div className="w-3/12 h-screen">
        <RightPart></RightPart>
      </div>
    </div>
  );
}

export default HomePage;
