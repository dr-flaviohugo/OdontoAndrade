document.addEventListener('DOMContentLoaded', () => {

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animate elements on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    const elementsToAnimate = document.querySelectorAll('.servico-card, #sobre p, #contato form');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // Add a simple fade-in animation style
    const style = document.createElement('style');
    style.innerHTML = `
        .servico-card, #sobre p, #contato form {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .servico-card.visible, #sobre p.visible, #contato form.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);


    // Handle form submission
    const contactForm = document.querySelector('#contato form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = contactForm.querySelector('input[name="name"]').value;
        
        // Simulate form submission
        alert(`Obrigado por sua mensagem, ${name}! Entraremos em contato em breve.`);
        
        contactForm.reset();
    });

});
