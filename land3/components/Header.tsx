
'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-sm fixed w-full top-0 z-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <span className="text-2xl font-['Pacifico'] text-amber-800">Odonto Andrade</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#inicio" className="text-stone-700 hover:text-amber-800 transition-colors cursor-pointer">
              Início
            </Link>
            <Link href="#servicos" className="text-stone-700 hover:text-amber-800 transition-colors cursor-pointer">
              Serviços
            </Link>
            <Link href="#depoimentos" className="text-stone-700 hover:text-amber-800 transition-colors cursor-pointer">
              Depoimentos
            </Link>
            <Link href="#contato" className="text-stone-700 hover:text-amber-800 transition-colors cursor-pointer">
              Contato
            </Link>
            <button className="bg-amber-800 text-white px-6 py-3 rounded-full hover:bg-amber-900 transition-colors cursor-pointer whitespace-nowrap">
              Agendar Consulta
            </button>
          </nav>

          <div className="md:hidden">
            <button className="text-stone-700 w-6 h-6 flex items-center justify-center cursor-pointer">
              <i className="ri-menu-line w-6 h-6"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
