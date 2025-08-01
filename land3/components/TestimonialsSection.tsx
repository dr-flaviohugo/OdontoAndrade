
'use client';
import { useState } from 'react';

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Paciente há 3 anos',
      image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20happy%20middle-aged%20Brazilian%20woman%20with%20a%20beautiful%20smile%2C%20warm%20natural%20lighting%2C%20neutral%20beige%20background%2C%20confident%20and%20friendly%20expression%2C%20healthcare%20patient%20testimonial%20style&width=400&height=400&seq=testimonial-maria-1&orientation=squarish',
      text: 'Excelente atendimento! A Dra. Andrade é muito cuidadosa e sempre me deixa tranquila durante os procedimentos. Recomendo de olhos fechados!'
    },
    {
      name: 'João Santos',
      role: 'Paciente há 5 anos',
      image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20smiling%20Brazilian%20man%20in%20his%2040s%20showing%20healthy%20teeth%2C%20warm%20natural%20lighting%2C%20neutral%20brown%20background%2C%20confident%20expression%2C%20dental%20patient%20testimonial&width=400&height=400&seq=testimonial-joao-1&orientation=squarish',
      text: 'Fiz meu implante aqui e o resultado superou todas as expectativas. Equipe profissional e clínica com estrutura moderna. Muito satisfeito!'
    },
    {
      name: 'Ana Costa',
      role: 'Paciente há 2 anos',
      image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20young%20Brazilian%20woman%20with%20a%20radiant%20smile%2C%20soft%20natural%20lighting%2C%20beige%20neutral%20background%2C%20happy%20and%20satisfied%20expression%2C%20dental%20care%20testimonial%20style&width=400&height=400&seq=testimonial-ana-1&orientation=squarish',
      text: 'Meu tratamento ortodôntico foi um sucesso! Adorei o resultado e todo o processo foi muito tranquilo. Equipe maravilhosa!'
    },
    {
      name: 'Carlos Oliveira',
      role: 'Paciente há 4 anos',
      image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20middle-aged%20Brazilian%20man%20with%20a%20confident%20smile%2C%20natural%20warm%20lighting%2C%20neutral%20background%2C%20satisfied%20dental%20patient%2C%20healthcare%20testimonial%20photography&width=400&height=400&seq=testimonial-carlos-1&orientation=squarish',
      text: 'Clareamento dental ficou perfeito! Ambiente muito acolhedor e profissionais extremamente competentes. Indico para todos!'
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="depoimentos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-6">
            O que nossos pacientes dizem
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
            Histórias reais de pessoas que transformaram seus sorrisos conosco.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-stone-50 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <img 
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-32 h-32 rounded-full object-cover object-top shadow-lg"
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="mb-4">
                  <i className="ri-double-quotes-l text-4xl text-amber-800 w-10 h-10 flex items-center justify-center mx-auto md:mx-0"></i>
                </div>
                
                <p className="text-lg md:text-xl text-stone-700 leading-relaxed mb-6 italic">
                  {testimonials[currentTestimonial].text}
                </p>
                
                <div>
                  <h4 className="text-xl font-bold text-stone-800 mb-1">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-stone-600">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center mt-8 gap-4">
            <button 
              onClick={prevTestimonial}
              className="bg-amber-800 text-white p-3 rounded-full hover:bg-amber-900 transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line w-5 h-5 flex items-center justify-center"></i>
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                    index === currentTestimonial ? 'bg-amber-800' : 'bg-stone-300'
                  }`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextTestimonial}
              className="bg-amber-800 text-white p-3 rounded-full hover:bg-amber-900 transition-colors cursor-pointer"
            >
              <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
