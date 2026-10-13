(function () {
  var b = document.querySelector(".burger"),
    m = document.getElementById("menu");
  b.addEventListener("click", function () {
    var o = m.classList.toggle("open");
    b.setAttribute("aria-expanded", o);
  });
  function $(i) {
    return document.getElementById(i);
  }
  function setErr(id, msg) {
    var el = $(id),
      e = el.parentNode.querySelector(".err");
    if (e) e.textContent = msg || "";
    el.classList.toggle("bad", !!msg);
    el.setAttribute("aria-invalid", !!msg);
    return !msg;
  }
  function wire(formId, rules, okMsg) {
    var f = $(formId);
    if (!f) return;
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var ok = true;
      for (var id in rules) {
        var msg = rules[id]($(id).value.trim());
        if (!setErr(id, msg)) ok = false;
      }
      var out = f.querySelector(".ok");
      if (ok) {
        out.textContent = okMsg;
        f.reset();
      } else {
        out.textContent = "";
        var first = f.querySelector(".bad");
        if (first) first.focus();
      }
    });
    f.addEventListener("input", function (ev) {
      if (ev.target.classList.contains("bad") && rules[ev.target.id])
        setErr(ev.target.id, rules[ev.target.id](ev.target.value.trim()));
    });
  }
  var req = function (t) {
    return function (v) {
      return v ? "" : t;
    };
  };
  var email = function (v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? ""
      : "Enter a valid email, like name@example.com.";
  };
  var phone = function (v) {
    return /^(\+94|0)\d{9}$/.test(v.replace(/[\s-]/g, ""))
      ? ""
      : "Enter a valid Sri Lankan number, like 0771234567.";
  };
  wire(
    "contactForm",
    {
      cname: req("Enter your name."),
      cemail: email,
      cmsg: function (v) {
        return v.length >= 10 ? "" : "Write at least 10 characters.";
      },
    },
    "Thank you. We received your message and will reply within one working day.",
  );
  wire(
    "apptForm",
    {
      aname: req("Enter your name."),
      aphone: phone,
      adept: req("Select a department."),
      adate: function (v) {
        if (!v) return "Choose a date.";
        return new Date(v) < new Date(new Date().toDateString())
          ? "Choose today or a later date."
          : "";
      },
      atime: req("Select a time."),
    },
    "Request received. We will call you to confirm your appointment.",
  );
  wire(
    "regForm",
    {
      name: function (v) {
        return /^[A-Za-z .'-]{3,}$/.test(v) && v.indexOf(" ") > 0
          ? ""
          : "Enter your full name (first and last, letters only).";
      },
      username: function (v) {
        return /^[A-Za-z0-9_]{4,}$/.test(v)
          ? ""
          : "Use 4 or more letters, numbers or underscores.";
      },
      email: email,
      nic: function (v) {
        return /^(\d{9}[VvXx]|\d{12})$/.test(v)
          ? ""
          : "Enter 9 digits plus V or X, or 12 digits.";
      },
      date: function (v) {
        if (!v) return "Enter your date of birth.";
        return new Date(v) > new Date()
          ? "Date of birth cannot be in the future."
          : "";
      },
      number: phone,
      password: function (v) {
        return v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v)
          ? ""
          : "Use at least 8 characters with letters and numbers.";
      },
      cPassword: function (v) {
        return v && v === $("password").value ? "" : "Passwords do not match.";
      },
    },
    "Registration received. Our team will contact you to activate your account.",
  );
  var p = new URLSearchParams(location.search).get("doctor"),
    d = $("adept");
  if (p && d)
    for (var i = 0; i < d.options.length; i++)
      if (d.options[i].text === p) d.selectedIndex = i;
  var dt = $("adate");
  if (dt) dt.min = new Date().toISOString().slice(0, 10);
})();
