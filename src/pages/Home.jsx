import Hero from "../components/home/Hero"
import NewArrivals from "../components/home/NewArrivals"
import Earbuds from "../components/home/Earbuds"
import Headphones from "../components/home/Headphones"
import Bags from "../components/home/Bags"
import Microphones from "../components/home/Microphones"
import Accessories from "../components/home/Accessories"

const Home = () => {
  return (
    <main className="min-h-[50vh] py-8 space-y-6">
      <Hero />
      <NewArrivals />
      <Earbuds />
      <Headphones />
      <Bags />
      <Microphones />
      <Accessories />
    </main>
  )
}

export default Home
