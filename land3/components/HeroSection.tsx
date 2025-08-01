
'use client';

export default function HeroSection() {
  return (
    <section 
      id="inicio" 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://readdy.ai/api/search-image?query=Modern%20dental%20clinic%20interior%20with%20warm%20beige%20and%20brown%20tones%2C%20clean%20minimalist%20design%2C%20natural%20lighting%2C%20comfortable%20dental%20chair%2C%20elegant%20reception%20area%2C%20professional%20healthcare%20environment%20with%20soft%20neutral%20colors%20and%20contemporary%20furniture&width=1920&height=1080&seq=hero-dental-1&orientation=landscape')`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 to-stone-900/40"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-screen flex items-center">
        <div className="w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Seu sorriso é nossa
              <span className="text-amber-400 block">prioridade</span>
            </h1>
            
            <p className="text-xl text-stone-200 mb-8 leading-relaxed">
              Na Clínica Odonto Andrade, oferecemos cuidados odontológicos de excelência com tecnologia avançada e atendimento humanizado.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-amber-800 text-white px-8 py-4 rounded-full hover:bg-amber-900 transition-colors cursor-pointer text-lg font-semibold whitespace-nowrap">
                Agendar Consulta
              </button>
              
              <button className="border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-stone-900 transition-all cursor-pointer text-lg font-semibold whitespace-nowrap">
                Nossos Serviços
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <i className="ri-arrow-down-line text-2xl w-6 h-6 flex items-center justify-center"></i>
      </div>
    </section>
  );
}
