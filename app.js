/* Florida Cooling Group — template engine (per-lead config at top) */
const CFG = {
  name: "Florida Cooling Group",
  town: "Delray Beach, FL",
  phone: "+15614002205",
  phoneText: "+1 561-400-2205",
  mode: "us",
  rating: "5.0",
  reviews: 83,
  area: "Delray · Boca · Boynton"
};

const SERVICES = [
  {
    name: "Same-Day AC Diagnostic & Repair",
    cat: "Repair",
    price: 79,
    time: "60–90 min on site",
    desc: "Full pressure and electrical check, the actual fault identified, and a flat repair price before anything is touched. Diagnostic fee comes off the bill when you approve the repair.",
    img: "1621905251189-08b45d6a269e"
  },
  {
    name: "21-Point Seasonal Cooling Tune-Up",
    cat: "Maintenance",
    price: 89,
    time: "≈ 75 min on site",
    desc: "Coil clean, drain clear, refrigerant charge verified, capacitors and contactors tested, airflow measured. The cheap visit that stops the expensive July breakdown.",
    img: "1660330589693-99889d60181e"
  },
  {
    name: "Condensate Drain & Pan Flush",
    cat: "Repair",
    price: 119,
    time: "45–60 min on site",
    desc: "For the ceiling stain and the pan that keeps filling. We flush the line, treat the pan, check the float switch and confirm the condensate actually leaves the house.",
    img: "1615774925655-a0e97fc85c14"
  },
  {
    name: "UV Coil Purifier & Air Quality Upgrade",
    cat: "Air quality",
    price: 249,
    time: "≈ 2 hrs on site",
    desc: "UV-C lamp at the coil plus a filtration upgrade for the musty, dusty air that Florida humidity loves to grow. Installed, sealed and labelled.",
    img: "1758101755915-462eddc23f57"
  },
  {
    name: "Smart Thermostat Install & Setup",
    cat: "Install",
    price: 195,
    time: "≈ 90 min on site",
    desc: "C-wire checked, thermostat mounted and wired properly, app paired, schedules and away mode set up with you — not left on factory defaults.",
    img: "1770625467384-304e461ef1be"
  },
  {
    name: "Central AC Replacement Consultation",
    cat: "Replacement",
    price: 0,
    time: "Free · 45 min",
    desc: "Load checked, existing system assessed, and two honest options quoted side by side: what a repair buys you in years, and what a new system costs. No obligation.",
    img: "1776860150305-108ed577d7d4"
  }
];

const SIZE = [
  { label: "Studio / 1-ton", note: "up to ~600 sqft", add: 0 },
  { label: "2-ton home", note: "~1,200 sqft", add: 30 },
  { label: "3-ton home", note: "~1,800 sqft", add: 60 },
  { label: "4–5 ton home", note: "2,400 sqft+", add: 110 }
];
const COND = [
  { label: "Standard system", note: "single stage", add: 0 },
  { label: "High-efficiency", note: "+SEER2", add: 85 },
  { label: "Heat pump", note: "year-round", add: 120 }
];
const SCHED = [
  { label: "Standard window", note: "this week", add: 0 },
  { label: "Next available", note: "today if routed", add: 0 },
  { label: "After hours", note: "evenings / Sunday", add: 75 }
];

const $ = (s) => document.querySelector(s);
const money = (n) => (n === 0 ? "Free" : "$" + n);

(function marquee() {
  const bits = [
    "Same-day heat dispatch",
    "Licensed & insured",
    "Delray · Boca · Boynton",
    "Flat printed prices",
    "Repair or replace, your call"
  ];
  const one = bits.map((b) => "<span>" + b + " <b>✦</b></span>").join("");
  $("#strip").innerHTML = one + one;
})();

(function menu() {
  $("#pricelist").innerHTML = SERVICES.map((s) => {
    const price = s.price === 0 ? "Free consult" : "From $" + s.price;
    return (
      '<li><div><span class="nm">' + s.name + '</span><span class="sub">' + s.cat +
      ' · ' + s.time + '</span></div><span class="dotsline"></span><span class="pr">' + price + "</span></li>"
    );
  }).join("");
})();

(function hours() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "short", timeZone: "America/New_York" });
  document.querySelectorAll("#hoursList li").forEach((li) => {
    if (li.dataset.day === today) li.classList.add("today");
  });
  $("#yr").textContent = String(new Date().getFullYear());
})();

const stage = $("#stage"), dotsEl = $("#dots"), catsEl = $("#cats");
const cats = ["All", ...Array.from(new Set(SERVICES.map((s) => s.cat)))];
let filter = "All";
let list = SERVICES.slice();
let idx = 0;
let cards = [];
let dragX = 0;

