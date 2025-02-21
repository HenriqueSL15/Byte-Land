import LeftPart from "./LeftPart.jsx";
import MiddlePart from "./MiddlePart.jsx";
import RightPart from "./RightPart.jsx";

function HomePage() {
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
