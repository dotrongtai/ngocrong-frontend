// ⚙️ API Base URL - trỏ sang backend đã deploy trên Railway
const API_BASE_URL = "https://ngocrong-backend-production.up.railway.app/api";

const loginLink = document.getElementById('loginLink');
const registerLink = document.getElementById('registerLink');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');
const logoutBtn2 = document.getElementById('logoutBtn2');
const profileLink = document.getElementById('profileLink');

const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');

const profilePage = document.getElementById('profilePage');
const homePage = document.getElementById('homePage');

document.addEventListener("DOMContentLoaded", async () => {
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (headerPlaceholder) {
    try {
      const res = await fetch("header.html");
      const html = await res.text();
      headerPlaceholder.innerHTML = html;
      
      initHeaderEvents();
      checkAuthStatus();
    } catch (err) {
      console.error(err);
    }
  } else {
    checkAuthStatus();
  }
  

  const captchaBox = document.getElementById("captchaBox");
  const refreshCaptchaBtn = document.getElementById("refreshCaptcha");
  let generatedCaptcha = "";

  function generateCaptcha() {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let captcha = "";
    for (let i = 0; i < 4; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    generatedCaptcha = captcha;
    if (captchaBox) {
      captchaBox.innerText = generatedCaptcha;
    }
  }

  if (captchaBox) {
    generateCaptcha();
  }

  if (refreshCaptchaBtn) {
    refreshCaptchaBtn.addEventListener("click", generateCaptcha);
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value;
      const loginCaptchaInput = document.getElementById("loginCaptcha");
      const msgDiv = document.getElementById("loginMessage");

      if (loginCaptchaInput) {
        const userInputCaptcha = loginCaptchaInput.value.trim().toUpperCase();
        if (userInputCaptcha !== generatedCaptcha) {
          showMessage(msgDiv, "Mã xác nhận không chính xác!", "error");
          generateCaptcha();
          return;
        }
      }

      if (!username || !password) {
        showMessage(msgDiv, "Vui lòng điền đầy đủ thông tin", "error");
        return;
      }

      if (msgDiv) {
        msgDiv.textContent = "⏳ Đang xử lý...";
        msgDiv.className = "message";
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (data.success) {
          showMessage(msgDiv, "✅ Đăng nhập thành công!", "success");
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          setTimeout(() => {
            window.location.href = "index.html";
          }, 1000);
        } else {
          showMessage(msgDiv, data.message, "error");
          if (loginCaptchaInput) generateCaptcha();
        }
      } catch (err) {
        showMessage(msgDiv, "Lỗi kết nối đến server!", "error");
        if (loginCaptchaInput) generateCaptcha();
      }
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("registerUsername").value.trim();
      const password = document.getElementById("registerPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const msgDiv = document.getElementById("registerMessage");

      if (!username || !password || !confirmPassword) {
        showMessage(msgDiv, "Vui lòng điền đầy đủ thông tin", "error");
        return;
      }

      if (password !== confirmPassword) {
        showMessage(msgDiv, "Mật khẩu không khớp", "error");
        return;
      }

      if (msgDiv) {
        msgDiv.textContent = "⏳ Đang xử lý...";
        msgDiv.className = "message";
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, confirmPassword })
        });
        const data = await response.json();

        if (data.success) {
          showMessage(msgDiv, "✅ Đăng ký thành công! Đang chuyển hướng...", "success");
          setTimeout(() => {
            window.location.href = "login.html";
          }, 1500);
        } else {
          showMessage(msgDiv, data.message, "error");
        }
      } catch (err) {
        showMessage(msgDiv, "Lỗi kết nối đến server!", "error");
      }
    });
  }

  const isProfilePage = window.location.pathname.includes("profile");
  if (isProfilePage) {
    loadProfileData();
  }

  const changePasswordForm = document.getElementById("changePasswordForm");
  if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const oldPassword = document.getElementById("oldPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const msgDiv = document.getElementById("changePasswordMessage");

      if (!oldPassword || !newPassword) {
        showMessage(msgDiv, "Vui lòng điền đầy đủ thông tin", "error");
        return;
      }

      if (newPassword.length < 6) {
        showMessage(msgDiv, "Mật khẩu mới phải từ 6 ký tự trở lên", "error");
        return;
      }

      if (msgDiv) {
        msgDiv.textContent = "⏳ Đang xử lý...";
        msgDiv.className = "message";
      }

      try {
        const result = await apiCall("/auth/change-password", "POST", { oldPassword, newPassword });

        if (result.success) {
          showMessage(msgDiv, "✅ Đổi mật khẩu thành công!", "success");
          changePasswordForm.reset();
          setTimeout(() => {
            closeModal("changePasswordModal");
          }, 1500);
        } else {
          showMessage(msgDiv, result.message || "Đổi mật khẩu thất bại", "error");
        }
      } catch (err) {
        showMessage(msgDiv, "Lỗi kết nối đến server!", "error");
      }
    });
  }
});

function initHeaderEvents() {
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutBtn2 = document.getElementById("logoutBtn2");
  
  const handleLogout = (e) => {
    e.preventDefault();
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "index.html";
    }
  };

  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
  if (logoutBtn2) logoutBtn2.addEventListener("click", handleLogout);
}

async function checkAuthStatus() {
  const token = localStorage.getItem("token");
  const guestLinks = document.getElementById("guestLinks");
  const userDropdown = document.getElementById("userDropdown");
  const rechargeNav = document.getElementById("rechargeNav");
  const navUsername = document.getElementById("navUsername");

  if (token) {
    if (guestLinks) guestLinks.classList.add("hidden");
    if (userDropdown) userDropdown.classList.remove("hidden");
    if (rechargeNav) rechargeNav.classList.remove("hidden");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        if (navUsername) navUsername.innerText = data.user.username;
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    if (guestLinks) guestLinks.classList.remove("hidden");
    if (userDropdown) userDropdown.classList.add("hidden");
    if (rechargeNav) rechargeNav.classList.add("hidden");
  }
}

async function loadProfileData() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await response.json();

    if (data.success) {
      document.getElementById("profileUsername").innerText = data.user.username;
      if (data.user.create_time) {
        document.getElementById("profileCreated").innerText = new Date(data.user.create_time).toLocaleDateString("vi-VN");
      }
      const tongnapEl = document.getElementById("profileTongnap");
      const vndEl = document.getElementById("profileVnd");
      if (tongnapEl) tongnapEl.innerText = Number(data.user.tongnap || 0).toLocaleString("vi-VN") + "đ";
      if (vndEl) vndEl.innerText = Number(data.user.vnd || 0).toLocaleString("vi-VN") + "đ";
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "login.html";
    }
  } catch (err) {
    console.error(err);
  }
}

function openRechargeModal() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Vui lòng đăng nhập để nạp thẻ!");
    window.location.href = "login.html";
    return;
  }
  openModal('rechargeModal');
}

function showMessage(element, message, type) {
  if (!element) return;
  element.textContent = message;
  element.className = `message ${type}`;
  
  setTimeout(() => {
    element.textContent = "";
    element.className = "message";
  }, 5000);
}