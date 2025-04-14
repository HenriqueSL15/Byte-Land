import Profile from "./Profile.jsx";
import { motion, AnimatePresence } from "framer-motion";

function RightPart() {
  const example = [
    {
      img: "https://cdn-icons-png.flaticon.com/512/711/711769.png",
      name: "Cleiton",
      job: "Fotógrafo",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/711/711769.png",
      name: "João",
      job: "Blogger de Viagens",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/711/711769.png",
      name: "Carla",
      job: "Grupo de Interesse",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className={`flex flex-col p-10 `}
    >
      <h1 className="text-3xl text-center font-funnel-sans font-semibold mb-10">
        Perfis Sugeridos
      </h1>
      <div className="flex flex-col ml-7">
        {example.map((element, index) => {
          return (
            <Profile
              key={index}
              img={element.img}
              name={element.name}
              job={element.job}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

export default RightPart;
