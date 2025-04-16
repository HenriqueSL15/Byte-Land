import { motion } from "framer-motion";

function Profile({ img, name, onClick }) {
  return (
    <div className="flex items-center cursor-pointer">
      <motion.img
        // Efeitos de animação ao interagir com a imagem
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        // Verifica se deve usar a imagem do usuário ou a imagem padrão
        src={
          img != "https://cdn-icons-png.flaticon.com/512/711/711769.png"
            ? `http://localhost:3000/${img}`
            : "https://cdn-icons-png.flaticon.com/512/711/711769.png"
        }
        alt="Foto"
        className="sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-11 lg:h-11 xl:w-12 xl:h-12 rounded-full"
      />
      <div className="flex flex-col p-2">
        <h1 className="lg:text-xl xl:text-2xl font-poppins">{name}</h1>
      </div>
    </div>
  );
}

export default Profile;
