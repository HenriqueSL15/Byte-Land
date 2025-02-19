import Publication from "./Publication.jsx";

function MiddlePart() {
  return (
    <div className="w-full border-2 h-screen overflow-y-scroll scrollbar-hide relative border-gray-200">
      <Publication />
      <Publication />
      <Publication />
      <Publication />
      <Publication />
    </div>
  );
}

export default MiddlePart;