function stepPx() {
  return window.innerWidth < 760 ? 214 : 272;
}

function buildCats() {
  catsEl.innerHTML = cats
    .map((c) => '<button class="pill" type="button" data-cat="' + c + '">' + c + "</button>")
    .join("");
  catsEl.querySelectorAll(".pill").forEach((p) => {
    p.setAttribute("aria-pressed", String(p.dataset.cat === filter));
    p.addEventListener("click", () => {
      filter = p.dataset.cat;
      list = filter === "All" ? SERVICES.slice() : SERVICES.filter((s) => s.cat === filter);
      idx = 0; dragX = 0;
      buildCards(); buildCats(); render(); buildDots();
    });
  });
}

function buildCards() {
  stage.innerHTML = "";
  cards = list.map((s, i) => {
    const el = document.createElement("article");
    el.className = "gcard";
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.innerHTML =
      '<img src="https://images.unsplash.com/photo-' + s.img + '?auto=format&fit=crop&w=640&q=72" alt="" loading="lazy" onerror="this.style.display=\'none\';this.parentNode.classList.add(\'noimg\')">' +
      '<div class="cap"><span class="no">' + String(i + 1).padStart(2, "0") + " · " + s.cat + "</span>" +
      "<h3>" + s.name + "</h3><span class=\"from\">" + (s.price === 0 ? "Free consult" : "From $" + s.price) + "</span></div>";
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openService(i); }
    });
    stage.appendChild(el);
    return el;
  });
}

function render() {
  const step = stepPx();
  cards.forEach((el, i) => {
    const off = i - idx;
    const ang = Math.max(-54, Math.min(54, off * 26));
    const tx = off * step + dragX;
    const tz = -Math.abs(off) * 100;
    el.style.transform = "translateX(" + tx + "px) translateZ(" + tz + "px) rotateY(" + (-ang) + "deg)";
    el.style.zIndex = String(100 - Math.abs(off));
    el.style.filter = Math.abs(off) > 2 ? "brightness(.72)" : "none";
    el.classList.toggle("is-centre", off === 0);
  });
}

function buildDots() {
  dotsEl.innerHTML = list.map((_, i) => '<button class="dot" type="button" aria-label="Card ' + (i + 1) + '"></button>').join("");
  dotsEl.querySelectorAll(".dot").forEach((d, i) => {
    d.addEventListener("click", () => { idx = i; dragX = 0; render(); syncDots(); });
    if (i === idx) d.classList.add("on");
  });
}
function syncDots() {
  dotsEl.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("on", i === idx));
}

function go(n) {
  idx = Math.max(0, Math.min(list.length - 1, idx + n));
  dragX = 0;
  render(); syncDots();
}

$("#prev").addEventListener("click", () => go(-1));
$("#next").addEventListener("click", () => go(1));

let down = false, startX = 0, moved = 0, downCard = -1;
stage.addEventListener("pointerdown", (e) => {
  down = true; startX = e.clientX; moved = 0;
  const c = e.target.closest(".gcard");
  downCard = c ? cards.indexOf(c) : -1;
  stage.classList.add("dragging");
});
window.addEventListener("pointermove", (e) => {
  if (!down) return;
  dragX = e.clientX - startX;
  moved = Math.max(moved, Math.abs(dragX));
  render();
});
window.addEventListener("pointerup", () => {
  if (!down) return;
  down = false;
  stage.classList.remove("dragging");
  const step = stepPx();
  if (moved > 12) {
    const shift = Math.round(-dragX / step);
    idx = Math.max(0, Math.min(list.length - 1, idx + shift));
    dragX = 0; render(); syncDots();
  } else {
    dragX = 0; render();
    if (downCard > -1) {
      if (downCard === idx) openService(idx);
      else { idx = downCard; render(); syncDots(); }
    }
  }
  downCard = -1;
});
window.addEventListener("resize", render);

let current = 0;
let opts = { size: 0, cond: 0, sched: 0 };

function optRow(el, data, key) {
  el.innerHTML = data
    .map((o, i) => '<button class="opt" type="button" data-i="' + i + '">' + o.label + "<small>" + o.note + "</small></button>")
    .join("");
  el.querySelectorAll(".opt").forEach((b) => {
    b.classList.toggle("on", Number(b.dataset.i) === opts[key]);
    b.addEventListener("click", () => {
      opts[key] = Number(b.dataset.i);
      el.querySelectorAll(".opt").forEach((x) => x.classList.toggle("on", x === b));
      price();
    });
  });
}

function price() {
  const base = list[current].price;
  const total = base + SIZE[opts.size].add + COND[opts.cond].add + SCHED[opts.sched].add;
  $("#livePrice").textContent = money(total);
  return total;
}

