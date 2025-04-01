import { usePopUp } from "./PopUpContext";

function PopUp({ type }) {
  const {
    show,
    message,
    showPopUp,
    closePopUp,
    fn,
    setPopUpFn,
    setPopUpMessage,
  } = usePopUp();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-50"
      id="comments-popup"
    >
      <div className="absolute flex flex-col items-center justify-center gap-2 bg-white border-2 p-10 rounded-lg scale-130 ">
        <p className="text-red-500 text-center font-poppins text-sm font-semibold">
          {message}
        </p>
        {type == "ok" ? (
          <button
            type="button"
            className="border-b-2 font-poppins text-sm hover:bg-gray-200 px-5 pt-1 rounded-lg transition-all"
            onClick={() => {
              setPopUpMessage("");
              closePopUp();
            }}
          >
            Ok
          </button>
        ) : (
          type == "confirm/cancel" && (
            <div className="flex justify-center gap-2 scale-130 mt-10">
              <button
                type="button"
                className="border-b-2 font-poppins text-sm hover:bg-gray-200 px-5 pt-1 rounded-lg transition-all"
                onClick={() => {
                  setPopUpMessage("");
                  closePopUp();
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="border-b-2 font-poppins text-sm hover:bg-red-200 px-5 pt-1 rounded-lg transition-all"
                onClick={() => {
                  setPopUpMessage("");
                  closePopUp();

                  fn();
                }}
              >
                Confirmar
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default PopUp;
