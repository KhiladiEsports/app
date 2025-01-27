function getUsernameFromLocalStorage() {
  return localStorage.getItem('khiladi_local');
}

function fetchUserCoins(username) {
  if (!username) {
    document.getElementById('coins').innerText = "Username not found.";
    window.location.href = 'login.html';
    return;
  }

  const url = 'https://script.google.com/macros/s/AKfycbys0K2NiDYjqgNaZM8WH31_80cEXcI_85V6-60sax_7mqEL_LbxBTIAkTSiJkM5zZAd/exec';

  fetch(url, {
    method: 'POST',
    body: new URLSearchParams({
      username: username
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.coins !== undefined) {
      document.getElementById('coins').innerHTML = `<div class="amount"><img src="https://cdn2.iconfinder.com/data/icons/flat-icons-19/512/Coin.png"> ${data.coins}</div>`;
    } else {
      document.getElementById('coins').innerText = data.error || "Error fetching coins.";
    }
  })
  .catch(error => {
    console.error("Error:", error);
    document.getElementById('coins').innerText = "An error occurred while fetching coins.";
  });
}

document.addEventListener("DOMContentLoaded", function() {
  const username = getUsernameFromLocalStorage();
  fetchUserCoins(username);
});
