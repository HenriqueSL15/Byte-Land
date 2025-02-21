import Publication from "./Publication.jsx";
import NewPulicationBox from "./NewPublicationBox.jsx";

function MiddlePart() {
  return (
    <div className="w-full border-2 h-screen overflow-y-scroll scrollbar-hide relative border-gray-200">
      <NewPulicationBox />
      <Publication />
      <Publication />
      <Publication />
      <Publication />
      <Publication />
    </div>
  );
}

export default MiddlePart;
