import AboutView from "@/components/views/AboutView"

const About = () => {
  return (
    <AboutView sections={[{
      title: 'Informações',
      subtitle: '...',
    },{
      title: 'Como Ajudar',
      subtitle: '...',
    }]} />
  )
}
export default About
