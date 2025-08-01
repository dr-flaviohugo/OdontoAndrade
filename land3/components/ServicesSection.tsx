
'use client';

export default function ServicesSection() {
  const services = [
    {
      icon: 'ri-heart-pulse-line',
      title: 'Clínica Geral',
      description: 'Consultas preventivas, limpeza, tratamento de cáries e cuidados básicos para manter sua saúde bucal em dia.',
      image: 'https://readdy.ai/api/search-image?query=Professional%20dental%20checkup%20with%20dentist%20examining%20patient%20teeth%2C%20clean%20modern%20clinic%2C%20warm%20beige%20and%20brown%20color%20palette%2C%20minimalist%20medical%20environment%2C%20dental%20tools%20and%20equipment&width=400&height=300&seq=service-general-1&orientation=landscape'
    },
    {
      icon: 'ri-scissors-line',
      title: 'Cirurgia Oral',
      description: 'Extrações, implantes dentários e cirurgias especializadas realizadas com segurança e conforto.',
      image: 'https://readdy.ai/api/search-image?query=Dental%20surgery%20room%20with%20modern%20equipment%2C%20sterile%20environment%2C%20warm%20neutral%20colors%2C%20professional%20surgical%20instruments%2C%20clean%20minimalist%20design%2C%20healthcare%20setting&width=400&height=300&seq=service-surgery-1&orientation=landscape'
    },
    {
      icon: 'ri-star-smile-line',
      title: 'Estética Dental',
      description: 'Clareamento, facetas, laminados e tratamentos para deixar seu sorriso ainda mais bonito.',
      image: 'https://readdy.ai/api/search-image?query=Cosmetic%20dentistry%20treatment%20room%2C%20teeth%20whitening%20setup%2C%20elegant%20dental%20clinic%20interior%20with%20beige%20and%20brown%20tones%2C%20modern%20aesthetic%20dental%20equipment%2C%20luxurious%20healthcare%20environment&width=400&height=300&seq=service-aesthetic-1&orientation=landscape'
    },
    {
      icon: 'ri-tooth-line',
      title: 'Ortodontia',
      description: 'Aparelhos fixos e móveis, alinhadores invisíveis para correção de problemas ortodônticos.',
      image: 'https://readdy.ai/api/search-image?query=Orthodontic%20consultation%20room%20with%20dental%20models%2C%20braces%20samples%2C%20modern%20clinic%20design%2C%20warm%20neutral%20colors%2C%20professional%20orthodontic%20equipment%20and%20charts&width=400&height=300&seq=service-orthodontic-1&orientation=landscape'
    },
    {
      icon: 'ri-user-heart-line',
      title: 'Odontopediatria',
      description: 'Cuidados especializados para crianças em ambiente acolhedor e adaptado aos pequenos.',
      image: 'https://readdy.ai/api/search-image?query=Child-friendly%20dental%20office%20with%20colorful%20but%20elegant%20design%2C%20pediatric%20dental%20chair%2C%20warm%20beige%20colors%2C%20toys%20and%20child-oriented%20dental%20equipment%2C%20safe%20healthcare%20environment&width=400&height=300&seq=service-pediatric-1&orientation=landscape'
    },
    {
      icon: 'ri-medicine-bottle-line',
      title: 'Periodontia',
      description: 'Tratamento especializado das gengivas e estruturas de suporte dos dentes.',
      image: 'https://readdy.ai/api/search-image?query=Periodontal%20treatment%20room%20with%20specialized%20gum%20care%20equipment%2C%20modern%20dental%20clinic%2C%20neutral%20brown%20and%20beige%20colors%2C%20professional%20periodontic%20instruments%2C%20clean%20medical%20environment&width=400&height=300&seq=service-periodontal-1&orientation=landscape'
    }
  ];

  return (
    <section id="servicos" className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-6">
            Nossos Serviços
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
            Oferecemos uma gama completa de serviços odontológicos com tecnologia de ponta e profissionais especializados.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-amber-800 text-white p-3 rounded-full">
                  <i className={`${service.icon} text-xl w-6 h-6 flex items-center justify-center`}></i>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-stone-800 mb-3">
                  {service.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {service.description}
                </p>
                
                <button className="mt-4 text-amber-800 font-semibold hover:text-amber-900 transition-colors cursor-pointer whitespace-nowrap">
                  Saiba mais →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
