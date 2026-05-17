export default function About(){
  return (
    <div>
      <h1>About</h1>
      <section className="about-section">
        <div className="about-image">
          <img src="/post.jpeg" alt="Math tutor" />
        </div>
        <div className="about-text">
          <h3>A personal approach to learning</h3>
          <p>This is a small personal classroom built for Grades 9–11 students in Sri Lanka. The aim is to keep resources calm, focused and easy to use.</p>
          <p>Instead of overwhelming textbooks and complex explanations, we provide clear tutorials and essential past papers to help you master the concepts at your own pace.</p>
          <p>Whether you're preparing for exams or just want to strengthen your fundamentals, we're here to make math simpler and less intimidating.</p>
          <h3 style={{marginTop: 24}}>About the Tutor</h3>
          <p>I'm passionate about making math accessible and enjoyable. With years of experience teaching, I understand the challenges students face and have designed this space to be a supportive, distraction-free learning environment.</p>
        </div>
      </section>
    </div>
  )
}
