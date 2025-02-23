import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

const AccordionSolutions = () => {
  const [open, setOpen] = useState(solutions[0].id);
  const imgSrc = solutions.find((s) => s.id === open)?.imgSrc;
  return (
    <section className="px-8 py-12 bg-black bg-opacity-50 backdrop-blur-lg">
      <div className="w-full max-w-5xl mx-auto grid gap-8 grid-cols-1 lg:grid-cols-[1fr_350px]">
        <div>
          <h3 className="text-4xl font-bold mb-8 text-white">HODLer Questions</h3>
          <div className="flex flex-col gap-4">
            {solutions.map((q) => {
              return (
                <Solution {...q} key={q.id} open={open} setOpen={setOpen} index={q.id} />
              );
            })}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={imgSrc}
            className="bg-slate-300 rounded-2xl aspect-[4/3] lg:aspect-auto"
            style={{
              backgroundImage: `url(${imgSrc})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
        </AnimatePresence>
      </div>
    </section>
  );
};

const Solution = ({ title, description, index, open, setOpen }) => {
  const isOpen = index === open;

  return (
    <div
      onClick={() => setOpen(index)}
      className="p-0.5 rounded-lg relative overflow-hidden cursor-pointer"
    >
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "240px" : "72px",
        }}
        className="p-6 rounded-[7px] bg-white flex flex-col justify-between relative z-20"
      >
        <div>
          <motion.p
            initial={false}
            animate={{
              color: isOpen ? "rgba(0, 0, 0, 0)" : "rgba(0, 0, 0, 1)",
            }}
            className="text-xl font-medium w-fit bg-gradient-to-r from-green-600 to-indigo-600 bg-clip-text"
          >
            {title}
          </motion.p>
          <motion.p
            initial={false}
            animate={{
              opacity: isOpen ? 1 : 0,
            }}
            className="mt-4 bg-gradient-to-r from-green-600 to-indigo-600 bg-clip-text text-transparent"
          >
            {description}
          </motion.p>
        </div>
        <motion.button
          initial={false}
          animate={{
            opacity: isOpen ? 1 : 0,
          }}
          className="-ml-6 -mr-6 -mb-6 mt-4 py-2 rounded-b-md flex items-center justify-center gap-1 group transition-[gap] bg-gradient-to-r from-green-600 to-indigo-600 text-white"
        >
          {/* <span>Learn more</span>
          <FiArrowRight className="group-hover:translate-x-1 transition-transform" /> */}
        </motion.button>
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          opacity: isOpen ? 1 : 0,
        }}
        className="absolute inset-0 z-10 bg-gradient-to-r from-green-600 to-indigo-600"
      />
      <div className="absolute inset-0 z-0 bg-slate-200" />
    </div>
  );
};

export default AccordionSolutions;

const solutions = [
  {
    id: 1,
    title: "How can I track my cryptocurrency portfolio with HODLSync?",
    description:
      "HODLSync allows you to add and monitor your cryptocurrency holdings by syncing with real-time market data. Simply log in, input the coins you are holding, and the app will show you live price updates, market changes, and a detailed portfolio performance report, helping you stay on top of your investments.",
    imgSrc:
      "https://media2.giphy.com/media/SsTcO55LJDBsI/giphy.gif?cid=ecf05e47hfid50hu34mzkabzoy46hrftyl6g6656uygzmnpy&ep=v1_gifs_search&rid=giphy.gif&ct=g",
  },
  {
    id: 2,
    title: "Does HODLSync provide historical data for my crypto assets?",
    description:
      "Yes, HODLSync offers historical data for supported cryptocurrencies, allowing you to track price movements and trends over time. You can analyze the performance of your portfolio and make informed decisions based on past data, with charts and insights to guide your crypto investment strategy.",
    imgSrc:
      "https://media.tenor.com/JBE4pIpmhBgAAAAM/ponke-ponkesol.gif",
  },
  {
    id: 3,
    title: "Is my personal information and crypto data secure on HODLSync?",
    description:
      "Yes, HODLSync prioritizes user privacy and security. Your account information and crypto data are securely stored and encrypted. We employ industry-standard security measures to protect your sensitive information, ensuring a safe and reliable platform for tracking and managing your crypto portfolio.",
    imgSrc:
      "https://media1.tenor.com/m/zV3Oi999cVAAAAAC/dancing-cheems.gif",
  },
];
