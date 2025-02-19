function Profile({ img, name, job }) {
  return (
    <div className="flex items-center cursor-pointer">
      <img
        src={img != "None" ? img : ""}
        alt="Foto"
        className="w-12 h-12 rounded-full"
      />
      <div className="flex flex-col p-2">
        <h1 className="text-2xl font-poppins">{name}</h1>
        <h2 className="text-md text-gray-600 font-poppins">{job}</h2>
      </div>
    </div>
  );
}

export default Profile;
