function Publication({ owner, date, title, description, image }) {
  if (typeof image == "string") image.replaceAll("\\", "/");
  return (
    <div className="flex items-center justify-center mb-10">
      <div className="w-9/10 min-h-[600px] shadow-lg  rounded-lg my-5">
        <div className="m-5 mb-10 flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/711/711769.png"
            alt="Foto da pessoa"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex flex-col">
            <h1 className="text-2xl font-poppins font-medium">{owner}</h1>
            <h2 className="text-sm text-gray-600 font-poppins">{date}</h2>
          </div>
        </div>
        <div className="m-5 overflow-y-auto scrollbar-hide">
          <h1 className="text-2xl mb-3 font-funnel-sans">{title}</h1>
          <h2 className="text-base text-gray-800 mb-5 font-funnel-sans">
            {description}.
          </h2>
          <div className="flex justify-start">
            <img
              className="max-h-2/4 mb-5 rounded-lg"
              src={
                typeof image == "string"
                  ? "http://localhost:3000/" + image
                  : "No Image"
              }
              alt="Foto da publicação"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Publication;
