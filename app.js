document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Charging Simulator Logic (Only if on Services page) ---
    const gunBtns = document.querySelectorAll('.gun-btn');
    if (gunBtns.length > 0) {
        const simStatus = document.getElementById('sim-status');
        const socValue = document.getElementById('soc-value');
        const powerValue = document.getElementById('power-value');
        const energyValue = document.getElementById('energy-value');
        const stopChargeBtn = document.getElementById('stop-charge-btn');
        const socRing = document.getElementById('soc-ring');
        
        let simInterval = null;
        let currentSoc = 0;
        let currentEnergy = 0.0;
        const targetSoc = 80;
        const maxPower = 180; // 180kW

        // Calculate ring circumference
        const radius = socRing.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        socRing.style.strokeDasharray = `${circumference} ${circumference}`;
        socRing.style.strokeDashoffset = circumference;

        function setProgress(percent) {
            const offset = circumference - percent / 100 * circumference;
            socRing.style.strokeDashoffset = offset;
        }

        function resetSimulator() {
            clearInterval(simInterval);
            currentSoc = Math.floor(Math.random() * 20) + 10;
            currentEnergy = 0.0;
            
            socValue.textContent = currentSoc;
            powerValue.textContent = '0';
            energyValue.textContent = '0.0';
            setProgress(currentSoc);
        }

        gunBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                gunBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                resetSimulator();
                
                simStatus.textContent = `Initializing Gun ${btn.dataset.gun}...`;
                simStatus.style.color = 'var(--primary-green)';
                stopChargeBtn.disabled = false;
                
                setTimeout(() => {
                    startCharging();
                }, 1000);
            });
        });

        stopChargeBtn.addEventListener('click', () => {
            clearInterval(simInterval);
            simStatus.textContent = 'Charging Stopped.';
            simStatus.style.color = '#e74c3c';
            powerValue.textContent = '0';
            stopChargeBtn.disabled = true;
            gunBtns.forEach(b => b.classList.remove('active'));
        });

        function startCharging() {
            simStatus.textContent = 'Charging... (Ultra-Fast 180kW)';
            
            simInterval = setInterval(() => {
                if (currentSoc >= targetSoc) {
                    clearInterval(simInterval);
                    simStatus.textContent = 'Charge Complete (80%)';
                    powerValue.textContent = '0';
                    stopChargeBtn.disabled = true;
                    return;
                }
                
                currentSoc += 1;
                socValue.textContent = currentSoc;
                setProgress(currentSoc);
                
                let currentPower = maxPower;
                if(currentSoc > 60) currentPower = 120;
                if(currentSoc > 70) currentPower = 80;
                powerValue.textContent = currentPower;
                
                currentEnergy += (currentPower * 0.01);
                energyValue.textContent = currentEnergy.toFixed(1);
                
            }, 500);
        }
    }

    // --- 2. Station Locator Logic (Only if on Locations page) ---
    const stationList = document.getElementById('station-list');
    if (stationList) {
        const stations = [
            { name: "Jakhars - Connaught Place", city: "Delhi", status: "Available", guns: 4 },
            { name: "Jakhars - Cyber Hub", city: "Gurgaon", status: "Available", guns: 4 },
            { name: "Jakhars - BKC", city: "Mumbai", status: "Charging", guns: 4 },
            { name: "Jakhars - Whitefield", city: "Bengaluru", status: "Available", guns: 4 },
            { name: "Jakhars - Hitech City", city: "Hyderabad", status: "Charging", guns: 4 }
        ];

        const searchInput = document.getElementById('station-search');

        function renderStations(filter = "") {
            stationList.innerHTML = '';
            const filtered = stations.filter(s => 
                s.name.toLowerCase().includes(filter.toLowerCase()) || 
                s.city.toLowerCase().includes(filter.toLowerCase())
            );

            filtered.forEach(s => {
                const div = document.createElement('div');
                div.className = 'station-item';
                
                const statusClass = s.status === 'Available' ? 'status-available' : 'status-charging';
                
                div.innerHTML = `
                    <h4>${s.name}</h4>
                    <p style="font-size:0.9rem; color:#666;">${s.city} • ${s.guns} Guns (180kW)</p>
                    <span class="status-badge ${statusClass}">${s.status}</span>
                `;
                stationList.appendChild(div);
            });
        }

        renderStations();

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                renderStations(e.target.value);
            });
        }
    }

    // --- 3. Calculator Logic (Only if on About page) ---
    const kmSlider = document.getElementById('km-slider');
    if (kmSlider) {
        const kmVal = document.getElementById('km-val');
        const co2Val = document.getElementById('co2-val');
        const moneyVal = document.getElementById('money-val');

        kmSlider.addEventListener('input', (e) => {
            const km = parseInt(e.target.value);
            kmVal.textContent = km;
            
            const co2Saved = Math.round(km * 0.153);
            co2Val.textContent = co2Saved;
            
            const moneySaved = Math.round(km * 5.1);
            moneyVal.textContent = moneySaved;
        });
    }

    // --- 4. Contact Form Logic (Only if on Contact page) ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            document.getElementById('form-success').style.display = 'block';
            contactForm.reset();
            setTimeout(() => {
                document.getElementById('form-success').style.display = 'none';
            }, 4000);
        });
    }

    // --- 5. Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        observer.observe(el);
    });
});
