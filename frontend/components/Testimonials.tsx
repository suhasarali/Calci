import { TestimonialsColumn } from "@/components/ui/testimonialsColumn";
import { motion } from "motion/react";

const testimonials = [
 {
    text: "PaisaMastery helped me understand mutual funds better. The SIP calculator showed me how small investments can grow over time. Now I invest confidently!",
    image: "https://ui-avatars.com/api/?name=RK&background=eef2ff&color=4f46e5",
    name: "Rajesh Kumar",
    role: "Software Engineer, Mumbai",
  },
  {
    text: "The financial health checkup was eye-opening. I realized where I was overspending and how to save better. The quizzes made learning fun!",
    image: "https://ui-avatars.com/api/?name=PS&background=eef2ff&color=4f46e5",
    name: "Priya Sharma",
    role: "Teacher, Delhi",
  },
  {
    text: "As a business owner, the tax calculator and retirement planner are invaluable. I can plan my finances more effectively now.",
    image: "https://ui-avatars.com/api/?name=AP&background=eef2ff&color=4f46e5",
    name: "Amit Patel",
    role: "Business Owner, Ahmedabad",
  },
  {
    text: "The portfolio checkup feature helped me rebalance my investments. I love how everything is tailored for Indian investors!",
    image: "https://ui-avatars.com/api/?name=SR&background=eef2ff&color=4f46e5",
    name: "Sneha Reddy",
    role: "Marketing Manager, Bangalore",
  },
  {
    text: "Clear, simple, and extremely useful. The EMI calculator helped me make a smart decision on my home loan. Highly recommend!",
    image: "https://ui-avatars.com/api/?name=VS&background=eef2ff&color=4f46e5",
    name: "Vikram Singh",
    role: "Doctor, Pune",
  },
  {
    text: "The quizzes reinforced my CA studies and helped me learn practical applications. Great resource for anyone learning finance!",
    image: "https://ui-avatars.com/api/?name=AI&background=eef2ff&color=4f46e5",
    name: "Ananya Iyer",
    role: "CA Student, Chennai",
  },
  // Repeating the first 3 testimonials to fill the 3rd column for a better visual effect
  {
    text: "PaisaMastery helped me understand mutual funds better. The SIP calculator showed me how small investments can grow over time. Now I invest confidently!",
    image: "https://ui-avatars.com/api/?name=RK&background=eef2ff&color=4f46e5",
    name: "Rajesh Kumar",
    role: "Software Engineer, Mumbai",
  },
  {
    text: "The financial health checkup was eye-opening. I realized where I was overspending and how to save better. The quizzes made learning fun!",
    image: "https://ui-avatars.com/api/?name=PS&background=eef2ff&color=4f46e5",
    name: "Priya Sharma",
    role: "Teacher, Delhi",
  },
  {
    text: "As a business owner, the tax calculator and retirement planner are invaluable. I can plan my finances more effectively now.",
    image: "https://ui-avatars.com/api/?name=AP&background=eef2ff&color=4f46e5",
    name: "Amit Patel",
    role: "Business Owner, Ahmedabad",
  },
];


const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);


export const Testimonials = () => {
  return (
    <section id="testimonials" className="my-20 relative">

      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center p-0 m-0">
            <div className="border text py-1 px-3 rounded-lg">Testimonials</div>
          </div>

          <h2 className="text-3xl text-gray-800 sm:text-7xl font-bold text-nowrap mt-5">
            Trusted By  <span className="text-blue-800">Thousands</span>
          </h2>
          <p className="text-center mt-5 opacity-75">
            See what our customers have to say about us.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

