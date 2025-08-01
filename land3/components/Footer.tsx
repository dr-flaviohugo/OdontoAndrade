
'use client';

export default function Footer() {
  return (
    <footer className="bg-stone-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="mb-6">
              <span className="text-2xl font-['Pacifico'] text-amber-400">Odonto Andrade</span>
            </div>
            <p className="text-stone-300 leading-relaxed">
              Cuidando do seu sorriso com excelência, tecnologia e carinho há mais de 15 anos.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="bg-amber-800 text-white p-2 rounded-full hover:bg-amber-900 transition-colors cursor-pointer">
                <i className="ri-facebook-fill w-5 h-5 flex items-center justify-center"></i>
              </a>
              <a href="#" className="bg-amber-800 text-white p-2 rounded-full hover:bg-amber-900 transition-colors cursor-pointer">
                <i className="ri-instagram-line w-5 h-5 flex items-center justify-center"></i>
              </a>
              <a href="#" className="bg-amber-800 text-white p-2 rounded-full hover:bg-amber-900 transition-colors cursor-pointer">
                <i className="ri-whatsapp-line w-5 h-5 flex items-center justify-center"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Serviços</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-stone-300 hover:text-white transition-colors cursor-pointer">Clínica Geral</a></li>
              <li><a href="#" className="text-stone-300 hover:text-white transition-colors cursor-pointer">Cirurgia Oral</a></li>
              <li><a href="#" className="text-stone-300 hover:text-white transition-colors cursor-pointer">Estética Dental</a></li>
              <li><a href="#" className="text-stone-300 hover:text-white transition-colors cursor-pointer">Ortodontia</a></li>
              <li><a href="#" className="text-stone-300 hover:text-white transition-colors cursor-pointer">Odontopediatria</a></li>
              <li><a href="#" className="text-stone-300 hover:text-white transition-colors cursor-pointer">Periodontia</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center text-amber-400"></i>
                <span className="text-stone-300">Rua das Flores, 123 - Centro</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="ri-phone-line w-4 h-4 flex items-center justify-center text-amber-400"></i>
                <span className="text-stone-300">(11) 3456-7890</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="ri-mail-line w-4 h-4 flex items-center justify-center text-amber-400"></i>
                <span className="text-stone-300">contato@odontoandrade.com.br</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Horários</h3>
            <div className="space-y-2 text-stone-300">
              <div className="flex justify-between">
                <span>Seg - Sex:</span>
                <span>08:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sábado:</span>
                <span>08:00 - 12:00</span>
              </div>
              <div className="flex justify-between">
                <span>Domingo:</span>
                <span>Fechado</span>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-amber-800 text-white py-3 rounded-lg hover:bg-amber-900 transition-colors cursor-pointer font-semibold whitespace-nowrap">
              Emergência 24h
            </button>
          </div>
        </div>

        <div className="border-t border-stone-700 mt-12 pt-8 text-center">
          <p className="text-stone-400">
            © 2024 Clínica Odonto Andrade. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
