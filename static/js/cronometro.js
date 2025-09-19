class Cronometro {
    constructor() {
        this.totalTime = 15 * 60; // 15 minutos en segundos
        this.currentTime = this.totalTime;
        this.isRunning = false;
        this.intervalId = null;
        this.sectionStartTime = 0;
        this.currentSectionIndex = -1;
        this.sections = [];
        
        // No inicializar elementos aquí, se hará en initializeElements()
    }
    
    initializeElements() {
        this.timerElement = document.getElementById('timer');
        this.startButton = document.getElementById('startTimer');
        this.pauseButton = document.getElementById('pauseTimer');
        this.resetButton = document.getElementById('resetTimer');
        this.sectionTimerElement = document.getElementById('sectionTimer');
        this.currentSectionElement = document.getElementById('currentSection');
        this.nextSectionButton = document.getElementById('nextSection');
        this.agendaList = document.getElementById('agendaList');
        
        // Verificar que todos los elementos existen
        const elements = [
            this.timerElement, this.startButton, this.pauseButton, 
            this.resetButton, this.sectionTimerElement, 
            this.currentSectionElement, this.nextSectionButton, this.agendaList
        ];
        
        for (const element of elements) {
            if (!element) {
                console.error('Elemento no encontrado:', element);
                return false;
            }
        }
        
        return true;
    }
    
    initializeEvents() {
        if (this.startButton) this.startButton.addEventListener('click', () => this.start());
        if (this.pauseButton) this.pauseButton.addEventListener('click', () => this.pause());
        if (this.resetButton) this.resetButton.addEventListener('click', () => this.reset());
        if (this.nextSectionButton) this.nextSectionButton.addEventListener('click', () => this.nextSection());
    }
    
    initializeSections() {
        // Obtener todas las secciones con su tiempo asignado
        if (!this.agendaList) return;
        
        const sectionItems = this.agendaList.querySelectorAll('li[data-time]');
        this.sections = Array.from(sectionItems).map(item => {
            return {
                element: item,
                time: parseInt(item.getAttribute('data-time')) * 60, // Convertir a segundos
                elapsed: 0
            };
        });
    }
    
    start() {
        if (!this.isRunning) {
            // Verificar que los elementos están inicializados
            if (this.sections.length === 0) {
                this.initializeSections();
            }
            
            this.isRunning = true;
            if (this.startButton) this.startButton.style.display = 'none';
            if (this.pauseButton) this.pauseButton.style.display = 'inline-block';
            if (this.nextSectionButton) this.nextSectionButton.style.display = 'inline-block';
            
            // Si es la primera vez que se inicia, comenzar con la primera sección
            if (this.currentSectionIndex === -1) {
                this.nextSection();
            }
            
            this.intervalId = setInterval(() => this.update(), 1000);
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            if (this.startButton) this.startButton.style.display = 'inline-block';
            if (this.pauseButton) this.pauseButton.style.display = 'none';
            clearInterval(this.intervalId);
        }
    }
    
    reset() {
        this.pause();
        this.currentTime = this.totalTime;
        this.currentSectionIndex = -1;
        this.sections.forEach(section => section.elapsed = 0);
        this.updateTimerDisplay();
        if (this.currentSectionElement) this.currentSectionElement.textContent = 'Sección actual: -';
        if (this.sectionTimerElement) this.sectionTimerElement.textContent = '00:00';
        if (this.startButton) this.startButton.style.display = 'inline-block';
        if (this.pauseButton) this.pauseButton.style.display = 'none';
        if (this.nextSectionButton) this.nextSectionButton.style.display = 'none';
        
        // Remover resaltado de todas las secciones
        this.sections.forEach(section => {
            if (section.element) section.element.classList.remove('active');
        });
    }
    
    nextSection() {
        // Si hay una sección activa, detener su tiempo
        if (this.currentSectionIndex >= 0 && this.sections[this.currentSectionIndex]) {
            const currentSection = this.sections[this.currentSectionIndex];
            if (currentSection.element) currentSection.element.classList.remove('active');
        }
        
        // Avanzar a la siguiente sección
        this.currentSectionIndex++;
        
        // Si hemos pasado todas las secciones, finalizar
        if (this.currentSectionIndex >= this.sections.length) {
            this.pause();
            alert('¡La reunión ha finalizado!');
            return;
        }
        
        // Iniciar la nueva sección
        const newSection = this.sections[this.currentSectionIndex];
        if (newSection && newSection.element) {
            newSection.element.classList.add('active');
            this.sectionStartTime = this.currentTime;
            if (this.currentSectionElement) {
                this.currentSectionElement.textContent = `Sección actual: ${newSection.element.textContent.split('(')[0]}`;
            }
        }
    }
    
    update() {
        if (this.currentTime > 0) {
            this.currentTime--;
            
            // Actualizar el tiempo de la sección actual
            if (this.currentSectionIndex >= 0 && this.sections[this.currentSectionIndex]) {
                const currentSection = this.sections[this.currentSectionIndex];
                const sectionElapsed = this.sectionStartTime - this.currentTime;
                currentSection.elapsed = sectionElapsed;
                
                // Actualizar el cronómetro de sección
                const sectionRemaining = currentSection.time - sectionElapsed;
                if (this.sectionTimerElement) {
                    this.sectionTimerElement.textContent = this.formatTime(sectionRemaining);
                }
                
                // Si el tiempo de la sección se agotó, avanzar automáticamente
                if (sectionRemaining <= 0) {
                    this.nextSection();
                }
            }
            
            this.updateTimerDisplay();
        } else {
            this.pause();
            alert('¡Tiempo de reunión agotado!');
        }
    }
    
    updateTimerDisplay() {
        if (this.timerElement) {
            this.timerElement.textContent = this.formatTime(this.currentTime);
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// Función para inicializar el cronómetro cuando el documento esté listo
function initializeCronometro() {
    const cronometro = new Cronometro();
    
    // Intentar inicializar los elementos
    if (cronometro.initializeElements()) {
        cronometro.initializeEvents();
        cronometro.initializeSections();
        window.cronometro = cronometro;
    } else {
        console.error('No se pudieron inicializar todos los elementos del cronómetro');
        // Reintentar después de un breve delay por si el DOM no está completamente cargado
        setTimeout(initializeCronometro, 100);
    }
}

// Inicializar el cronómetro cuando el documento esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCronometro);
} else {
    initializeCronometro();
}