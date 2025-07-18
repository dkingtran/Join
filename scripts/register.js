let users = [
    {'email': 'test@example.com', 'password': 'password123'}
]

function addUser() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    users.push({'email': email.value, 'password': password.value});
    // Weiterleitung zur Login-Seite + Nachricht anzeigen: "Erfolgreiche Registrierung"
    window.location.href = 'login.html?message=Registration successful';
}
