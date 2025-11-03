const navbar = document.getElementById('navbar');
const mobileBtn = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const overlay = document.getElementById('overlay');
let menuOpen = false;

// Navbar scroll effect
function handleScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('bg-[#06038D]/80');
  } else {
    navbar.classList.remove('bg-[#06038D]/80');
  }
}
handleScroll();
window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleScroll);

// Mobile menu toggle
mobileBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  menuOpen = !menuOpen;
  mobileMenu.style.right = menuOpen ? '0' : '-70%';
  overlay.classList.toggle('hidden', !menuOpen);
});

document.addEventListener('click', (e) => {
  if (menuOpen && !mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
    closeMenu();
  }
});

overlay.addEventListener('click', closeMenu);
function closeMenu() {
  menuOpen = false;
  mobileMenu.style.right = '-70%';
  overlay.classList.add('hidden');
}

// === Language Toggles (Sync Desktop & Mobile) ===
const langToggle = document.getElementById('lang-toggle');
const langLabel = document.getElementById('lang-label');
const mobileLangToggle = document.getElementById('mobile-lang-toggle');
const mobileLangLabel = document.getElementById('mobile-lang-label');

function updateLanguageUI(isEnglish) {
  langLabel.textContent = isEnglish ? 'ENG' : 'TAMIL';
  mobileLangLabel.textContent = isEnglish ? 'ENG' : 'TAMIL';
  langToggle.checked = isEnglish;
  mobileLangToggle.checked = isEnglish;
}

// Desktop toggle
langToggle.addEventListener('change', () => {
  updateLanguageUI(langToggle.checked);
});

// Mobile toggle
mobileLangToggle.addEventListener('change', () => {
  updateLanguageUI(mobileLangToggle.checked);
});

// Default: Tamil
updateLanguageUI(false);


const slides = document.querySelectorAll('.slide');
const boxes = document.querySelectorAll('.slide-box');
const prevBtn = document.getElementById('prev-slide');
const nextBtn = document.getElementById('next-slide');

let current = 0;
let autoSlide;

// Show slide function
function showSlide(i) {
  slides.forEach((slide, idx) => {
    slide.style.opacity = idx === i ? '1' : '0';
    slide.style.transition = 'opacity 1s ease-in-out';
  });

  boxes.forEach(box => box.classList.toggle('hidden', box.dataset.slide != i));
}

// Next slide
function nextSlide() {
  current = (current + 1) % slides.length;
  showSlide(current);
}

// Previous slide
function prevSlideFunc() {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
}

// Auto slide
function startAutoSlide() {
  autoSlide = setInterval(nextSlide, 4000);
}

// Stop auto slide
function stopAutoSlide() {
  clearInterval(autoSlide);
}

// Initial display
showSlide(current);
startAutoSlide();

// Arrow navigation
nextBtn.addEventListener('click', () => {
  stopAutoSlide();
  nextSlide();
  startAutoSlide();
});

prevBtn.addEventListener('click', () => {
  stopAutoSlide();
  prevSlideFunc();
  startAutoSlide();
});

// Mouse wheel navigation
let isScrolling = false;
window.addEventListener('wheel', (e) => {
  if (isScrolling) return;
  isScrolling = true;

  stopAutoSlide();

  if (e.deltaY > 0) nextSlide();
  else prevSlideFunc();

  startAutoSlide();

  setTimeout(() => isScrolling = false, 800);
});

// Touch swipe for mobile
let startX = 0;
let endX = 0;

window.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  stopAutoSlide();
});

window.addEventListener('touchmove', (e) => {
  endX = e.touches[0].clientX;
});

window.addEventListener('touchend', () => {
  const deltaX = endX - startX;
  if (Math.abs(deltaX) > 50) {
    if (deltaX < 0) nextSlide(); // swipe left → next
    else prevSlideFunc();         // swipe right → prev
  }
  startAutoSlide();
});



let loggedIn = false;
let selectedCandidate = null;
let generatedOtp = null;