function openService(i) {
  current = i;
  const s = list[i];
  opts = { size: 0, cond: 0, sched: 0 };
  $("#cfgImg").src = "https://images.unsplash.com/photo-" + s.img + "?auto=format&fit=crop&w=900&q=75";
  $("#cfgImg").alt = s.name;
  $("#cfgCat").textContent = s.cat;
  $("#cfgIndex").textContent = "(" + String(i + 1).padStart(2, "0") + ")";
  $("#cfgName").textContent = s.name;
  $("#cfgDesc").textContent = s.desc;
  $("#cfgTime").textContent = s.time;
  $("#cfgTown").textContent = CFG.town;
  optRow($("#optSize"), SIZE, "size");
  optRow($("#optCond"), COND, "cond");
  optRow($("#optSched"), SCHED, "sched");
  price();
  document.body.classList.add("detail-view");
  $("#detail").classList.add("on");
  buildMore(i);
  window.scrollTo({ top: 0, behavior: "auto" });
}

function buildMore(i) {
  const others = list.filter((_, n) => n !== i).slice(0, 3);
  $("#moreGrid").innerHTML = "";
  others.forEach((s) => {
    const b = document.createElement("button");
    b.className = "mcard";
    b.type = "button";
    b.innerHTML =
      '<img src="https://images.unsplash.com/photo-' + s.img + '?auto=format&fit=crop&w=240&q=65" alt="">' +
      "<div><b>" + s.name + "</b><i>" + (s.price === 0 ? "Free consult" : "From $" + s.price) + "</i></div>";
    b.addEventListener("click", () => {
      const n = list.findIndex((x) => x.name === s.name);
      openService(n);
    });
    $("#moreGrid").appendChild(b);
  });
}

$("#backBtn").addEventListener("click", () => {
  document.body.classList.remove("detail-view");
  $("#detail").classList.remove("on");
  window.scrollTo({ top: 0, behavior: "auto" });
});

let cart = [];

function openDrawer() {
  $("#drawer").classList.add("on");
  $("#drawer").setAttribute("aria-hidden", "false");
  $("#scrim").classList.add("on");
}
function closeDrawer() {
  $("#drawer").classList.remove("on");
  $("#drawer").setAttribute("aria-hidden", "true");
  $("#scrim").classList.remove("on");
}

function paintCart() {
  const body = $("#drawerBody");
  if (!cart.length) {
    body.innerHTML = '<p class="empty">Nothing added yet. Pick a service off the wall and build your estimate.</p>';
  } else {
    body.innerHTML = cart
      .map((c, i) =>
        '<div class="line"><div><b>' + c.name + "</b><span>" + c.detail + "</span>" +
        '<button class="rm" type="button" data-i="' + i + '">remove</button></div>' +
        '<div class="amt">' + money(c.price) + "</div></div>"
      )
      .join("");
    body.querySelectorAll(".rm").forEach((b) => {
      b.addEventListener("click", () => {
        cart.splice(Number(b.dataset.i), 1);
        paintCart(); count();
      });
    });
  }
  const total = cart.reduce((a, c) => a + c.price, 0);
  $("#total").textContent = "$" + total;
  const msg =
    "Hi " + CFG.name + ", I'd like to book: " +
    (cart.length ? cart.map((c) => c.name + " (" + c.detail + ")").join("; ") + ". Estimate " + money(total) + "." : "an estimate.");
  $("#textBtn").href = CFG.mode === "ng"
    ? "https://wa.me/" + CFG.phone.replace("+", "") + "?text=" + encodeURIComponent(msg)
    : "sms:" + CFG.phone + "?&body=" + encodeURIComponent(msg);
}

function count() {
  const n = cart.length;
  [$("#cartCount"), $("#cartCount2")].forEach((el) => {
    if (!el) return;
    el.textContent = n;
    el.classList.toggle("on", n > 0);
  });
}

$("#addBtn").addEventListener("click", () => {
  const s = list[current];
  const total = price();
  cart.push({
    name: s.name,
    price: total,
    detail: SIZE[opts.size].label + " · " + COND[opts.cond].label + " · " + SCHED[opts.sched].label
  });
  paintCart(); count();
  const t = $("#toast");
  t.classList.add("on");
  setTimeout(() => t.classList.remove("on"), 1900);
  openDrawer();
});

["#openEstimate", "#openEstimate2", "#openEstimate3"].forEach((sel) => {
  const el = $(sel);
  if (el) el.addEventListener("click", openDrawer);
});
$("#closeDrawer").addEventListener("click", closeDrawer);
$("#scrim").addEventListener("click", closeDrawer);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});

buildCats();
buildCards();
render();
buildDots();
paintCart();
count();
