
async function apiCall(endpoint, method = 'GET', data = null) {
  try {
    const config = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const result = await response.json();

    return result;

  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: 'Lỗi kết nối: ' + error.message
    };
  }
}

// 📝 Register User
async function registerUser(username, password, confirmPassword) {
  return await apiCall('/auth/register', 'POST', {
    username,
    password,
    confirmPassword
  });
}

// 🔑 Login User
async function loginUser(username, password) {
  return await apiCall('/auth/login', 'POST', {
    username,
    password
  });
}

// 👤 Get Profile (requires token)
async function getProfile() {
  return await apiCall('/auth/profile', 'GET');
}

// 🚀 Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('token') !== null;
}

// 💾 Save login data
function saveLogin(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

// 🗑️ Clear login data
function clearLogin() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// 👁️ Get stored user
function getStoredUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}