const districtData = {
  "Ariyalur": ["Ariyalur", "Jayankondam"],
  "Chengalpattu": ["Tambaram", "Pallavaram", "Chengalpattu"],
  "Chennai": ["Saidapet", "T. Nagar", "Egmore", "Royapuram", "Velachery","Kolathur"],
  "Coimbatore": ["Coimbatore North", "Coimbatore South", "Pollachi"],
  "Cuddalore": ["Cuddalore", "Panruti", "Kurinjipadi"],
  "Dharmapuri": ["Dharmapuri", "Harur"],
  "Dindigul": ["Dindigul", "Oddanchatram"],
  "Erode": ["Erode East", "Erode West", "Perundurai"],
  "Kallakurichi": ["Kallakurichi", "Chinnasalem"],
  "Kanchipuram": ["Kanchipuram", "Sriperumbudur"],
  "Kanyakumari": ["Nagercoil", "Colachel"],
  "Karur": ["Karur", "Aravakurichi"],
  "Krishnagiri": ["Krishnagiri", "Hosur"],
  "Madurai": ["Madurai Central", "Madurai South", "Melur"],
  "Mayiladuthurai": ["Mayiladuthurai", "Sirkazhi"],
  "Nagapattinam": ["Nagapattinam", "Vedaranyam"],
  "Namakkal": ["Namakkal", "Rasipuram"],
  "Perambalur": ["Perambalur"],
  "Pudukkottai": ["Pudukkottai", "Aranthangi"],
  "Ramanathapuram": ["Ramanathapuram", "Paramakudi"],
  "Ranipet": ["Ranipet", "Arakkonam"],
  "Salem": ["Salem North", "Salem South", "Edappadi"],
  "Sivagangai": ["Sivagangai", "Manamadurai"],
  "Tenkasi": ["Tenkasi", "Sankarankovil"],
  "Thanjavur": ["Thanjavur", "Papanasam"],
  "Theni": ["Theni", "Bodinayakanur"],
  "Thoothukudi": ["Thoothukudi", "Kovilpatti"],
  "Tiruchirappalli": ["Trichy West", "Trichy East", "Lalgudi"],
  "Tirunelveli": ["Tirunelveli", "Palayamkottai"],
  "Tirupathur": ["Tirupathur", "Vaniyambadi"],
  "Tiruppur": ["Tiruppur North", "Tiruppur South"],
  "Tiruvallur": ["Avadi", "Tiruvallur", "Poonamallee"],
  "Tiruvannamalai": ["Tiruvannamalai", "Cheyyar"],
  "Tiruvarur": ["Tiruvarur", "Mannargudi"],
  "Vellore": ["Vellore", "Katpadi"],
  "Viluppuram": ["Viluppuram", "Tindivanam"],
  "Virudhunagar": ["Virudhunagar", "Sivakasi"]
};

// ----------------------
// 🟦 FILTER LOGIC
// ----------------------
const districtFilter = document.getElementById("districtFilter");
const constituencyFilter = document.getElementById("constituencyFilter");
const searchInput = document.getElementById("searchInput");
const candidatesGrid = document.getElementById("candidatesGrid");

// Candidate cards
const allCandidates = [...document.querySelectorAll("#candidatesGrid .group")];

// ✅ Populate districts dropdown
function populateDistricts() {
  districtFilter.innerHTML =
    `<option value="all">District</option>` +
    Object.keys(districtData)
      .map(d => `<option value="${d}">${d}</option>`)
      .join("");
}
populateDistricts();

// ✅ Populate constituencies dynamically
districtFilter.addEventListener("change", () => {
  const selected = districtFilter.value;
  if (selected === "all") {
    constituencyFilter.innerHTML = `<option value="all">Constituency</option>`;
  } else {
    constituencyFilter.innerHTML =
      `<option value="all">Constituency</option>` +
      districtData[selected]
        .map(c => `<option value="${c}">${c}</option>`)
        .join("");
  }
  filterCandidates();
});

