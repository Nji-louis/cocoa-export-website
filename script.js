// Toggle mobile menu
function toggleMenu() {
  const navMenu = document.getElementById('navMenu');
  navMenu.classList.toggle('active'); // toggles "active" class to show/hide menu
}

function toggleMenu() {
document.getElementById('navMenu').classList.toggle('active');
}


// Hero slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('heroDots');


slides.forEach((_, i) => {
const dot = document.createElement('span');
if(i===0) dot.classList.add('active');
dot.addEventListener('click', () => showSlide(i));
dotsContainer.appendChild(dot);
});
const dots = dotsContainer.querySelectorAll('span');


function showSlide(n){
slides[currentSlide].classList.remove('active');
dots[currentSlide].classList.remove('active');
currentSlide = n;
slides[currentSlide].classList.add('active');
dots[currentSlide].classList.add('active');
}


function changeSlide(n){
let next = currentSlide + n;
if(next < 0) next = slides.length - 1;
if(next >= slides.length) next = 0;
showSlide(next);
}


setInterval(()=>changeSlide(1),5000);








// ================= ABOUT COUNTERS =================


(() => {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.dataset.target;
      const count = +counter.innerText;
      const increment = target / 200;
      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 20);
      } else counter.innerText = target;
    }
    updateCount();
  });
})();










// PRODUCT CLICK CARD → SCROLL TO SECTION


document.querySelectorAll('.product-card').forEach(card=>{
card.addEventListener('click',()=>{
const type=card.dataset.type;
document.getElementById(type).scrollIntoView({behavior:'smooth'});
})
})


// FILTER


const filter=document.getElementById('filterType');
const search=document.getElementById('searchInput');
const cards=document.querySelectorAll('.product-card');


function applyFilter(){
const f=filter.value;
const s=search.value.toLowerCase();


cards.forEach(card=>{
const type=card.dataset.type;
const text=card.dataset.search;


const matchFilter=(f==='all'||f===type);
const matchSearch=text.includes(s);


card.style.display=(matchFilter&&matchSearch)?'block':'none';
})
}


filter.addEventListener('change',applyFilter);
search.addEventListener('input',applyFilter);










// Toggle window
const waBtn = document.getElementById("waSuiteBtn");
const waWindow = document.getElementById("waSuiteWindow");
const bubble = document.getElementById("waWelcomeBubble");

waBtn.addEventListener("click", () => {
  waWindow.style.display =
    waWindow.style.display === "block" ? "none" : "block";
  bubble.style.display = "none";
});

// Direct WhatsApp click for each agent
document.querySelectorAll(".wa-agent").forEach(agent => {
  agent.addEventListener("click", () => {
    const number = agent.getAttribute("data-number");
    const msg = agent.getAttribute("data-msg");
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, "_blank");
  });
});

// Dark Mode
const toggle = document.getElementById("waDarkToggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});




// GALLERY

// ============================================
// Google Gallery JS (With Swipe + Keyboard)
// ============================================
const video = document.querySelector(".hero-video");
  const controlBtn = document.querySelector(".video-control");

  const videos = [
    "videos/gallery1.mp4",
    "videos/gallery2.mp4",
    "videos/gallery3.mp4"
  ];

  let currentVideo = 0;

  // Play / Pause functionality
  controlBtn.addEventListener("click", () => {
    if (video.paused) {
      video.play();
      controlBtn.textContent = "❚❚";
    } else {
      video.pause();
      controlBtn.textContent = "▶";
    }
  });

  // Automatically switch videos when one ends
  video.addEventListener("ended", () => {
    currentVideo = (currentVideo + 1) % videos.length;
    video.src = videos[currentVideo];
    video.play();
  });




let gpSlideIndex = 1;
gpShowSlides(gpSlideIndex);

// Next / Prev
function gpPlusSlides(n) {
  gpShowSlides(gpSlideIndex += n);
}

// Thumbnails
function gpCurrentSlide(n) {
  gpShowSlides(gpSlideIndex = n);
}

function gpShowSlides(n) {
  let i;
  const slides = document.getElementsByClassName("gp-slide");
  const thumbs = document.getElementsByClassName("gp-thumb");

  if (n > slides.length) gpSlideIndex = 1;
  if (n < 1) gpSlideIndex = slides.length;

  for (i = 0; i < slides.length; i++) slides[i].style.display = "none";
  for (i = 0; i < thumbs.length; i++) thumbs[i].classList.remove("active");

  slides[gpSlideIndex - 1].style.display = "block";
  thumbs[gpSlideIndex - 1].classList.add("active");
}

// ============================================
// Lightbox
// ============================================

const lightbox = document.getElementById("gpLightbox");
const lightboxImg = document.getElementById("gpLightboxImg");
const lightboxCaption = document.getElementById("gpLightboxCaption");

// Open lightbox on slide click
document.querySelectorAll(".gp-slide img").forEach((img, index) => {
  img.addEventListener("click", () => {
    openLightbox(img.src, img.alt);
    gpCurrentSlide(index + 1); 
  });
});

function openLightbox(src, caption) {
  lightbox.style.display = "block";
  lightboxImg.src = src;
  lightboxCaption.innerHTML = caption;
}

function closeLightbox() {
  lightbox.style.display = "none";
}

// ============================================
// Keyboard Navigation
// ============================================

document.addEventListener("keydown", function(event) {

  // Left arrow
  if (event.key === "ArrowLeft") {
    gpPlusSlides(-1);
  }

  // Right arrow
  if (event.key === "ArrowRight") {
    gpPlusSlides(1);
  }

  // ESC closes lightbox
  if (event.key === "Escape") {
    closeLightbox();
  }
});

// ============================================
// Touch / Swipe Support (Mobile)
// ============================================

let touchStartX = 0;
let touchEndX = 0;

// For main slideshow container
const gpContainer = document.querySelector(".gp-gallery-container");

// Detect touch start
gpContainer.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

// Detect touch end
gpContainer.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

// Logic for swipe
function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;

  if (Math.abs(swipeDistance) < 50) return; // Ignore tiny swipes

  // Swipe right → previous slide
  if (swipeDistance > 50) {
    gpPlusSlides(-1);
  }

  // Swipe left → next slide
  if (swipeDistance < -50) {
    gpPlusSlides(1);
  }
}











// Forastero
// Modal for clickable images
    const modal = document.getElementById("imgModal");
    const modalImg = document.getElementById("modalImg");
    const images = document.querySelectorAll(".clickable");
    const close = document.getElementsByClassName("close")[0];

    images.forEach(img => {
      img.onclick = function(){
        modal.style.display = "block";
        modalImg.src = this.src;
      }
    });

    close.onclick = function() { modal.style.display = "none"; }
    modal.onclick = function(e) { if(e.target === modal) modal.style.display = "none"; }





    // CONTACT
    const form = document.getElementById("contactForm");
  const successMsg = document.querySelector(".form-success");
  const errorMsg = document.querySelector(".form-error");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    successMsg.hidden = true;
    errorMsg.hidden = true;

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        successMsg.hidden = false;
        form.reset();
      } else {
        errorMsg.hidden = false;
      }
    } catch (error) {
      errorMsg.hidden = false;
    }
  });