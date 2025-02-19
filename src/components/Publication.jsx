function Publication() {
  return (
    <div className="flex items-center justify-center mb-10">
      <div className="w-9/10 h-[600px] shadow-lg  rounded-lg my-5">
        <div className="m-5 mb-10 flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/711/711769.png"
            alt="Foto da pessoa"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex flex-col">
            <h1 className="text-2xl font-poppins font-medium">
              Nome da Pessoa
            </h1>
            <h2 className="text-sm text-gray-600 font-poppins">
              Tempo em que essa postagem foi postada
            </h2>
          </div>
        </div>
        <div className="m-5 ">
          <h1 className="text-2xl mb-3">Título da publicação</h1>
          <h2 className="text-base text-gray-800 mb-5">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptate,
            deserunt delectus repellat sint ut magnam eius quia molestiae veniam
            iusto sed aspernatur id tempore harum non quam esse cum. Dolorem.
          </h2>
          <div className="flex justify-start">
            <img
              className="max-w-8/10 rounded-2xl"
              src="https://plus.unsplash.com/premium_photo-1668024966086-bd66ba04262f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGxhbm8lMjBkZSUyMGZ1bmRvJTIwYm9uaXRvfGVufDB8fDB8fHww"
              alt="Foto da publicação(caso tenha)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Publication;