function filterCandidates() {
  const district = districtFilter.value.toLowerCase();
  const constituency = constituencyFilter.value.toLowerCase();
  const search = searchInput.value.toLowerCase();

  // Filter matching candidates
  const visible = [];
  const hidden = [];

  allCandidates.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const party = card.dataset.party.toLowerCase();
    const d = card.dataset.district.toLowerCase();
    const c = card.dataset.constituency.toLowerCase();

    const matches =
      (district === "all" || d === district) &&
      (constituency === "all" || c === constituency) &&
      (name.includes(search) || party.includes(search));

    if (matches) visible.push(card);
    else hidden.push(card);
  });

  // Reorder — visible first
  candidatesGrid.innerHTML = "";
  visible.forEach(card => {
    card.classList.remove("hidden");
    candidatesGrid.appendChild(card);
  });
  hidden.forEach(card => {
    card.classList.add("hidden");
    candidatesGrid.appendChild(card);
  });
}

// Reset filters on load
window.addEventListener("load", () => {
  districtFilter.value = "all";
  constituencyFilter.innerHTML = `<option value="all">Constituency</option>`;
  searchInput.value = "";
  filterCandidates();
});

// Apply filtering
[searchInput, constituencyFilter].forEach(el =>
  el.addEventListener("input", filterCandidates)
);

// ----------------------
// 🟩 LOGIN + OTP
// ----------------------
document.querySelectorAll(".group button").forEach(btn => {
  btn.addEventListener("click", e => {
    const candidate = e.target.closest(".group").dataset.name;
    selectedCandidate = { name: candidate, button: e.target };
    if (!loggedIn) openLoginModal();
    else openConfirmModal(candidate);
  });
});

function openLoginModal() {
  const modal = document.getElementById("loginModal");
  modal.style.display = "flex";
  modal.addEventListener("click", e => {
    if (e.target === modal) closeLoginModal();
  });
}
function closeLoginModal() {
  document.getElementById("loginModal").style.display = "none";
}

// ✅ Send OTP
document.getElementById("sendOtpBtn").addEventListener("click", () => {
  const phone = document.getElementById("phone").value.trim();
  if (/^[6-9]\d{9}$/.test(phone)) {
    generatedOtp = Math.floor(100000 + Math.random() * 900000);
    alert(`Your OTP is ${generatedOtp}`); // Simulated OTP
    document.getElementById("otpContainer").classList.remove("hidden");
  } else {
    alert("Enter a valid 10-digit Indian phone number.");
  }
});

// ✅ Verify Login
document.getElementById("loginSubmit").addEventListener("click", () => {
  const name = document.getElementById("loginName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const otp = document.getElementById("otpInput").value.trim();
  const age = parseInt(document.getElementById("loginAge").value.trim());

  if (!name || !phone || !otp || !age) return alert("Please fill all fields.");
  if (!/^[6-9]\d{9}$/.test(phone)) return alert("Invalid phone number.");
  if (otp != generatedOtp) return alert("Incorrect OTP.");
  if (age < 18) return alert("You must be 18 or older to vote.");

  loggedIn = true;
  closeLoginModal();
  openConfirmModal(selectedCandidate.name);
});

// ----------------------
// 🟧 CONFIRM VOTE
// ----------------------
function openConfirmModal(candidate) {
  const modal = document.getElementById("voteConfirmModal");
  modal.style.display = "flex";
  document.getElementById("confirmText").textContent = `Confirm your vote for ${candidate}?`;
  modal.addEventListener("click", e => {
    if (e.target === modal) closeConfirmModal();
  });
}
function closeConfirmModal() {
  document.getElementById("voteConfirmModal").style.display = "none";
}
document.getElementById("confirmVoteBtn").addEventListener("click", () => {
  closeConfirmModal();
  submitVote(selectedCandidate);
});

// ----------------------
// 🟦 SUCCESS MODAL
// ----------------------
function submitVote(candidate) {
  const btn = candidate.button;
  btn.textContent = "Voted";
  btn.disabled = true;
  btn.classList.add("bg-green-700", "cursor-not-allowed");
  document.querySelectorAll(".group button").forEach(other => {
    if (other !== btn) {
      other.disabled = true;
      other.classList.add("bg-gray-400", "cursor-not-allowed");
    }
  });
  const modal = document.getElementById("successModal");
  modal.style.display = "flex";
  modal.addEventListener("click", e => {
    if (e.target === modal) closeSuccessModal();
  });
}
function closeSuccessModal() {
  document.getElementById("successModal").style.display = "none";
}
